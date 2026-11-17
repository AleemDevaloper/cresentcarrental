<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThemeConfig;
use App\Models\ThemeAssignment;
use App\Models\ThemeAssignmentLog;
use App\Models\User;
use App\Models\Role;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThemeAssignmentController extends Controller
{
    public function getConfigs()
    {
        return response()->json(ThemeConfig::with('creator')->orderBy('created_at', 'desc')->get());
    }

    public function storeConfig(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'settings' => 'required|array',
        ]);

        $config = ThemeConfig::create([
            'name' => $validated['name'],
            'settings' => $validated['settings'],
            'created_by' => Auth::id(),
        ]);

        ThemeAssignmentLog::create([
            'user_id' => Auth::id(),
            'action' => 'config_created',
            'description' => "Created theme configuration: {$config->name}",
            'metadata' => ['config_id' => $config->id],
        ]);

        return response()->json($config);
    }

    public function updateConfig(Request $request, $id)
    {
        $config = ThemeConfig::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'settings' => 'sometimes|array',
        ]);

        if (isset($validated['name'])) {
            $config->name = $validated['name'];
        }
        if (isset($validated['settings'])) {
            $config->settings = $validated['settings'];
        }
        $config->save();

        ThemeAssignmentLog::create([
            'user_id' => Auth::id(),
            'action' => 'config_updated',
            'description' => "Updated theme configuration: {$config->name}",
            'metadata' => ['config_id' => $config->id],
        ]);

        return response()->json($config);
    }

    public function deleteConfig($id)
    {
        $config = ThemeConfig::findOrFail($id);
        $name = $config->name;
        $config->delete();

        ThemeAssignmentLog::create([
            'user_id' => Auth::id(),
            'action' => 'config_deleted',
            'description' => "Deleted theme configuration: {$name}",
            'metadata' => ['config_id' => $id],
        ]);

        return response()->json(['message' => 'Configuration deleted']);
    }

    public function getAssignments()
    {
        return response()->json(ThemeAssignment::with(['themeConfig', 'creator'])->orderBy('created_at', 'desc')->get());
    }

    public function storeAssignment(Request $request)
    {
        $validated = $request->validate([
            'theme_config_id' => 'required|exists:theme_configs,id',
            'assignable_type' => 'required|string',
            'assignable_id' => 'nullable|integer',
            'options' => 'required|array',
            'lock_settings' => 'required|array',
            'priority' => 'nullable|integer',
        ]);

        $assignment = ThemeAssignment::create([
            'theme_config_id' => $validated['theme_config_id'],
            'assignable_type' => $validated['assignable_type'],
            'assignable_id' => $validated['assignable_id'],
            'options' => $validated['options'],
            'lock_settings' => $validated['lock_settings'],
            'priority' => $validated['priority'] ?? 0,
            'created_by' => Auth::id(),
        ]);

        $targetLabel = $validated['assignable_type'];
        if ($validated['assignable_id']) {
            $targetLabel .= " (#{$validated['assignable_id']})";
        }

        ThemeAssignmentLog::create([
            'user_id' => Auth::id(),
            'action' => 'theme_assigned',
            'description' => "Assigned theme to {$targetLabel}",
            'metadata' => ['assignment_id' => $assignment->id],
        ]);

        return response()->json($assignment->load(['themeConfig', 'creator']));
    }

    public function deleteAssignment($id)
    {
        $assignment = ThemeAssignment::findOrFail($id);
        $assignment->delete();

        ThemeAssignmentLog::create([
            'user_id' => Auth::id(),
            'action' => 'assignment_removed',
            'description' => "Removed theme assignment for {$assignment->assignable_type}" . ($assignment->assignable_id ? " (#{$assignment->assignable_id})" : ""),
            'metadata' => ['assignment_id' => $id],
        ]);

        return response()->json(['message' => 'Assignment removed']);
    }

    public function getActiveTheme(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $userId = $user->id;
        $roleId = $user->role_id;
        $teamIds = [];

        try {
            $teamIds = \DB::table('team_user')->where('user_id', $userId)->pluck('team_id')->toArray();
        } catch (\Exception $e) {
            // team_user table may not exist
        }

        $assignments = ThemeAssignment::with('themeConfig')
            ->where(function ($query) use ($userId, $roleId, $teamIds) {
                $query->where('assignable_type', 'Organization')
                    ->orWhere(function ($q) use ($roleId) {
                        $q->where('assignable_type', 'Role')->where('assignable_id', $roleId);
                    })
                    ->orWhere(function ($q) use ($userId) {
                        $q->where('assignable_type', 'User')->where('assignable_id', $userId);
                    });
                if (!empty($teamIds)) {
                    $query->orWhere(function ($q) use ($teamIds) {
                        $q->where('assignable_type', 'Team')->whereIn('assignable_id', $teamIds);
                    });
                }
            })
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $activeAssignment = $assignments->first();

        return response()->json([
            'assignment' => $activeAssignment,
            'theme' => $activeAssignment ? $activeAssignment->themeConfig : null,
        ]);
    }

    public function getLogs()
    {
        return response()->json(ThemeAssignmentLog::with('user')->latest()->take(50)->get());
    }

    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'role_id', 'emp_id')
            ->with(['role:id,name'])
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? 'N/A',
                    'emp_id' => $user->emp_id ?? 'N/A',
                ];
            });
        return response()->json($users);
    }

    public function getRoles()
    {
        try {
            $roles = Role::select('id', 'name', 'display_name')->get()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->display_name ?? $role->name,
                ];
            });
            return response()->json($roles);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function getDepartments()
    {
        try {
            $departments = Department::select('id', 'name')->get();
            return response()->json($departments);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function getTeams()
    {
        try {
            $teams = \App\Models\Team::select('id', 'name')->get();
            return response()->json($teams);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }
}
