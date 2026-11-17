<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Schema;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        Role::synchronizeLegacyUsers();
        $role = $user->role;

        $query = User::query();
        if (Schema::hasTable('roles') && Schema::hasTable('permission_role')) {
            $query->with('role_ref.permissions');
        }
        if (Schema::hasTable('permissions') && Schema::hasTable('permission_user')) {
            $query->with('permissions');
        }

        if ($role !== 'SuperAdmin') {
            $query->where('role', '!=', 'SuperAdmin');
        }

        $perPage = $request->per_page ?? 50;
        $users = $query->latest('id')->paginate($perPage);
        $items = $users->getCollection()->map(fn (User $u) => $this->userPayload($u));

        return response()->json([
            'data' => $items->values()->all(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable'], // Could be string (preset) or File
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'empId' => ['nullable', 'string', 'max:255', 'unique:users,emp_id'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'string'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'status' => ['nullable', 'string'],
            'joining_date' => ['nullable', 'date'],
        ]);

        $avatarPath = $data['avatar'] ?? null;
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $avatarPath = asset('storage/' . $path);
        }

        $user = User::create([
            'name' => trim($data['first_name'] . ' ' . $data['last_name']),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'organization' => $data['organization'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'avatar' => $avatarPath,
            'email' => $data['email'],
            'emp_id' => $data['empId'] ?? null,
            'password' => $data['password'],
            'role' => $data['role'],
            'role_id' => $this->resolveRoleId($data['role_id'] ?? null, $data['role']),
            'status' => $data['status'] ?? 'active',
            'joining_date' => $data['joining_date'] ?? now(),
        ]);

        return response()->json(['data' => $this->userPayload($user)], 201);
    }

    public function show(User $user)
    {
        return response()->json(['data' => $this->userPayload($user->load('role_ref.permissions'))]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable'], // Could be string (preset) or File
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'empId' => ['nullable', 'string', 'max:255', Rule::unique('users', 'emp_id')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['sometimes', 'required', 'string'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'status' => ['nullable', 'string'],
            'joining_date' => ['nullable', 'date'],
            'termination_date' => ['nullable', 'date'],
        ]);

        // Immutable Employee Code check
        if ($user->emp_id && isset($data['empId']) && $data['empId'] !== $user->emp_id) {
            return response()->json(['message' => 'Employee ID cannot be changed once assigned.'], 422);
        }

        $avatarPath = $user->avatar;
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $avatarPath = asset('storage/' . $path);
        } elseif (array_key_exists('avatar', $data) && is_string($data['avatar'])) {
            $avatarPath = $data['avatar'];
        }

        $user->fill([
            'first_name' => $data['first_name'] ?? $user->first_name,
            'last_name' => $data['last_name'] ?? $user->last_name,
            'organization' => array_key_exists('organization', $data) ? $data['organization'] : $user->organization,
            'city' => array_key_exists('city', $data) ? $data['city'] : $user->city,
            'country' => array_key_exists('country', $data) ? $data['country'] : $user->country,
            'avatar' => $avatarPath,
            'email' => $data['email'] ?? $user->email,
            'emp_id' => array_key_exists('empId', $data) ? ($data['empId'] ?? $user->emp_id) : $user->emp_id,
            'role' => $data['role'] ?? $user->role,
            'role_id' => array_key_exists('role_id', $data)
                ? $data['role_id']
                : (array_key_exists('role', $data)
                    ? $this->resolveRoleId(null, $data['role'])
                    : $user->role_id),
            'status' => $data['status'] ?? $user->status,
            'joining_date' => $data['joining_date'] ?? $user->joining_date,
            'termination_date' => $data['termination_date'] ?? $user->termination_date,
        ]);

        $user->name = trim($user->first_name . ' ' . $user->last_name);

        if (array_key_exists('password', $data) && $data['password']) {
            $user->password = $data['password'];
        }

        $user->save();

        return response()->json(['data' => $this->userPayload($user)]);
    }

    public function bulkRoleUpdate(Request $request)
    {
        $data = $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'exists:users,id',
            'role' => 'required|string',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $updateData = [
            'role' => $data['role'],
            'role_id' => array_key_exists('role_id', $data)
                ? $data['role_id']
                : $this->resolveRoleId(null, $data['role']),
        ];

        User::whereIn('id', $data['userIds'])->update($updateData);

        return response()->json(['ok' => true]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['ok' => true]);
    }

    public function updatePermissions(Request $request, User $user)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $user->permissions()->sync($data['permissions']);

        return response()->json(['data' => $this->userPayload($user->load('permissions'))]);
    }

    public function getPreferences(Request $request)
    {
        $user = $request->user();
        return response()->json(['data' => $user->preferences ?? (object)[]]);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'preferences' => 'required|array',
        ]);
        $current = $user->preferences ?? [];
        $user->preferences = array_merge($current, $validated['preferences']);
        $user->save();
        return response()->json(['data' => $user->preferences]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'organization' => $user->organization,
            'city' => $user->city,
            'country' => $user->country,
            'avatar' => $user->avatar,
            'email' => $user->email,
            'empId' => $user->emp_id,
            'role' => $user->role,
            'roleId' => $user->role_id,
            'status' => $user->status,
            'joiningDate' => $user->joining_date,
            'terminationDate' => $user->termination_date,
            'isOnline' => $user->is_online,
            'lastSeenAt' => $user->last_seen_at,
            'permissions' => $user->all_permissions,
            'directPermissions' => $user->permissions->pluck('id')->toArray(),
        ];
    }

    private function resolveRoleId(?int $roleId, string $roleName): ?int
    {
        if ($roleId !== null) {
            return $roleId;
        }

        return Role::where('name', trim($roleName))->value('id');
    }
}
