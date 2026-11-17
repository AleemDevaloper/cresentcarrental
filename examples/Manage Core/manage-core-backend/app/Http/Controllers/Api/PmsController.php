<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectBacklog;
use App\Models\ProjectBudget;
use App\Models\ProjectCalendarEvent;
use App\Models\ProjectCost;
use App\Models\ProjectDocument;
use App\Models\ProjectProgress;
use App\Models\ProjectResource;
use App\Models\ProjectRisk;
use App\Models\ProjectSprint;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PmsController extends Controller
{
    // ─── Dashboard ───────────────────────────────────────────

    public function dashboard(): JsonResponse
    {
        $totalProjects = Project::count();

        $tasksByStatus = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $budgetSummary = ProjectBudget::query()
            ->selectRaw('SUM(amount) as total_budget, SUM(spent) as total_spent')
            ->first();

        $recentProgress = ProjectProgress::with('project')
            ->latest()
            ->take(5)
            ->get();

        $activeRisks = ProjectRisk::where('status', '!=', 'Closed')->count();

        $upcomingEvents = ProjectCalendarEvent::where('start_date', '>=', now())
            ->with('project')
            ->orderBy('start_date')
            ->take(5)
            ->get();

        return response()->json([
            'data' => [
                'totalProjects' => $totalProjects,
                'tasksByStatus' => $tasksByStatus,
                'budgetSummary' => [
                    'totalBudget' => (float) ($budgetSummary->total_budget ?? 0),
                    'totalSpent' => (float) ($budgetSummary->total_spent ?? 0),
                ],
                'recentProgress' => $recentProgress,
                'activeRisks' => $activeRisks,
                'upcomingEvents' => $upcomingEvents,
            ],
        ]);
    }

    // ─── Budget Tracking ─────────────────────────────────────

    public function listBudgets(Request $request): JsonResponse
    {
        $query = ProjectBudget::with('project');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $budgets = $query->latest()->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $budgets->items(),
            'meta' => [
                'currentPage' => $budgets->currentPage(),
                'lastPage' => $budgets->lastPage(),
                'perPage' => $budgets->perPage(),
                'total' => $budgets->total(),
            ],
        ]);
    }

    public function storeBudget(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:Active,Exceeded,Closed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $budget = ProjectBudget::create($data);

        return response()->json(['data' => $budget->load('project')], 201);
    }

    public function updateBudget(Request $request, ProjectBudget $budget): JsonResponse
    {
        $data = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'sometimes|required|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:Active,Exceeded,Closed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $budget->update($data);

        return response()->json(['data' => $budget->fresh()->load('project')]);
    }

    public function destroyBudget(ProjectBudget $budget): JsonResponse
    {
        $budget->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Cost Tracking ───────────────────────────────────────

    public function listCosts(Request $request): JsonResponse
    {
        $query = ProjectCost::with(['project', 'budget', 'incurredBy']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where('description', 'like', "%{$search}%");
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $costs = $query->latest('incurred_date')->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $costs->items(),
            'meta' => [
                'currentPage' => $costs->currentPage(),
                'lastPage' => $costs->lastPage(),
                'perPage' => $costs->perPage(),
                'total' => $costs->total(),
            ],
        ]);
    }

    public function storeCost(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'budget_id' => 'nullable|exists:project_budgets,id',
            'type' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'amount' => 'required|numeric|min:0',
            'incurred_date' => 'required|date',
            'incurred_by' => 'nullable|exists:users,id',
        ]);

        $cost = ProjectCost::create($data);

        if (!empty($data['budget_id'])) {
            $budget = ProjectBudget::find($data['budget_id']);
            if ($budget) {
                $budget->increment('spent', $data['amount']);
            }
        }

        return response()->json(['data' => $cost->load(['project', 'budget', 'incurredBy'])], 201);
    }

    public function updateCost(Request $request, ProjectCost $cost): JsonResponse
    {
        $oldAmount = (float) $cost->amount;

        $data = $request->validate([
            'type' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:500',
            'amount' => 'sometimes|required|numeric|min:0',
            'budget_id' => 'nullable|exists:project_budgets,id',
            'incurred_date' => 'sometimes|required|date',
            'incurred_by' => 'nullable|exists:users,id',
        ]);

        $cost->update($data);

        $newAmount = (float) $cost->amount;
        $budgetId = $cost->budget_id ?? $cost->getOriginal('budget_id');

        if ($budgetId && $oldAmount !== $newAmount) {
            $budget = ProjectBudget::find($budgetId);
            if ($budget) {
                $budget->decrement('spent', $oldAmount);
                $budget->increment('spent', $newAmount);
            }
        }

        return response()->json(['data' => $cost->fresh()->load(['project', 'budget', 'incurredBy'])]);
    }

    public function destroyCost(ProjectCost $cost): JsonResponse
    {
        if ($cost->budget_id) {
            $budget = ProjectBudget::find($cost->budget_id);
            if ($budget) {
                $budget->decrement('spent', $cost->amount);
            }
        }

        $cost->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Progress Tracking ───────────────────────────────────

    public function listProgress(Request $request): JsonResponse
    {
        $query = ProjectProgress::with(['project', 'reporter']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $progress = $query->latest('reported_date')->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $progress->items(),
            'meta' => [
                'currentPage' => $progress->currentPage(),
                'lastPage' => $progress->lastPage(),
                'perPage' => $progress->perPage(),
                'total' => $progress->total(),
            ],
        ]);
    }

    public function storeProgress(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'milestone' => 'nullable|string|max:255',
            'progress_percent' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'reported_by' => 'nullable|exists:users,id',
            'reported_date' => 'required|date',
        ]);

        $progress = ProjectProgress::create($data);

        return response()->json(['data' => $progress->load(['project', 'reporter'])], 201);
    }

    public function updateProgress(Request $request, ProjectProgress $progress): JsonResponse
    {
        $data = $request->validate([
            'milestone' => 'nullable|string|max:255',
            'progress_percent' => 'sometimes|required|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'reported_date' => 'sometimes|required|date',
        ]);

        $progress->update($data);

        return response()->json(['data' => $progress->fresh()->load(['project', 'reporter'])]);
    }

    // ─── Resource Allocation ─────────────────────────────────

    public function listResources(Request $request): JsonResponse
    {
        $query = ProjectResource::with(['project', 'user']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('resource_name', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $resources = $query->latest()->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $resources->items(),
            'meta' => [
                'currentPage' => $resources->currentPage(),
                'lastPage' => $resources->lastPage(),
                'perPage' => $resources->perPage(),
                'total' => $resources->total(),
            ],
        ]);
    }

    public function storeAllocation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'nullable|exists:users,id',
            'resource_name' => 'required|string|max:255',
            'resource_type' => 'required|string|in:Human,Equipment,Software,Other',
            'role' => 'nullable|string|max:255',
            'allocation_percent' => 'required|integer|min:1|max:100',
            'hourly_rate' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string|in:Active,Released,On Hold',
        ]);

        $resource = ProjectResource::create($data);

        return response()->json(['data' => $resource->load(['project', 'user'])], 201);
    }

    public function updateAllocation(Request $request, ProjectResource $resource): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'resource_name' => 'sometimes|required|string|max:255',
            'resource_type' => 'sometimes|required|string|in:Human,Equipment,Software,Other',
            'role' => 'nullable|string|max:255',
            'allocation_percent' => 'sometimes|required|integer|min:1|max:100',
            'hourly_rate' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string|in:Active,Released,On Hold',
        ]);

        $resource->update($data);

        return response()->json(['data' => $resource->fresh()->load(['project', 'user'])]);
    }

    public function destroyAllocation(ProjectResource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Sprint Management ───────────────────────────────────

    public function listSprints(Request $request): JsonResponse
    {
        $query = ProjectSprint::with(['project', 'backlogs']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $sprints = $query->latest('start_date')->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $sprints->items(),
            'meta' => [
                'currentPage' => $sprints->currentPage(),
                'lastPage' => $sprints->lastPage(),
                'perPage' => $sprints->perPage(),
                'total' => $sprints->total(),
            ],
        ]);
    }

    public function storeSprint(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'nullable|string|in:Planning,Active,Completed',
        ]);

        $sprint = ProjectSprint::create($data);

        return response()->json(['data' => $sprint->load('project')], 201);
    }

    public function updateSprint(Request $request, ProjectSprint $sprint): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'goal' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date',
            'status' => 'nullable|string|in:Planning,Active,Completed',
        ]);

        $sprint->update($data);

        return response()->json(['data' => $sprint->fresh()->load('project')]);
    }

    public function destroySprint(ProjectSprint $sprint): JsonResponse
    {
        $sprint->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Backlog Management ──────────────────────────────────

    public function listBacklog(Request $request): JsonResponse
    {
        $query = ProjectBacklog::with(['project', 'sprint', 'assignee']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('sprint_id')) {
            $query->where('sprint_id', $request->sprint_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $backlog = $query->orderBy('sort_order')->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $backlog->items(),
            'meta' => [
                'currentPage' => $backlog->currentPage(),
                'lastPage' => $backlog->lastPage(),
                'perPage' => $backlog->perPage(),
                'total' => $backlog->total(),
            ],
        ]);
    }

    public function storeBacklogItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:project_sprints,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:Feature,Bug,Task,Spike,Chore',
            'priority' => 'nullable|string|in:Low,Medium,High,Critical',
            'status' => 'nullable|string|in:To Do,In Progress,In Review,Done',
            'story_points' => 'nullable|integer|min:0',
            'assigned_to' => 'nullable|exists:users,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $item = ProjectBacklog::create($data);

        return response()->json(['data' => $item->load(['project', 'sprint', 'assignee'])], 201);
    }

    public function updateBacklogItem(Request $request, ProjectBacklog $item): JsonResponse
    {
        $data = $request->validate([
            'sprint_id' => 'nullable|exists:project_sprints,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:Feature,Bug,Task,Spike,Chore',
            'priority' => 'nullable|string|in:Low,Medium,High,Critical',
            'status' => 'nullable|string|in:To Do,In Progress,In Review,Done',
            'story_points' => 'nullable|integer|min:0',
            'assigned_to' => 'nullable|exists:users,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $item->update($data);

        return response()->json(['data' => $item->fresh()->load(['project', 'sprint', 'assignee'])]);
    }

    public function destroyBacklogItem(ProjectBacklog $item): JsonResponse
    {
        $item->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Risk Tracking ───────────────────────────────────────

    public function listRisks(Request $request): JsonResponse
    {
        $query = ProjectRisk::with(['project', 'owner']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $risks = $query->latest()->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $risks->items(),
            'meta' => [
                'currentPage' => $risks->currentPage(),
                'lastPage' => $risks->lastPage(),
                'perPage' => $risks->perPage(),
                'total' => $risks->total(),
            ],
        ]);
    }

    public function storeRisk(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'probability' => 'nullable|string|in:Low,Medium,High',
            'impact' => 'nullable|string|in:Low,Medium,High',
            'status' => 'nullable|string|in:Open,Mitigating,Monitoring,Closed',
            'mitigation_plan' => 'nullable|string',
            'owner_id' => 'nullable|exists:users,id',
        ]);

        $risk = ProjectRisk::create($data);

        return response()->json(['data' => $risk->load(['project', 'owner'])], 201);
    }

    public function updateRisk(Request $request, ProjectRisk $risk): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:255',
            'probability' => 'nullable|string|in:Low,Medium,High',
            'impact' => 'nullable|string|in:Low,Medium,High',
            'status' => 'nullable|string|in:Open,Mitigating,Monitoring,Closed',
            'mitigation_plan' => 'nullable|string',
            'owner_id' => 'nullable|exists:users,id',
        ]);

        $risk->update($data);

        return response()->json(['data' => $risk->fresh()->load(['project', 'owner'])]);
    }

    public function destroyRisk(ProjectRisk $risk): JsonResponse
    {
        $risk->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Documentation ───────────────────────────────────────

    public function listDocs(Request $request): JsonResponse
    {
        $query = ProjectDocument::with(['project', 'creator']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $docs = $query->latest()->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $docs->items(),
            'meta' => [
                'currentPage' => $docs->currentPage(),
                'lastPage' => $docs->lastPage(),
                'perPage' => $docs->perPage(),
                'total' => $docs->total(),
            ],
        ]);
    }

    public function storeDoc(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'nullable|string|in:Note,Guide,Spec,Requirement,Meeting Minutes',
            'file_path' => 'nullable|string|max:500',
            'created_by' => 'nullable|exists:users,id',
        ]);

        $doc = ProjectDocument::create($data);

        return response()->json(['data' => $doc->load(['project', 'creator'])], 201);
    }

    public function updateDoc(Request $request, ProjectDocument $doc): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'nullable|string|in:Note,Guide,Spec,Requirement,Meeting Minutes',
            'file_path' => 'nullable|string|max:500',
        ]);

        $doc->update($data);

        return response()->json(['data' => $doc->fresh()->load(['project', 'creator'])]);
    }

    public function destroyDoc(ProjectDocument $doc): JsonResponse
    {
        $doc->delete();

        return response()->json(['ok' => true]);
    }

    // ─── Calendar Events ─────────────────────────────────────

    public function listCalendarEvents(Request $request): JsonResponse
    {
        $query = ProjectCalendarEvent::with(['project', 'creator']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('from')) {
            $query->where('start_date', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('start_date', '<=', $request->to);
        }
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->integer('per_page', 100), 200));
        $events = $query->orderBy('start_date')->paginate($perPage)->appends($request->query());

        return response()->json([
            'data' => $events->items(),
            'meta' => [
                'currentPage' => $events->currentPage(),
                'lastPage' => $events->lastPage(),
                'perPage' => $events->perPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    public function storeCalendarEvent(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:Meeting,Deadline,Milestone,Sprint,Other',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_all_day' => 'nullable|boolean',
            'created_by' => 'nullable|exists:users,id',
        ]);

        $event = ProjectCalendarEvent::create($data);

        return response()->json(['data' => $event->load(['project', 'creator'])], 201);
    }

    public function updateCalendarEvent(Request $request, ProjectCalendarEvent $event): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:Meeting,Deadline,Milestone,Sprint,Other',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date',
            'is_all_day' => 'nullable|boolean',
        ]);

        $event->update($data);

        return response()->json(['data' => $event->fresh()->load(['project', 'creator'])]);
    }

    public function destroyCalendarEvent(ProjectCalendarEvent $event): JsonResponse
    {
        $event->delete();

        return response()->json(['ok' => true]);
    }
}
