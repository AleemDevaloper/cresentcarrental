<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TenantController extends Controller
{
    public function index()
    {
        return response()->json(Tenant::with('modules')->latest()->get()->map(fn (Tenant $tenant) => $this->serializeTenant($tenant)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:tenants,domain',
            'database' => 'required|string|unique:tenants,database',
        ]);

        $tenant = Tenant::create($validated);

        // Logic to create database and run migrations would go here
        // This is complex on shared hosting but possible on VPS/Dedicated
        // For now, we assume the DB is created manually or via a script

        return response()->json($tenant, 201);
    }

    public function provision(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'subdomain' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i'],
            'custom_domain' => ['nullable', 'string', 'max:255', 'regex:/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i'],
            'plan' => 'nullable|string|max:80',
            'sandbox' => 'boolean',
            'modules' => 'array',
            'modules.*' => 'string|max:30',
            'quotas' => 'nullable|array',
            'company' => 'nullable|array',
            'admin.name' => 'nullable|string|max:255',
            'admin.email' => 'nullable|email|max:255',
            'admin.password' => 'nullable|string|min:6',
            'run_migrations' => 'boolean',
        ]);

        $subdomain = Str::slug($validated['subdomain']);
        if ($subdomain === '' || in_array($subdomain, ['www', 'api', 'admin', 'app', 'mail'], true)) {
            throw ValidationException::withMessages(['subdomain' => 'This subdomain is not available.']);
        }
        $baseDomain = config('app.tenant_base_domain');
        $customDomain = isset($validated['custom_domain']) ? strtolower($validated['custom_domain']) : null;
        $domain = $customDomain ?: $subdomain . '.' . $baseDomain;
        $database = 'manage_core_' . Str::snake($subdomain);
        if (Tenant::where('domain', $domain)->where(function ($query) use ($subdomain) {
            $query->whereNull('subdomain')->orWhere('subdomain', '!=', $subdomain);
        })->exists()) {
            throw ValidationException::withMessages(['custom_domain' => 'This domain is already assigned to another tenant.']);
        }
        $modules = array_values(array_unique(array_map('strtoupper', $validated['modules'] ?? [])));

        DB::statement("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        $tenant = Tenant::updateOrCreate(
            ['subdomain' => $subdomain],
            [
                'name' => $validated['company_name'],
                'database' => $database,
                'domain' => $domain,
                'status' => 'active',
                'settings' => [
                    'subdomain' => $subdomain,
                    'custom_domain' => $customDomain,
                    'plan' => $validated['plan'] ?? 'Enterprise',
                    'sandbox' => (bool) ($validated['sandbox'] ?? false),
                    'quotas' => $validated['quotas'] ?? [],
                    'company' => $validated['company'] ?? [],
                ],
            ]
        );

        if ($request->boolean('run_migrations', true)) {
            $this->migrateTenantDatabase($tenant);
        }

        $this->syncModules($tenant, $modules, $validated['plan'] ?? 'Enterprise');

        if (!empty($validated['admin']['email']) && !empty($validated['admin']['password'])) {
            $this->upsertTenantAdmin($tenant, $validated['admin']);
        }

        return response()->json([
            'data' => $this->serializeTenant($tenant->fresh('modules')),
            'message' => 'Tenant provisioned successfully.',
        ], 201);
    }

    public function show(Tenant $tenant)
    {
        return response()->json($tenant);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'status' => 'string|in:active,suspended,cancelled',
            'settings' => 'array',
        ]);

        if (array_key_exists('settings', $validated)) {
            $validated['settings'] = array_replace_recursive($tenant->settings ?? [], $validated['settings'] ?? []);
        }

        $tenant->update($validated);

        return response()->json($tenant);
    }

    public function syncSystems(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*' => 'string|max:30',
            'license_type' => 'nullable|string|max:80',
        ]);

        $this->syncModules(
            $tenant,
            array_values(array_unique(array_map('strtoupper', $validated['modules']))),
            $validated['license_type'] ?? ($tenant->settings['plan'] ?? 'Enterprise')
        );

        return response()->json([
            'data' => $this->serializeTenant($tenant->fresh('modules')),
            'message' => 'Tenant systems updated.',
        ]);
    }

    public function users(Tenant $tenant)
    {
        $this->configureTenantConnection($tenant);

        $users = DB::connection('tenant')->table('users')
            ->leftJoin('permission_user', 'users.id', '=', 'permission_user.user_id')
            ->leftJoin('permissions', 'permission_user.permission_id', '=', 'permissions.id')
            ->select('users.id', 'users.name', 'users.email', 'users.role', DB::raw("GROUP_CONCAT(permissions.slug) as permission_slugs"))
            ->groupBy('users.id', 'users.name', 'users.email', 'users.role')
            ->orderBy('users.name')
            ->get()
            ->map(function ($user) {
                $permissions = array_values(array_filter(explode(',', (string) $user->permission_slugs)));

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'systems' => collect($permissions)
                        ->filter(fn ($slug) => str_starts_with($slug, 'system_'))
                        ->map(fn ($slug) => strtoupper(str_replace('system_', '', $slug)))
                        ->values()
                        ->all(),
                    'permissions' => $permissions,
                ];
            });

        return response()->json(['data' => $users]);
    }

    public function syncUserSystems(Request $request, Tenant $tenant, int $user)
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*' => 'string|max:30',
        ]);

        $this->configureTenantConnection($tenant);

        $moduleCodes = array_values(array_unique(array_map('strtoupper', $validated['modules'])));
        $enabledModules = $tenant->modules()->pluck('code')->map(fn ($code) => strtoupper($code))->all();
        $invalidModules = array_values(array_diff($moduleCodes, $enabledModules));
        if ($invalidModules) {
            throw ValidationException::withMessages([
                'modules' => 'Users can only be assigned systems enabled for their tenant.',
            ]);
        }
        $userExists = DB::connection('tenant')->table('users')->where('id', $user)->exists();
        if (!$userExists) {
            return response()->json(['message' => 'User not found in this tenant.'], 404);
        }
        $systemSlugs = array_map(fn ($code) => 'system_' . strtolower($code), $moduleCodes);

        foreach ($moduleCodes as $code) {
            DB::connection('tenant')->table('permissions')->updateOrInsert(
                ['slug' => 'system_' . strtolower($code)],
                [
                    'name' => $this->moduleName($code),
                    'module' => strtolower($code),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $existingNonSystemPermissionIds = DB::connection('tenant')->table('permission_user')
            ->join('permissions', 'permission_user.permission_id', '=', 'permissions.id')
            ->where('permission_user.user_id', $user)
            ->where('permissions.slug', 'not like', 'system_%')
            ->pluck('permission_user.permission_id')
            ->all();

        $systemPermissionIds = DB::connection('tenant')->table('permissions')
            ->whereIn('slug', $systemSlugs)
            ->pluck('id')
            ->all();

        DB::connection('tenant')->table('permission_user')->where('user_id', $user)->delete();

        foreach (array_unique(array_merge($existingNonSystemPermissionIds, $systemPermissionIds)) as $permissionId) {
            DB::connection('tenant')->table('permission_user')->insert([
                'user_id' => $user,
                'permission_id' => $permissionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'User systems updated.']);
    }

    public function storeUser(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|max:80',
            'modules' => 'nullable|array',
            'modules.*' => 'string|max:30',
        ]);

        $this->configureTenantConnection($tenant);

        $exists = DB::connection('tenant')->table('users')->where('email', $validated['email'])->exists();
        if ($exists) {
            throw ValidationException::withMessages(['email' => 'A user with this email already exists in this tenant.']);
        }

        $userId = DB::connection('tenant')->table('users')->insertGetId([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'User',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $moduleCodes = $validated['modules'] ?? $tenant->modules()->pluck('code')->map(fn ($c) => strtoupper($c))->all();
        $this->syncUserSystemsForUser($tenant, (int) $userId, $moduleCodes);

        return response()->json([
            'data' => [
                'id' => $userId,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'] ?? 'User',
                'password' => $validated['password'],
                'systems' => array_map(fn ($c) => strtoupper($c), $moduleCodes),
            ],
            'message' => 'User created successfully.',
        ], 201);
    }

    public function showUser(Tenant $tenant, int $user)
    {
        $this->configureTenantConnection($tenant);

        $userRecord = DB::connection('tenant')->table('users')
            ->leftJoin('permission_user', 'users.id', '=', 'permission_user.user_id')
            ->leftJoin('permissions', 'permission_user.permission_id', '=', 'permissions.id')
            ->select('users.id', 'users.name', 'users.email', 'users.role', 'users.created_at', DB::raw("GROUP_CONCAT(permissions.slug) as permission_slugs"))
            ->where('users.id', $user)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.role', 'users.created_at')
            ->first();

        if (!$userRecord) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $permissions = array_values(array_filter(explode(',', (string) $userRecord->permission_slugs)));

        return response()->json([
            'data' => [
                'id' => $userRecord->id,
                'name' => $userRecord->name,
                'email' => $userRecord->email,
                'role' => $userRecord->role,
                'created_at' => $userRecord->created_at,
                'systems' => collect($permissions)
                    ->filter(fn ($slug) => str_starts_with($slug, 'system_'))
                    ->map(fn ($slug) => strtoupper(str_replace('system_', '', $slug)))
                    ->values()
                    ->all(),
                'permissions' => $permissions,
            ],
        ]);
    }

    public function updateUser(Request $request, Tenant $tenant, int $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|string|max:80',
        ]);

        $this->configureTenantConnection($tenant);

        $userRecord = DB::connection('tenant')->table('users')->where('id', $user)->first();
        if (!$userRecord) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['email'])) $updateData['email'] = $validated['email'];
        if (isset($validated['password'])) $updateData['password'] = Hash::make($validated['password']);
        if (isset($validated['role'])) $updateData['role'] = $validated['role'];
        $updateData['updated_at'] = now();

        DB::connection('tenant')->table('users')->where('id', $user)->update($updateData);

        return response()->json(['message' => 'User updated successfully.']);
    }

    public function destroyUser(Tenant $tenant, int $user)
    {
        $this->configureTenantConnection($tenant);

        $userRecord = DB::connection('tenant')->table('users')->where('id', $user)->first();
        if (!$userRecord) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        DB::connection('tenant')->table('permission_user')->where('user_id', $user)->delete();
        DB::connection('tenant')->table('users')->where('id', $user)->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function resetPassword(Request $request, Tenant $tenant, int $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $this->configureTenantConnection($tenant);

        $userRecord = DB::connection('tenant')->table('users')->where('id', $user)->first();
        if (!$userRecord) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        DB::connection('tenant')->table('users')->where('id', $user)->update([
            'password' => Hash::make($validated['password']),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return response()->json(null, 204);
    }

    protected function migrateTenantDatabase(Tenant $tenant): void
    {
        $this->configureTenantConnection($tenant);

        Artisan::call('migrate', [
            '--database' => 'tenant',
            '--path' => 'database/migrations/tenant',
            '--force' => true,
        ]);
    }

    protected function configureTenantConnection(Tenant $tenant): void
    {
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => $tenant->database,
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        DB::purge('tenant');
    }

    protected function syncModules(Tenant $tenant, array $moduleCodes, string $plan): void
    {
        $moduleIds = [];

        foreach ($moduleCodes as $code) {
            $module = Module::firstOrCreate(
                ['code' => $code],
                [
                    'name' => $this->moduleName($code),
                    'version' => '1.0.0',
                    'status' => 'active',
                    'category' => 'enterprise',
                    'description' => $this->moduleName($code) . ' module',
                ]
            );

            $moduleIds[$module->id] = [
                'status' => 'active',
                'license_type' => strtolower($plan) === 'enterprise' ? 'enterprise' : 'professional',
                'settings' => json_encode(['assigned_by' => 'superadmin']),
            ];
        }

        $tenant->modules()->sync($moduleIds);
    }

    protected function upsertTenantAdmin(Tenant $tenant, array $admin): void
    {
        Config::set('database.connections.tenant.database', $tenant->database);
        DB::purge('tenant');

        $users = DB::connection('tenant')->table('users');
        $user = $users->where('email', $admin['email'])->first();
        $userId = $user?->id;
        $values = [
            'name' => $admin['name'] ?? 'Company Admin',
            'email' => $admin['email'],
            'role' => 'Admin',
            'updated_at' => now(),
        ];
        if (!$user) {
            $values['password'] = Hash::make($admin['password']);
            $values['created_at'] = now();
            $userId = $users->insertGetId($values);
        } else {
            $users->where('id', $user->id)->update($values);
        }

        $this->syncUserSystemsForUser($tenant, (int) $userId, $tenant->modules()->pluck('code')->all());
    }

    protected function syncUserSystemsForUser(Tenant $tenant, int $userId, array $moduleCodes): void
    {
        $codes = array_values(array_unique(array_map('strtoupper', $moduleCodes)));
        $slugs = array_map(fn ($code) => 'system_' . strtolower($code), $codes);
        foreach ($codes as $code) {
            DB::connection('tenant')->table('permissions')->updateOrInsert(
                ['slug' => 'system_' . strtolower($code)],
                ['name' => $this->moduleName($code), 'module' => strtolower($code), 'updated_at' => now(), 'created_at' => now()]
            );
        }
        $ids = DB::connection('tenant')->table('permissions')->whereIn('slug', $slugs)->pluck('id');
        DB::connection('tenant')->table('permission_user')
            ->where('user_id', $userId)
            ->whereIn('permission_id', DB::connection('tenant')->table('permissions')->where('slug', 'like', 'system_%')->pluck('id'))
            ->delete();
        foreach ($ids as $permissionId) {
            DB::connection('tenant')->table('permission_user')->insertOrIgnore([
                'user_id' => $userId, 'permission_id' => $permissionId, 'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }

    protected function serializeTenant(Tenant $tenant): array
    {
        $settings = $tenant->settings ?? [];

        return [
            'id' => $tenant->id,
            'name' => $tenant->name,
            'domain' => $tenant->domain,
            'database' => $tenant->database,
            'subdomain' => $tenant->subdomain ?? ($settings['subdomain'] ?? Str::before($tenant->domain, '.')),
            'customDomain' => $settings['custom_domain'] ?? '',
            'status' => ucfirst($tenant->status),
            'plan' => $settings['plan'] ?? 'Enterprise',
            'sandbox' => (bool) ($settings['sandbox'] ?? false),
            'modules' => $tenant->modules->pluck('code')->values()->all(),
            'date' => optional($tenant->created_at)->toDateString(),
            'users' => $settings['users'] ?? 0,
            'settings' => $settings,
        ];
    }

    protected function moduleName(string $code): string
    {
        return [
            'HRMS' => 'Human Resources',
            'PMS' => 'Project Management',
            'FMS' => 'Finance Management',
            'DMS' => 'Document Management',
            'TMS' => 'Task Management',
            'CRM' => 'Customer Relationship Management',
            'MFG' => 'Manufacturing',
            'FX' => 'Multi-Currency',
        ][$code] ?? $code;
    }
}
