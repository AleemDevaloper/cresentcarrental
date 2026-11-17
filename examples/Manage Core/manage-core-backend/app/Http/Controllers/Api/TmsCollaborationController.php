<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskWorkspace;
use App\Models\TaskSharedBoard;
use App\Models\TaskApproval;
use App\Models\TaskActivityLog;
use App\Models\Project;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TmsCollaborationController extends Controller
{
    public function teamWorkspaces(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $workspaces = TaskWorkspace::with(['creator', 'members', 'tasks.assignee'])
            ->latest()
            ->paginate($perPage);

        $workspaces->getCollection()->transform(function ($ws) {
            $totalTasks = $ws->tasks->count();
            $completedTasks = $ws->tasks->where('status', 'Done')->count();
            return [
                'id' => $ws->id,
                'name' => $ws->name,
                'description' => $ws->description,
                'status' => $ws->status,
                'created_by' => $ws->creator?->name,
                'member_count' => $ws->members->count(),
                'members' => $ws->members->map(fn($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'avatar' => $m->avatar,
                    'role' => $m->pivot->role,
                ]),
                'task_count' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'progress' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
                'tasks' => $ws->tasks->map(fn($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'status' => $t->status,
                    'priority' => $t->priority,
                    'assignee' => $t->assignee?->name ?? 'Unassigned',
                    'due_date' => $t->due_date,
                ]),
                'created_at' => $ws->created_at,
            ];
        });

        return response()->json([
            'data' => $workspaces->items(),
            'pagination' => [
                'current_page' => $workspaces->currentPage(),
                'per_page' => $workspaces->perPage(),
                'total' => $workspaces->total(),
                'last_page' => $workspaces->lastPage(),
            ],
        ]);
    }

    public function storeWorkspace(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
            'task_ids' => 'nullable|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        $workspace = TaskWorkspace::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => auth()->id(),
            'status' => 'active',
        ]);

        $workspace->members()->attach(auth()->id(), ['role' => 'owner']);

        if (!empty($data['member_ids'])) {
            $memberData = array_fill(0, count($data['member_ids']), ['role' => 'member']);
            $workspace->members()->attach($data['member_ids'], $memberData);
        }

        if (!empty($data['task_ids'])) {
            $workspace->tasks()->attach($data['task_ids']);
        }

        return response()->json([
            'data' => $workspace->load('creator', 'members', 'tasks'),
        ], 201);
    }

    public function deptTaskManagement(Request $request): JsonResponse
    {
        $departments = Department::with(['teams.members'])->get();

        $deptData = $departments->map(function ($dept) {
            $memberIds = $dept->teams->flatMap->members->pluck('id')->unique()->toArray();

            $tasks = Task::whereIn('assigned_to', $memberIds)->get();

            $statusCounts = $tasks->groupBy('status')->map->count();
            $totalTasks = $tasks->count();
            $completedTasks = $tasks->where('status', 'Done')->count();

            return [
                'id' => $dept->id,
                'name' => $dept->name,
                'member_count' => count($memberIds),
                'teams' => $dept->teams->map(fn($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                    'member_count' => $team->members->count(),
                ]),
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'in_progress_tasks' => $tasks->where('status', 'In Progress')->count(),
                'todo_tasks' => $tasks->where('status', 'To Do')->count(),
                'overdue_tasks' => $tasks->filter(fn($t) => $t->due_date && $t->due_date->isPast() && $t->status !== 'Done')->count(),
                'completion_rate' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
                'status_breakdown' => $statusCounts->toArray(),
            ];
        });

        return response()->json(['data' => $deptData]);
    }

    public function teamMentions(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;

        $mentions = TaskActivityLog::where('action', 'mention')
            ->with(['task', 'user'])
            ->latest()
            ->paginate($perPage);

        $results = $mentions->getCollection()->map(function ($log) {
            return [
                'id' => $log->id,
                'task_id' => $log->task_id,
                'task_title' => $log->task?->title,
                'mentioned_user' => $log->description,
                'mentioned_by' => $log->user?->name,
                'mentioned_by_avatar' => $log->user?->avatar,
                'created_at' => $log->created_at,
            ];
        });

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $results = $results->filter(function ($item) use ($search) {
                return str_contains(strtolower($item['task_title'] ?? ''), $search)
                    || str_contains(strtolower($item['mentioned_user'] ?? ''), $search)
                    || str_contains(strtolower($item['mentioned_by'] ?? ''), $search);
            })->values();
        }

        return response()->json([
            'data' => $results,
            'pagination' => [
                'current_page' => $mentions->currentPage(),
                'per_page' => $mentions->perPage(),
                'total' => $mentions->total(),
                'last_page' => $mentions->lastPage(),
            ],
        ]);
    }

    public function clientCollaboration(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;

        $query = Project::with(['clientInfo', 'tasks' => function ($q) {
            $q->with('assignee')->latest();
        }]);

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $projects = $query->latest()->paginate($perPage);

        $projects->getCollection()->transform(function ($project) {
            $tasks = $project->tasks;
            $totalTasks = $tasks->count();
            $completedTasks = $tasks->where('status', 'Done')->count();

            return [
                'id' => $project->id,
                'name' => $project->name,
                'client' => $project->clientInfo?->name ?? $project->client,
                'client_id' => $project->client_id,
                'status' => $project->status,
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'progress' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
                'tasks' => $tasks->take(10)->map(fn($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'status' => $t->status,
                    'priority' => $t->priority,
                    'assignee' => $t->assignee?->name ?? 'Unassigned',
                    'due_date' => $t->due_date,
                    'progress' => $t->progress ?? 0,
                ]),
                'visible_tasks' => $totalTasks,
                'last_activity' => $tasks->max('updated_at'),
            ];
        });

        return response()->json([
            'data' => $projects->items(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
                'last_page' => $projects->lastPage(),
            ],
        ]);
    }

    public function sharedTaskBoards(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;

        $boards = TaskSharedBoard::with(['creator', 'members', 'tasks.assignee'])
            ->latest()
            ->paginate($perPage);

        $boards->getCollection()->transform(function ($board) {
            $tasks = $board->tasks;
            $totalTasks = $tasks->count();
            $completedTasks = $tasks->where('status', 'Done')->count();

            return [
                'id' => $board->id,
                'name' => $board->name,
                'description' => $board->description,
                'status' => $board->status,
                'created_by' => $board->creator?->name,
                'member_count' => $board->members->count(),
                'members' => $board->members->map(fn($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'avatar' => $m->avatar,
                    'role' => $m->pivot->role,
                ]),
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'in_progress_tasks' => $tasks->where('status', 'In Progress')->count(),
                'todo_tasks' => $tasks->where('status', 'To Do')->count(),
                'tasks' => $tasks->map(fn($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'status' => $t->status,
                    'priority' => $t->priority,
                    'assignee' => $t->assignee?->name ?? 'Unassigned',
                    'due_date' => $t->due_date,
                    'progress' => $t->progress ?? 0,
                ]),
                'created_at' => $board->created_at,
            ];
        });

        return response()->json([
            'data' => $boards->items(),
            'pagination' => [
                'current_page' => $boards->currentPage(),
                'per_page' => $boards->perPage(),
                'total' => $boards->total(),
                'last_page' => $boards->lastPage(),
            ],
        ]);
    }

    public function storeSharedBoard(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
            'task_ids' => 'nullable|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        $board = TaskSharedBoard::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => auth()->id(),
            'status' => 'active',
        ]);

        $board->members()->attach(auth()->id(), ['role' => 'owner']);

        if (!empty($data['member_ids'])) {
            $memberData = array_fill(0, count($data['member_ids']), ['role' => 'editor']);
            $board->members()->attach($data['member_ids'], $memberData);
        }

        if (!empty($data['task_ids'])) {
            $board->tasks()->attach($data['task_ids']);
        }

        return response()->json([
            'data' => $board->load('creator', 'members', 'tasks'),
        ], 201);
    }

    public function approvalWorkflows(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $query = TaskApproval::with(['task', 'submitter', 'approver']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        $approvals = $query->latest()->paginate($perPage);

        $approvals->getCollection()->transform(function ($approval) {
            return [
                'id' => $approval->id,
                'task' => $approval->task ? [
                    'id' => $approval->task->id,
                    'title' => $approval->task->title,
                    'status' => $approval->task->status,
                    'priority' => $approval->task->priority,
                ] : null,
                'submitted_by' => $approval->submitter?->name,
                'submitted_by_avatar' => $approval->submitter?->avatar,
                'approved_by' => $approval->approver?->name,
                'approved_by_avatar' => $approval->approver?->avatar,
                'status' => $approval->status,
                'notes' => $approval->notes,
                'rejection_reason' => $approval->rejection_reason,
                'submitted_at' => $approval->submitted_at,
                'resolved_at' => $approval->resolved_at,
                'created_at' => $approval->created_at,
            ];
        });

        return response()->json([
            'data' => $approvals->items(),
            'pagination' => [
                'current_page' => $approvals->currentPage(),
                'per_page' => $approvals->perPage(),
                'total' => $approvals->total(),
                'last_page' => $approvals->lastPage(),
            ],
        ]);
    }

    public function storeApproval(Request $request): JsonResponse
    {
        $data = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'notes' => 'nullable|string',
        ]);

        $existing = TaskApproval::where('task_id', $data['task_id'])
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'This task already has a pending approval request.'], 409);
        }

        $approval = TaskApproval::create([
            'task_id' => $data['task_id'],
            'submitted_by' => auth()->id(),
            'status' => 'pending',
            'notes' => $data['notes'] ?? null,
            'submitted_at' => now(),
        ]);

        Task::where('id', $data['task_id'])->update(['status' => 'Pending Approval']);

        return response()->json([
            'data' => $approval->load('task', 'submitter'),
        ], 201);
    }

    public function processApproval(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $approval = TaskApproval::findOrFail($id);

        if ($approval->status !== 'pending') {
            return response()->json(['message' => 'This approval has already been processed.'], 422);
        }

        $approval->update([
            'status' => $data['status'],
            'approved_by' => auth()->id(),
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'resolved_at' => now(),
        ]);

        if ($data['status'] === 'approved') {
            Task::where('id', $approval->task_id)->update(['status' => 'Done']);
        } else {
            Task::where('id', $approval->task_id)->update(['status' => 'In Progress']);
        }

        return response()->json([
            'data' => $approval->fresh()->load('task', 'submitter', 'approver'),
        ]);
    }

    public function multiUserAssignment(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;

        $query = Task::with(['assignee', 'project', 'multiAssignees']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $tasks = $query->latest()->paginate($perPage);

        $tasks->getCollection()->transform(function ($task) {
            $totalTime = $task->timeLogs->sum('duration');
            return [
                'id' => $task->id,
                'title' => $task->title,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date,
                'progress' => $task->progress ?? 0,
                'project' => $task->project?->name,
                'primary_assignee' => $task->assignee ? [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                    'avatar' => $task->assignee->avatar,
                ] : null,
                'multi_assignees' => $task->multiAssignees->map(fn($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'avatar' => $u->avatar,
                    'role' => $u->pivot->role,
                ]),
                'total_assignees' => $task->multiAssignees->count() + ($task->assignee ? 1 : 0),
                'hours_logged' => round($totalTime / 3600, 1),
            ];
        });

        return response()->json([
            'data' => $tasks->items(),
            'pagination' => [
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'last_page' => $tasks->lastPage(),
            ],
        ]);
    }

    public function assignMultiple(Request $request): JsonResponse
    {
        $data = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'roles' => 'nullable|array',
            'roles.*' => 'string',
        ]);

        $task = Task::findOrFail($data['task_id']);
        $task->multiAssignees()->detach();

        $attachData = [];
        foreach ($data['user_ids'] as $index => $userId) {
            $role = $data['roles'][$index] ?? 'assignee';
            $attachData[$userId] = ['role' => $role];
        }

        $task->multiAssignees()->attach($attachData);

        $task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'assigned_multiple',
            'description' => 'Assigned task to ' . count($data['user_ids']) . ' users',
        ]);

        return response()->json([
            'data' => $task->load('multiAssignees', 'assignee'),
        ]);
    }
}
