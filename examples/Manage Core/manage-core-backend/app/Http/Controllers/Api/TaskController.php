<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $tasks = $project->tasks()->with(['assignee', 'tags'])
            ->withSum('timeLogs', 'duration')->latest()->paginate($perPage);
        $tasks->getCollection()->transform(fn($t) => tap($t, fn($t) => $t->total_duration = $t->time_logs_sum_duration ?? 0));
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

    public function listAll(Request $request): JsonResponse
    {
        $query = Task::with(['assignee', 'tags', 'project'])
            ->withSum('timeLogs', 'duration');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $perPage = $request->per_page ?? 50;
        $tasks = $query->latest()->paginate($perPage);
        $tasks->getCollection()->transform(fn($t) => tap($t, fn($t) => $t->total_duration = $t->time_logs_sum_duration ?? 0));

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

    public function store(Request $request, ?Project $project = null): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        // Clean up nullable fields if they are empty strings
        foreach (['description', 'assigned_to', 'status', 'priority', 'due_date', 'project_id'] as $field) {
            if (isset($data[$field]) && $data[$field] === '') {
                $data[$field] = null;
            }
        }

        if ($project) {
            $task = $project->tasks()->create($data);
        } else {
            $task = Task::create($data);
        }

        $task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'created',
            'description' => 'Created task: ' . $task->title,
        ]);

        return response()->json(['data' => $task->load('assignee')], 201);
    }

    public function show(Task $task): JsonResponse
    {
        return response()->json(['data' => $task->load('assignee', 'project', 'tags')]);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        // Clean up nullable fields if they are empty strings
        foreach (['description', 'assigned_to', 'status', 'priority', 'due_date'] as $field) {
            if (array_key_exists($field, $data) && $data[$field] === '') {
                $data[$field] = null;
            }
        }

        $oldStatus = $task->status;
        $task->update($data);

        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            $task->activityLogs()->create([
                'user_id' => auth()->id(),
                'action' => 'updated_status',
                'description' => "Changed status from $oldStatus to {$data['status']}",
            ]);
        }

        return response()->json(['data' => $task->load('assignee', 'tags')]);
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();
        return response()->json(['ok' => true]);
    }

    public function trashed(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $tasks = Task::onlyTrashed()->with(['assignee', 'project'])->latest('deleted_at')->paginate($perPage);
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

    public function restore(int $id): JsonResponse
    {
        $task = Task::onlyTrashed()->findOrFail($id);
        $task->restore();
        return response()->json(['data' => $task->load('assignee', 'project')]);
    }

    public function forceDestroy(int $id): JsonResponse
    {
        $task = Task::onlyTrashed()->findOrFail($id);
        $task->forceDelete();
        return response()->json(['ok' => true]);
    }

    public function addTag(Request $request, Task $task): JsonResponse
    {
        $data = $request->validate([
            'tag_id' => 'required|exists:tags,id',
        ]);

        $task->tags()->syncWithoutDetaching([$data['tag_id']]);

        $task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'added_tag',
            'description' => 'Added tag to task',
        ]);

        return response()->json(['data' => $task->load('tags')]);
    }

    public function removeTag(Task $task, \App\Models\Tag $tag): JsonResponse
    {
        $task->tags()->detach($tag->id);

        $task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'removed_tag',
            'description' => 'Removed tag from task',
        ]);

        return response()->json(['ok' => true]);
    }

    public function timeLogs(Task $task): JsonResponse
    {
        return response()->json(['data' => $task->timeLogs()->with('user')->latest()->get()]);
    }

    public function startTimeLog(Request $request, Task $task): JsonResponse
    {
        $log = $task->timeLogs()->create([
            'user_id' => auth()->id(),
            'start_time' => now(),
            'note' => $request->input('note'),
        ]);

        return response()->json(['data' => $log]);
    }

    public function stopTimeLog(\App\Models\TaskTimeLog $timeLog): JsonResponse
    {
        $timeLog->update([
            'end_time' => now(),
            'duration' => now()->diffInSeconds($timeLog->start_time),
        ]);

        return response()->json(['data' => $timeLog]);
    }

    public function activityLogs(Task $task): JsonResponse
    {
        return response()->json(['data' => $task->activityLogs()->with(['user', 'task'])->latest()->get()]);
    }

    // --- Dependencies ---

    public function dependencies(Task $task): JsonResponse
    {
        $deps = $task->dependencies()->with('dependsOn')->get();
        return response()->json(['data' => $deps]);
    }

    public function storeDependency(Request $request, Task $task): JsonResponse
    {
        $data = $request->validate([
            'depends_on_task_id' => 'required|exists:tasks,id|different:task_id',
            'type' => 'nullable|string|in:FS,FF,SS,SF',
        ]);

        // Prevent duplicate
        $exists = \App\Models\TaskDependency::where('task_id', $task->id)
            ->where('depends_on_task_id', $data['depends_on_task_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Dependency already exists.'], 409);
        }

        $dep = $task->dependencies()->create([
            'depends_on_task_id' => $data['depends_on_task_id'],
            'type' => $data['type'] ?? 'FS',
        ]);

        return response()->json(['data' => $dep->load('dependsOn')], 201);
    }

    public function destroyDependency(Task $task, \App\Models\TaskDependency $dependency): JsonResponse
    {
        if ($dependency->task_id !== $task->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        $dependency->delete();
        return response()->json(['ok' => true]);
    }

    public function updateDependency(Request $request, Task $task, \App\Models\TaskDependency $dependency): JsonResponse
    {
        if ($dependency->task_id !== $task->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $data = $request->validate([
            'depends_on_task_id' => 'sometimes|required|exists:tasks,id|different:task_id',
            'type' => 'nullable|string|in:FS,FF,SS,SF',
        ]);

        if (isset($data['depends_on_task_id'])) {
            $exists = \App\Models\TaskDependency::where('task_id', $task->id)
                ->where('depends_on_task_id', $data['depends_on_task_id'])
                ->where('id', '!=', $dependency->id)
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Dependency already exists.'], 409);
            }
        }

        $dependency->update($data);

        return response()->json(['data' => $dependency->fresh()->load('dependsOn')]);
    }

    public function listAllDependencies(Request $request): JsonResponse
    {
        $query = \App\Models\TaskDependency::with(['task', 'dependsOn']);

        if ($request->filled('project_id')) {
            $projectId = $request->project_id;
            $query->whereHas('task', fn($q) => $q->where('project_id', $projectId))
                  ->orWhereHas('dependsOn', fn($q) => $q->where('project_id', $projectId));
        }

        $perPage = $request->per_page ?? 50;
        $deps = $query->latest()->paginate($perPage);
        return response()->json([
            'data' => $deps->items(),
            'pagination' => [
                'current_page' => $deps->currentPage(),
                'per_page' => $deps->perPage(),
                'total' => $deps->total(),
                'last_page' => $deps->lastPage(),
            ],
        ]);
    }

    // --- Time Logs ---

    public function listAllTimeLogs(Request $request): JsonResponse
    {
        $query = \App\Models\TaskTimeLog::with(['task', 'user']);

        if ($request->filled('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        $perPage = $request->per_page ?? 50;
        $logs = $query->latest()->paginate($perPage);
        return response()->json([
            'data' => $logs->items(),
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }

    public function weeklyTimeSummary(): JsonResponse
    {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $logs = \App\Models\TaskTimeLog::whereBetween('start_time', [$startOfWeek, $endOfWeek])
            ->get();

        $dailyTotals = [];
        $totalWeek = 0;
        for ($i = 0; $i < 7; $i++) {
            $day = $startOfWeek->copy()->addDays($i);
            $daySeconds = $logs->filter(fn($log) => $log->start_time->isSameDay($day))->sum('duration');
            $dailyTotals[$day->format('l')] = $daySeconds;
            $totalWeek += $daySeconds;
        }

        $todaySeconds = $logs->filter(fn($log) => $log->start_time->isToday())->sum('duration');

        return response()->json([
            'data' => [
                'today' => $todaySeconds,
                'week' => $totalWeek,
                'daily' => $dailyTotals,
            ]
        ]);
    }

    public function recentTimeLogs(): JsonResponse
    {
        $logs = \App\Models\TaskTimeLog::with(['task', 'user'])
            ->whereNotNull('end_time')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json(['data' => $logs]);
    }

    public function workHeatmap(Request $request): JsonResponse
    {
        $days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $hours = [9, 10, 11, 12, 13, 14, 15, 16];

        $startDate = $request->filled('start_date')
            ? \Carbon\Carbon::parse($request->input('start_date'))->startOfDay()
            : now()->subDays(6)->startOfDay();
        $endDate = $request->filled('end_date')
            ? \Carbon\Carbon::parse($request->input('end_date'))->endOfDay()
            : now()->endOfDay();

        $logs = \App\Models\TaskTimeLog::with('task')
            ->whereNotNull('end_time')
            ->whereBetween('start_time', [$startDate, $endDate])
            ->get();

        $grid = [];
        foreach ($days as $di => $day) {
            $grid[$di] = [];
            foreach ($hours as $hour) {
                $grid[$di][$hour] = ['tasks' => 0, 'hours' => 0];
            }
        }

        $totalTasks = 0;
        $totalHours = 0;
        $dayTotals = array_fill(0, 7, 0);
        $hourTotals = array_fill_keys($hours, 0);
        $bestDayIndex = 0;
        $bestHour = $hours[0];

        foreach ($logs as $log) {
            $dayIndex = (int) $log->start_time->format('w');
            $hour = (int) $log->start_time->format('G');
            if (!isset($grid[$dayIndex][$hour])) {
                continue;
            }
            $durationHours = $log->duration ? $log->duration / 3600 : 0;
            $grid[$dayIndex][$hour]['tasks'] += 1;
            $grid[$dayIndex][$hour]['hours'] = round($grid[$dayIndex][$hour]['hours'] + $durationHours, 2);

            $totalTasks += 1;
            $totalHours += $durationHours;
            $dayTotals[$dayIndex] += $durationHours;
            $hourTotals[$hour] += $durationHours;
        }

        foreach ($dayTotals as $di => $val) {
            if ($val > $dayTotals[$bestDayIndex]) {
                $bestDayIndex = $di;
            }
        }
        foreach ($hours as $hour) {
            if ($hourTotals[$hour] > $hourTotals[$bestHour]) {
                $bestHour = $hour;
            }
        }

        $maxHours = 0;
        foreach ($grid as $dayRow) {
            foreach ($dayRow as $cell) {
                if ($cell['hours'] > $maxHours) {
                    $maxHours = $cell['hours'];
                }
            }
        }

        $avgDaily = count(array_filter($dayTotals, fn($v) => $v > 0)) > 0
            ? round($totalHours / 7, 1)
            : 0;

        $weeklyScore = $maxHours > 0
            ? min(100, round(($totalHours / (count($days) * count($hours) * 2)) * 100))
            : 0;

        return response()->json([
            'data' => [
                'days' => $days,
                'hours' => $hours,
                'grid' => $grid,
                'summary' => [
                    'totalTasks' => $totalTasks,
                    'totalHours' => round($totalHours, 1),
                    'avgDaily' => $avgDaily,
                    'bestDay' => $days[$bestDayIndex],
                    'bestHour' => $bestHour . ':00',
                    'weeklyScore' => $weeklyScore,
                ],
            ],
        ]);
    }
}
