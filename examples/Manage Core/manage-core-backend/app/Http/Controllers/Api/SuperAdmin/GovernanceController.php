<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AiProviderSetting;
use App\Models\AiUsageLog;
use App\Models\AuditLog;
use App\Models\Module;
use App\Models\ModuleFeature;
use App\Models\ModuleTenant;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantModuleFeature;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class GovernanceController extends Controller
{
    public function overview()
    {
        $totalModules = Module::count();
        $activeModules = Module::where('status', 'active')->count();
        $sandboxModules = Module::where('status', 'sandbox')->count();
        $disabledModules = Module::where('status', 'disabled')->count();
        $betaModules = Module::where('status', 'beta')->count();

        $totalFeatures = Schema::hasTable('module_features')
            ? ModuleFeature::count()
            : 0;

        $totalPermissions = Schema::hasTable('permissions')
            ? Permission::count()
            : 0;

        $totalRoles = Schema::hasTable('roles')
            ? Role::count()
            : 0;

        $totalTenants = Schema::hasTable('tenants')
            ? Tenant::count()
            : 0;

        $totalLicensed = ModuleTenant::count();

        $totalActiveUsers = Schema::hasTable('users')
            ? User::count()
            : 0;

        $securityIncidents = Schema::hasTable('audit_logs')
            ? AuditLog::where('event', 'like', '%security%')
                ->where('created_at', '>=', now()->subDays(30))
                ->count()
            : 0;

        $roleDistribution = [];
        if (Schema::hasTable('roles')) {
            $roleDistribution = Role::withCount('users')
                ->get()
                ->map(fn ($role) => [
                    'role' => $role->name,
                    'count' => $role->users_count,
                ])
                ->toArray();
        }

        $licenseUtilization = $totalTenants > 0
            ? round(($totalLicensed / max($totalTenants, 1)) * 100, 1)
            : 0;

        return response()->json([
            'kpis' => [
                'total_modules' => $totalModules,
                'active_modules' => $activeModules,
                'sandbox_modules' => $sandboxModules,
                'disabled_modules' => $disabledModules,
                'beta_modules' => $betaModules,
                'total_features' => $totalFeatures,
                'total_permissions' => $totalPermissions,
                'total_roles' => $totalRoles,
                'total_tenants' => $totalTenants,
                'total_companies' => $totalTenants,
                'total_active_users' => $totalActiveUsers,
                'security_incidents' => $securityIncidents,
                'permission_changes_today' => Schema::hasTable('audit_logs')
                    ? AuditLog::where('event', 'like', '%permission%')
                        ->whereDate('created_at', today())
                        ->count()
                    : 0,
            ],
            'analytics' => [
                'feature_adoption_rate' => $totalModules > 0
                    ? round(($activeModules / $totalModules) * 100, 1)
                    : 0,
                'role_distribution' => $roleDistribution,
                'license_utilization' => $licenseUtilization,
                'security_risk_score' => $securityIncidents > 0
                    ? round(100 - ($securityIncidents * 5), 1)
                    : 100.0,
            ],
        ]);
    }

    public function modules()
    {
        $modules = Module::withCount('tenants', 'features')
            ->get()
            ->map(fn ($module) => [
                'id' => $module->id,
                'name' => $module->name,
                'display_name' => $module->name,
                'status' => $module->status,
                'version' => $module->version,
                'description' => $module->description,
                'dependencies' => $module->dependencies ?? [],
                'category' => $module->category ?? null,
                'base_price' => $module->base_price ?? null,
                'tenant_count' => $module->tenants_count,
                'feature_count' => $module->features_count,
                'created_at' => $module->created_at,
                'updated_at' => $module->updated_at,
            ]);

        return response()->json(['data' => $modules, 'total' => $modules->count()]);
    }

    public function updateModuleStatus(Request $request, $module)
    {
        $validStatuses = ['active', 'inactive', 'maintenance', 'disabled', 'beta', 'sandbox'];
        $newStatus = $request->input('status');

        if (!in_array($newStatus, $validStatuses)) {
            return response()->json(['message' => 'Invalid status value.'], 422);
        }

        $moduleModel = Module::find($module);

        if (!$moduleModel) {
            return response()->json(['message' => 'Module not found.'], 404);
        }

        $previousStatus = $moduleModel->status;
        $moduleModel->update(['status' => $newStatus]);

        if (Schema::hasTable('audit_logs')) {
            AuditLog::create([
                'event' => 'module.status_changed',
                'auditable_type' => Module::class,
                'auditable_id' => $moduleModel->id,
                'old_values' => ['status' => $previousStatus],
                'new_values' => ['status' => $newStatus],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }

        return response()->json([
            'message' => "Module {$moduleModel->name} status updated successfully.",
            'data' => [
                'id' => $moduleModel->id,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
                'updated_at' => now()->toIso8601String(),
            ],
        ]);
    }

    public function cloneModule($module)
    {
        $original = Module::with('features')->find($module);

        if (!$original) {
            return response()->json(['message' => 'Module not found.'], 404);
        }

        $clone = Module::create([
            'name' => $original->name . ' (Copy)',
            'code' => $original->code . '_copy',
            'version' => $original->version,
            'status' => 'sandbox',
            'description' => $original->description,
            'dependencies' => $original->dependencies,
            'category' => $original->category,
            'base_price' => $original->base_price,
            'settings' => $original->settings,
        ]);

        $featuresCopied = 0;
        if (Schema::hasTable('module_features')) {
            foreach ($original->features as $feature) {
                ModuleFeature::create([
                    'module_id' => $clone->id,
                    'name' => $feature->name,
                    'code' => $feature->code,
                    'description' => $feature->description,
                    'is_enabled' => $feature->is_enabled,
                ]);
                $featuresCopied++;
            }
        }

        if (Schema::hasTable('audit_logs')) {
            AuditLog::create([
                'event' => 'module.cloned',
                'auditable_type' => Module::class,
                'auditable_id' => $clone->id,
                'old_values' => ['original_id' => $original->id],
                'new_values' => ['clone_id' => $clone->id, 'name' => $clone->name],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }

        return response()->json([
            'message' => "Module {$original->name} cloned successfully.",
            'data' => [
                'original_id' => $original->id,
                'clone_id' => $clone->id,
                'clone_name' => $clone->name,
                'clone_status' => $clone->status,
                'cloned_at' => now()->toIso8601String(),
                'features_copied' => $featuresCopied,
            ],
        ]);
    }

    public function features()
    {
        $features = [];

        if (Schema::hasTable('module_features')) {
            $allFeatures = ModuleFeature::with('module')->get();

            foreach ($allFeatures as $feature) {
                $moduleName = $feature->module?->name ?? 'Unknown';
                $features[$moduleName][] = [
                    'id' => $feature->id,
                    'name' => $feature->name,
                    'code' => $feature->code,
                    'description' => $feature->description,
                    'is_enabled' => $feature->is_enabled,
                    'module_id' => $feature->module_id,
                ];
            }
        }

        return response()->json(['data' => $features]);
    }

    public function updateFeature(Request $request, $feature)
    {
        if (!Schema::hasTable('module_features')) {
            return response()->json(['message' => 'Features table not found.'], 404);
        }

        $featureModel = ModuleFeature::find($feature);

        if (!$featureModel) {
            return response()->json(['message' => 'Feature not found.'], 404);
        }

        $featureModel->update($request->only(['name', 'description', 'is_enabled']));

        return response()->json([
            'message' => "Feature {$featureModel->name} updated successfully.",
            'data' => $featureModel->fresh()->toArray(),
        ]);
    }

    public function featureFlags()
    {
        $flags = [];

        if (Schema::hasTable('tenant_module_features')) {
            $flags = TenantModuleFeature::with(['moduleFeature.module', 'tenant'])
                ->get()
                ->map(fn ($tmf) => [
                    'id' => $tmf->id,
                    'tenant_id' => $tmf->tenant_id,
                    'tenant_name' => $tmf->tenant?->name,
                    'feature_id' => $tmf->module_feature_id,
                    'feature_name' => $tmf->moduleFeature?->name,
                    'module_name' => $tmf->moduleFeature?->module?->name,
                    'is_enabled' => $tmf->is_enabled,
                    'created_at' => $tmf->created_at,
                    'updated_at' => $tmf->updated_at,
                ])
                ->toArray();
        }

        return response()->json(['data' => $flags, 'total' => count($flags)]);
    }

    public function createFeatureFlag(Request $request)
    {
        if (!Schema::hasTable('tenant_module_features')) {
            return response()->json(['message' => 'Feature flags table not found.'], 404);
        }

        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'module_feature_id' => 'required|exists:module_features,id',
            'is_enabled' => 'boolean',
        ]);

        $flag = TenantModuleFeature::create($validated);

        return response()->json([
            'message' => 'Feature flag created successfully.',
            'data' => $flag->fresh(),
        ], 201);
    }

    public function updateFeatureFlag(Request $request, $flag)
    {
        if (!Schema::hasTable('tenant_module_features')) {
            return response()->json(['message' => 'Feature flags table not found.'], 404);
        }

        $flagModel = TenantModuleFeature::find($flag);

        if (!$flagModel) {
            return response()->json(['message' => 'Feature flag not found.'], 404);
        }

        $flagModel->update($request->only(['is_enabled']));

        return response()->json([
            'message' => 'Feature flag updated successfully.',
            'data' => $flagModel->fresh(),
        ]);
    }

    public function licenses()
    {
        $licenses = ModuleTenant::with(['module', 'tenant'])
            ->get()
            ->map(fn ($mt) => [
                'id' => $mt->id,
                'tenant_id' => $mt->tenant_id,
                'tenant' => $mt->tenant?->name,
                'module_id' => $mt->module_id,
                'module' => $mt->module?->name,
                'status' => $mt->status,
                'license_type' => $mt->license_type,
                'license_key' => $mt->license_key,
                'expires_at' => $mt->expires_at,
                'settings' => $mt->settings,
                'created_at' => $mt->created_at,
                'updated_at' => $mt->updated_at,
            ]);

        return response()->json(['data' => $licenses, 'total' => $licenses->count()]);
    }

    public function roles()
    {
        if (!Schema::hasTable('roles')) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $roles = Role::withCount('users', 'permissions')
            ->get()
            ->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'color' => $role->color,
                'icon' => $role->icon,
                'level' => $role->level,
                'status' => $role->status,
                'permission_count' => $role->permissions_count,
                'user_count' => $role->users_count,
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ]);

        return response()->json(['data' => $roles, 'total' => $roles->count()]);
    }

    public function permissions()
    {
        if (!Schema::hasTable('permissions')) {
            return response()->json(['data' => [], 'total_permissions' => 0]);
        }

        $allPermissions = Permission::with('roles')->get();

        $grouped = $allPermissions
            ->groupBy('module')
            ->map(function ($perms, $module) {
                return $perms->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'module' => $p->module,
                    'roles_with_access' => $p->roles->pluck('name')->toArray(),
                ])->toArray();
            })
            ->toArray();

        return response()->json([
            'data' => $grouped,
            'total_permissions' => $allPermissions->count(),
        ]);
    }

    public function dataAccess()
    {
        $rules = [
            [
                'id' => 1,
                'name' => 'Employee Data Isolation',
                'description' => 'Employees can only view their own personal data',
                'scope' => 'tenant',
                'module' => 'HRMS',
                'enforced' => true,
                'roles_exempt' => ['Super Admin', 'Platform Admin', 'Tenant Admin', 'HR Manager'],
            ],
            [
                'id' => 2,
                'name' => 'Departmental Data Access',
                'description' => 'Department Heads can view data for their department only',
                'scope' => 'department',
                'module' => 'HRMS',
                'enforced' => true,
                'roles_exempt' => ['Super Admin', 'Platform Admin', 'Tenant Admin'],
            ],
            [
                'id' => 3,
                'name' => 'Project Confidentiality',
                'description' => 'Project data visible only to assigned team members',
                'scope' => 'project',
                'module' => 'PMS',
                'enforced' => true,
                'roles_exempt' => ['Super Admin', 'Platform Admin', 'Tenant Admin', 'Project Manager'],
            ],
            [
                'id' => 4,
                'name' => 'Financial Data Restriction',
                'description' => 'Financial data restricted to finance roles only',
                'scope' => 'role',
                'module' => 'FMS',
                'enforced' => true,
                'roles_exempt' => ['Super Admin', 'Platform Admin', 'Tenant Admin'],
            ],
            [
                'id' => 5,
                'name' => 'Client Data Protection',
                'description' => 'Client/CRM data accessible only by assigned sales team',
                'scope' => 'team',
                'module' => 'CRM',
                'enforced' => true,
                'roles_exempt' => ['Super Admin', 'Platform Admin', 'Tenant Admin'],
            ],
        ];

        return response()->json(['data' => $rules, 'total' => count($rules)]);
    }

    public function security()
    {
        $auditLogsExist = Schema::hasTable('audit_logs');
        $usersExist = Schema::hasTable('users');

        $recentIncidents = [];
        if ($auditLogsExist) {
            $recentIncidents = AuditLog::latest()
                ->where('event', 'like', '%security%')
                ->take(10)
                ->get()
                ->map(fn ($log) => [
                    'id' => $log->id,
                    'event' => $log->event,
                    'ip_address' => $log->ip_address,
                    'description' => $log->event,
                    'old_values' => $log->old_values,
                    'new_values' => $log->new_values,
                    'created_at' => $log->created_at,
                ])
                ->toArray();
        }

        $totalUsers = $usersExist ? User::count() : 0;

        return response()->json([
            'overall_score' => count($recentIncidents) > 0 ? max(0, 100 - (count($recentIncidents) * 10)) : 100,
            'risk_level' => count($recentIncidents) > 5 ? 'high' : (count($recentIncidents) > 0 ? 'medium' : 'low'),
            'active_policies' => 5,
            'recent_incidents' => $recentIncidents,
            'mfa_compliance' => [
                'total_users' => $totalUsers,
            ],
        ]);
    }

    public function sessions()
    {
        if (!Schema::hasTable('sessions')) {
            return response()->json(['data' => [], 'total_active' => 0]);
        }

        $activeThreshold = now()->subMinutes(30)->timestamp;

        $sessions = DB::table('sessions')
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->where('sessions.last_activity', '>=', $activeThreshold)
            ->select(
                'sessions.id',
                'sessions.ip_address',
                'sessions.user_agent',
                'sessions.last_activity',
                'users.id as user_id',
                'users.name',
                'users.email'
            )
            ->orderByDesc('sessions.last_activity')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'user' => $s->name,
                'email' => $s->email,
                'ip_address' => $s->ip_address,
                'device' => $s->user_agent,
                'last_activity' => date('c', $s->last_activity),
            ]);

        return response()->json(['data' => $sessions, 'total_active' => $sessions->count()]);
    }

    public function terminateSession($session)
    {
        if (!Schema::hasTable('sessions')) {
            return response()->json(['message' => 'Sessions table not found.'], 404);
        }

        $deleted = DB::table('sessions')->where('id', $session)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Session not found.'], 404);
        }

        return response()->json([
            'message' => "Session {$session} terminated successfully.",
            'data' => [
                'session_id' => $session,
                'terminated_at' => now()->toIso8601String(),
            ],
        ]);
    }

    public function approvalWorkflows()
    {
        $workflows = [];

        if (Schema::hasTable('approval_requests')) {
            $pendingByType = \App\Models\ApprovalRequest::where('status', 'pending')
                ->select('type', DB::raw('count(*) as total'))
                ->groupBy('type')
                ->get();

            foreach ($pendingByType as $row) {
                $workflows[] = [
                    'type' => $row->type,
                    'total_pending' => $row->total,
                ];
            }
        }

        return response()->json(['data' => $workflows, 'total' => count($workflows)]);
    }

    public function auditLogs(Request $request)
    {
        if (!Schema::hasTable('audit_logs')) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $query = AuditLog::with('user');

        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        if ($request->filled('auditable_type')) {
            $query->where('auditable_type', $request->input('auditable_type'));
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->input('to'));
        }

        $perPage = min((int) $request->input('per_page', 25), 100);

        $logs = $query->latest()
            ->paginate($perPage)
            ->through(fn ($log) => [
                'id' => $log->id,
                'event' => $log->event,
                'auditable_type' => $log->auditable_type,
                'auditable_id' => $log->auditable_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'url' => $log->url,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
                'created_at' => $log->created_at,
            ]);

        return response()->json($logs);
    }

    public function impersonations()
    {
        if (!Schema::hasTable('audit_logs')) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $impersonations = AuditLog::where('event', 'impersonation.start')
            ->orWhere('event', 'impersonation.end')
            ->latest()
            ->take(50)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'event' => $log->event,
                'user_id' => $log->user_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at,
            ]);

        return response()->json(['data' => $impersonations, 'total' => $impersonations->count()]);
    }

    public function impersonate(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'reason' => 'nullable|string|max:500',
        ]);

        $targetUser = User::find($request->input('user_id'));

        if (!$targetUser) {
            return response()->json(['message' => 'Target user not found.'], 404);
        }

        $impersonator = $request->user();

        $token = $impersonator->createToken(
            'impersonation-' . $targetUser->id,
            ['impersonate']
        );

        if (Schema::hasTable('audit_logs')) {
            AuditLog::create([
                'user_id' => $impersonator->id,
                'event' => 'impersonation.start',
                'auditable_type' => User::class,
                'auditable_id' => $targetUser->id,
                'old_values' => [],
                'new_values' => [
                    'target_user_id' => $targetUser->id,
                    'target_user_email' => $targetUser->email,
                    'reason' => $request->input('reason', ''),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return response()->json([
            'message' => 'Impersonation session started successfully.',
            'data' => [
                'target_user' => [
                    'id' => $targetUser->id,
                    'name' => $targetUser->name,
                    'email' => $targetUser->email,
                ],
                'reason' => $request->input('reason', ''),
                'started_at' => now()->toIso8601String(),
                'token' => $token->plainTextToken,
            ],
        ]);
    }

    public function health()
    {
        $modules = Module::all();

        $metrics = $modules->map(function ($module) {
            $tenantCount = $module->tenants()->count();

            return [
                'module' => $module->name,
                'status' => $module->status === 'active' ? 'healthy' : $module->status,
                'version' => $module->version,
                'tenant_count' => $tenantCount,
                'feature_count' => $module->features()->count(),
                'last_checked' => now()->toIso8601String(),
            ];
        });

        $total = $modules->count();
        $healthy = $metrics->where('status', 'healthy')->count();
        $degraded = $metrics->where('status', '!=', 'healthy')->where('status', '!=', 'down')->count();
        $down = $metrics->where('status', 'down')->count();

        return response()->json([
            'summary' => [
                'total_modules' => $total,
                'healthy' => $healthy,
                'degraded' => $degraded,
                'down' => $down,
                'overall_status' => $down > 0 ? 'degraded' : 'healthy',
            ],
            'metrics' => $metrics,
        ]);
    }

    public function aiGovernance()
    {
        $aiData = AiProviderSetting::all()
            ->map(function ($setting) {
                $usageCount = 0;
                $totalTokens = 0;
                $totalCost = 0;

                if (Schema::hasTable('ai_usage_logs')) {
                    $usageCount = AiUsageLog::where('provider', $setting->name)->count();
                    $totalTokens = AiUsageLog::where('provider', $setting->name)
                        ->sum(DB::raw('COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)'));
                    $totalCost = AiUsageLog::where('provider', $setting->name)->sum('cost');
                }

                return [
                    'id' => $setting->id,
                    'name' => $setting->name,
                    'provider_type' => $setting->provider_type,
                    'default_model' => $setting->default_model,
                    'available_models' => $setting->available_models ?? [],
                    'is_active' => $setting->is_active,
                    'is_default' => $setting->is_default,
                    'settings' => $setting->settings ?? [],
                    'usage_count' => $usageCount,
                    'total_tokens' => $totalTokens,
                    'total_cost' => $totalCost,
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at,
                ];
            });

        $totalUsage = $aiData->sum('usage_count');
        $totalCost = $aiData->sum('total_cost');

        return response()->json([
            'data' => $aiData,
            'total_models' => $aiData->count(),
            'total_usage' => $totalUsage,
            'total_cost' => $totalCost,
        ]);
    }

    public function updateAI(Request $request, $id)
    {
        $setting = AiProviderSetting::find($id);

        if (!$setting) {
            return response()->json(['message' => 'AI provider setting not found.'], 404);
        }

        $validated = $request->validate([
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'default_model' => 'nullable|string',
            'settings' => 'nullable|array',
            'available_models' => 'nullable|array',
        ]);

        $setting->update($validated);

        return response()->json([
            'message' => "AI provider {$setting->name} settings updated successfully.",
            'data' => $setting->fresh(),
        ]);
    }

    public function commandCenter()
    {
        $totalModules = Module::count();
        $activeModules = Module::where('status', 'active')->count();
        $totalTenants = Schema::hasTable('tenants') ? Tenant::count() : 0;
        $totalUsers = Schema::hasTable('users') ? User::count() : 0;
        $totalRoles = Schema::hasTable('roles') ? Role::count() : 0;

        $activeSessions = 0;
        if (Schema::hasTable('sessions')) {
            $activeThreshold = now()->subMinutes(30)->timestamp;
            $activeSessions = DB::table('sessions')
                ->where('last_activity', '>=', $activeThreshold)
                ->count();
        }

        $recentAuditLogs = [];
        if (Schema::hasTable('audit_logs')) {
            $recentAuditLogs = AuditLog::latest()
                ->take(5)
                ->get()
                ->map(fn ($log) => [
                    'action' => $log->event,
                    'detail' => $log->event,
                    'timestamp' => $log->created_at,
                ])
                ->toArray();
        }

        $topTenants = [];
        if (Schema::hasTable('tenants') && Schema::hasTable('module_tenant')) {
            $topTenants = Tenant::withCount('modules')
                ->orderByDesc('modules_count')
                ->take(5)
                ->get()
                ->map(fn ($t) => [
                    'tenant' => $t->name,
                    'modules_active' => $t->modules_count,
                ])
                ->toArray();
        }

        $alerts = [];
        $expiringLicenses = ModuleTenant::whereNotNull('expires_at')
            ->where('expires_at', '<=', now()->addDays(30))
            ->where('expires_at', '>', now())
            ->with(['module', 'tenant'])
            ->get();

        foreach ($expiringLicenses as $mt) {
            $alerts[] = [
                'severity' => 'warning',
                'type' => 'license',
                'message' => "License for {$mt->tenant?->name} ({$mt->module?->name}) expires {$mt->expires_at->diffForHumans()}",
                'timestamp' => $mt->expires_at,
            ];
        }

        $expiredLicenses = ModuleTenant::whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->with(['module', 'tenant'])
            ->get();

        foreach ($expiredLicenses as $mt) {
            $alerts[] = [
                'severity' => 'critical',
                'type' => 'license',
                'message' => "License for {$mt->tenant?->name} ({$mt->module?->name}) has expired",
                'timestamp' => $mt->expires_at,
            ];
        }

        return response()->json([
            'system_status' => $activeSessions > 0 ? 'operational' : 'idle',
            'active_alerts' => count($alerts),
            'alerts' => $alerts,
            'quick_stats' => [
                'active_users_now' => $activeSessions,
                'total_users' => $totalUsers,
                'total_modules' => $totalModules,
                'active_modules' => $activeModules,
                'total_tenants' => $totalTenants,
                'total_roles' => $totalRoles,
            ],
            'recent_activities' => $recentAuditLogs,
            'top_tenants_by_usage' => $topTenants,
        ]);
    }
}
