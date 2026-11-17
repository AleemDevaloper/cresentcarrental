<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\Attendance;
use App\Models\User;
use App\Models\TaskTimeLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TmsReportingController extends Controller
{
    public function kpiDashboards(Request $request): JsonResponse
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $totalTasks = Task::count();
        $completedTasks = Task::where('status', 'Done')->count();
        $inProgressTasks = Task::where('status', 'In Progress')->count();
        $todoTasks = Task::where('status', 'To Do')->count();
        $overdueTasks = Task::where('due_date', '<', $now)->where('status', '!=', 'Done')->count();

        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;
        $overdueRate = $totalTasks > 0 ? round(($overdueTasks / $totalTasks) * 100, 1) : 0;

        $avgCompletionTime = DB::table('tasks')
            ->where('status', 'Done')
            ->whereNotNull('due_date')
            ->whereNotNull('updated_at')
            ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
            ->value('avg_days') ?? 0;

        $tasksWithTimeLogs = Task::where('status', 'Done')
            ->whereHas('timeLogs')
            ->withSum('timeLogs', 'duration')
            ->get();

        $avgTimePerTask = $tasksWithTimeLogs->count() > 0
            ? round($tasksWithTimeLogs->avg('time_logs_sum_duration') / 3600, 1)
            : 0;

        $thisMonthCreated = Task::where('created_at', '>=', $startOfMonth)->count();
        $thisMonthCompleted = Task::where('status', 'Done')
            ->where('updated_at', '>=', $startOfMonth)->count();

        $lastMonthCreated = Task::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthCompleted = Task::where('status', 'Done')
            ->whereBetween('updated_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $calculateTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? '+100%' : '0%';
            }
            $diff = (($current - $previous) / $previous) * 100;
            return ($diff >= 0 ? '+' : '') . round($diff, 1) . '%';
        };

        $priorityCounts = Task::selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')->pluck('count', 'priority');

        $statusCounts = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')->pluck('count', 'status');

        $productivityByUser = Task::select('assigned_to', DB::raw('COUNT(*) as total'))
            ->where('status', 'Done')
            ->whereNotNull('assigned_to')
            ->groupBy('assigned_to')
            ->with('assignee')
            ->get()
            ->map(function ($item) {
                return [
                    'user_id' => $item->assigned_to,
                    'name' => $item->assignee?->name ?? 'Unknown',
                    'completed_tasks' => $item->total,
                ];
            })
            ->sortByDesc('completed_tasks')
            ->values()
            ->take(10);

        return response()->json([
            'data' => [
                'kpis' => [
                    'completion_rate' => [
                        'value' => $completionRate,
                        'label' => 'Completion Rate',
                        'unit' => '%',
                        'trend' => $calculateTrend($thisMonthCompleted, $lastMonthCompleted),
                    ],
                    'overdue_rate' => [
                        'value' => $overdueRate,
                        'label' => 'Overdue Rate',
                        'unit' => '%',
                        'trend' => $calculateTrend($overdueTasks, Task::where('due_date', '<', $startOfLastMonth)->where('status', '!=', 'Done')->count()),
                    ],
                    'avg_completion_time' => [
                        'value' => round($avgCompletionTime, 1),
                        'label' => 'Avg Completion Time',
                        'unit' => 'days',
                        'trend' => null,
                    ],
                    'avg_time_per_task' => [
                        'value' => $avgTimePerTask,
                        'label' => 'Avg Time Per Task',
                        'unit' => 'hours',
                        'trend' => null,
                    ],
                    'total_tasks' => [
                        'value' => $totalTasks,
                        'label' => 'Total Tasks',
                        'trend' => $calculateTrend($thisMonthCreated, $lastMonthCreated),
                    ],
                    'completed_tasks' => [
                        'value' => $completedTasks,
                        'label' => 'Completed Tasks',
                        'trend' => $calculateTrend($thisMonthCompleted, $lastMonthCompleted),
                    ],
                    'in_progress_tasks' => [
                        'value' => $inProgressTasks,
                        'label' => 'In Progress',
                        'trend' => null,
                    ],
                    'overdue_tasks' => [
                        'value' => $overdueTasks,
                        'label' => 'Overdue Tasks',
                        'trend' => null,
                    ],
                ],
                'status_distribution' => [
                    'To Do' => $statusCounts->get('To Do', 0),
                    'In Progress' => $statusCounts->get('In Progress', 0),
                    'Testing' => $statusCounts->get('Testing', 0),
                    'Done' => $statusCounts->get('Done', 0),
                    'Pending Approval' => $statusCounts->get('Pending Approval', 0),
                ],
                'priority_distribution' => [
                    'Critical' => $priorityCounts->get('Critical', 0),
                    'High' => $priorityCounts->get('High', 0),
                    'Medium' => $priorityCounts->get('Medium', 0),
                    'Low' => $priorityCounts->get('Low', 0),
                ],
                'top_performers' => $productivityByUser,
            ],
        ]);
    }

    public function forecastingAnalytics(Request $request): JsonResponse
    {
        $now = now();
        $months = [];
        $completionTrend = [];
        $creationTrend = [];
        $velocityTrend = [];

        for ($i = 5; $i >= 0; $i--) {
            $monthDate = $now->copy()->subMonths($i);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();

            $months[] = $monthDate->format('M Y');

            $created = Task::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $completed = Task::where('status', 'Done')
                ->whereBetween('updated_at', [$monthStart, $monthEnd])->count();

            $completionTrend[] = $created > 0 ? round(($completed / $created) * 100) : 0;
            $creationTrend[] = $created;
            $velocityTrend[] = $completed;
        }

        $avgVelocity = count($velocityTrend) > 0 ? round(array_sum($velocityTrend) / count($velocityTrend)) : 0;
        $velocityTrendLast3 = array_slice($velocityTrend, -3);
        $recentAvgVelocity = count($velocityTrendLast3) > 0 ? round(array_sum($velocityTrendLast3) / count($velocityTrendLast3)) : 0;

        $pendingTasks = Task::where('status', '!=', 'Done')->count();
        $forecastedCompletionWeeks = $recentAvgVelocity > 0 ? round($pendingTasks / $recentAvgVelocity, 1) : 0;

        $tasksCreatedLast7Days = Task::where('created_at', '>=', now()->subDays(7))->count();
        $avgDailyCreation = round($tasksCreatedLast7Days / 7, 1);
        $forecastedCreationWeek = round($avgDailyCreation * 7);

        $overdueTasks = Task::where('due_date', '<', now())->where('status', '!=', 'Done')->count();
        $criticalOverdue = Task::where('due_date', '<', now())
            ->where('status', '!=', 'Done')
            ->where('priority', 'Critical')
            ->count();

        $milestones = Milestone::where('due_date', '>=', now())
            ->where('status', '!=', 'Completed')
            ->with('project')
            ->orderBy('due_date')
            ->get()
            ->map(function ($ms) use ($avgVelocity) {
                $projectTasks = Task::where('project_id', $ms->project_id)->count();
                $completedTasks = Task::where('project_id', $ms->project_id)
                    ->where('status', 'Done')->count();
                $remaining = $projectTasks - $completedTasks;
                $estimatedWeeks = $avgVelocity > 0 ? round($remaining / $avgVelocity, 1) : null;

                return [
                    'id' => $ms->id,
                    'title' => $ms->title,
                    'project' => $ms->project?->name,
                    'due_date' => $ms->due_date,
                    'remaining_tasks' => $remaining,
                    'estimated_weeks' => $estimatedWeeks,
                    'at_risk' => $ms->due_date->diffInDays(now()) < 14 && $remaining > 5,
                ];
            });

        return response()->json([
            'data' => [
                'trends' => [
                    'months' => $months,
                    'completion_rates' => $completionTrend,
                    'task_creation' => $creationTrend,
                    'velocity' => $velocityTrend,
                ],
                'forecast' => [
                    'avg_velocity' => $avgVelocity,
                    'pending_tasks' => $pendingTasks,
                    'estimated_weeks_to_complete' => $forecastedCompletionWeeks,
                    'estimated_tasks_next_week' => $forecastedCreationWeek,
                    'daily_creation_rate' => $avgDailyCreation,
                ],
                'risk_assessment' => [
                    'overdue_tasks' => $overdueTasks,
                    'critical_overdue' => $criticalOverdue,
                    'risk_level' => $overdueTasks > 10 ? 'high' : ($overdueTasks > 5 ? 'medium' : 'low'),
                ],
                'milestone_forecasts' => $milestones,
            ],
        ]);
    }

    public function burndownCharts(Request $request): JsonResponse
    {
        $now = now();
        $projectId = $request->input('project_id');
        $milestoneId = $request->input('milestone_id');

        $tasksQuery = Task::query();
        if ($projectId) {
            $tasksQuery->where('project_id', $projectId);
        }

        $totalTasks = $tasksQuery->count();
        $completedTasks = (clone $tasksQuery)->where('status', 'Done')->count();
        $remainingTasks = $totalTasks - $completedTasks;

        $milestones = Milestone::query();
        if ($projectId) {
            $milestones->where('project_id', $projectId);
        }
        if ($milestoneId) {
            $milestones->where('id', $milestoneId);
        }

        $milestoneData = $milestones->with('project')->get()->map(function ($ms) {
            $projectTasks = Task::where('project_id', $ms->project_id)->count();
            $completedTasks = Task::where('project_id', $ms->project_id)
                ->where('status', 'Done')->count();
            $remaining = $projectTasks - $completedTasks;
            $progress = $projectTasks > 0 ? round(($completedTasks / $projectTasks) * 100) : 0;

            return [
                'id' => $ms->id,
                'title' => $ms->title,
                'project' => $ms->project?->name,
                'due_date' => $ms->due_date,
                'total_tasks' => $projectTasks,
                'completed_tasks' => $completedTasks,
                'remaining_tasks' => $remaining,
                'progress' => $progress,
                'status' => $ms->status,
                'is_overdue' => $ms->due_date && $ms->due_date->isPast() && $ms->status !== 'Completed',
            ];
        });

        $days = 30;
        $burndownData = [];
        $idealLine = [];

        $startDate = $now->copy()->subDays($days)->startOfDay();

        $dailyCompleted = Task::where('status', 'Done')
            ->where('updated_at', '>=', $startDate)
            ->selectRaw('DATE(updated_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $cumulative = 0;
        for ($i = 0; $i <= $days; $i++) {
            $date = $startDate->copy()->addDays($i)->format('Y-m-d');
            $dayLabel = $startDate->copy()->addDays($i)->format('M d');
            $completed = $dailyCompleted->get($date, 0);
            $cumulative += $completed;
            $remaining = max(0, $totalTasks - $cumulative);

            $burndownData[] = [
                'date' => $dayLabel,
                'remaining' => $remaining,
                'completed_today' => $completed,
            ];

            $idealRemaining = max(0, round($totalTasks * (1 - ($i / $days))));
            $idealLine[] = [
                'date' => $dayLabel,
                'remaining' => $idealRemaining,
            ];
        }

        $statusBreakdown = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return response()->json([
            'data' => [
                'summary' => [
                    'total_tasks' => $totalTasks,
                    'completed_tasks' => $completedTasks,
                    'remaining_tasks' => $remainingTasks,
                    'overall_progress' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
                ],
                'burndown' => [
                    'labels' => collect($burndownData)->pluck('date')->toArray(),
                    'actual' => collect($burndownData)->pluck('remaining')->toArray(),
                    'ideal' => collect($idealLine)->pluck('remaining')->toArray(),
                    'daily_completed' => collect($burndownData)->pluck('completed_today')->toArray(),
                ],
                'status_breakdown' => $statusBreakdown->toArray(),
                'milestones' => $milestoneData,
            ],
        ]);
    }

    public function attendanceProductivityInsights(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $startDate = now()->subDays($days)->startOfDay();

        $attendance = Attendance::where('date', '>=', $startDate->format('Y-m-d'))
            ->with('user')
            ->get();

        $attendanceByUser = $attendance->groupBy('user_id')->map(function ($records, $userId) {
            $presentDays = $records->whereIn('status', ['present', 'late'])->count();
            $absentDays = $records->where('status', 'absent')->count();
            $totalDays = $records->count();

            $totalHours = $records->filter(fn($r) => $r->clock_in && $r->clock_out)
                ->sum(function ($r) {
                    $in = \Carbon\Carbon::parse($r->clock_in);
                    $out = \Carbon\Carbon::parse($r->clock_out);
                    return $in->diffInHours($out);
                });

            return [
                'user_id' => $userId,
                'user' => $records->first()->user?->name ?? 'Unknown',
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'total_days' => $totalDays,
                'attendance_rate' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100) : 0,
                'total_hours' => $totalHours,
            ];
        });

        $userProductivity = Task::where('created_at', '>=', $startDate)
            ->whereNotNull('assigned_to')
            ->select('assigned_to', DB::raw('COUNT(*) as total_tasks'),
                DB::raw("SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as completed_tasks"),
                DB::raw("SUM(CASE WHEN due_date < NOW() AND status != 'Done' THEN 1 ELSE 0 END) as overdue_tasks"))
            ->groupBy('assigned_to')
            ->get()
            ->map(function ($item) {
                $total = $item->total_tasks;
                $completed = $item->completed_tasks;
                return [
                    'user_id' => $item->assigned_to,
                    'total_tasks' => $total,
                    'completed_tasks' => $completed,
                    'overdue_tasks' => $item->overdue_tasks,
                    'completion_rate' => $total > 0 ? round(($completed / $total) * 100) : 0,
                ];
            });

        $attendanceProductivity = $attendanceByUser->map(function ($att) use ($userProductivity) {
            $prod = $userProductivity->firstWhere('user_id', $att['user_id']) ?? [
                'total_tasks' => 0,
                'completed_tasks' => 0,
                'overdue_tasks' => 0,
                'completion_rate' => 0,
            ];

            $productivityScore = 0;
            if ($att['attendance_rate'] > 0 && $prod['completion_rate'] > 0) {
                $productivityScore = round(($att['attendance_rate'] * 0.4) + ($prod['completion_rate'] * 0.6));
            }

            return array_merge($att, $prod, ['productivity_score' => $productivityScore]);
        })->sortByDesc('productivity_score')->values();

        $totalPresent = $attendance->whereIn('status', ['present', 'late'])->count();
        $totalRecords = $attendance->count();
        $overallAttendanceRate = $totalRecords > 0 ? round(($totalPresent / $totalRecords) * 100) : 0;

        $totalTasks = Task::where('created_at', '>=', $startDate)->count();
        $completedTasks = Task::where('created_at', '>=', $startDate)
            ->where('status', 'Done')->count();
        $overallCompletionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return response()->json([
            'data' => [
                'summary' => [
                    'period_days' => $days,
                    'overall_attendance_rate' => $overallAttendanceRate,
                    'overall_completion_rate' => $overallCompletionRate,
                    'total_users_tracked' => $attendanceProductivity->count(),
                ],
                'user_insights' => $attendanceProductivity,
                'correlation' => [
                    'high_attendance_high_completion' => $attendanceProductivity
                        ->filter(fn($u) => $u['attendance_rate'] >= 80 && $u['completion_rate'] >= 70)
                        ->count(),
                    'low_attendance_low_completion' => $attendanceProductivity
                        ->filter(fn($u) => $u['attendance_rate'] < 60 && $u['completion_rate'] < 50)
                        ->count(),
                ],
            ],
        ]);
    }

    public function exportReports(Request $request): StreamedResponse|JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|string|in:tasks,projects,team_performance,attendance',
            'format' => 'nullable|string|in:csv,json',
            'project_id' => 'nullable|exists:projects,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
        ]);

        $format = $data['format'] ?? 'csv';
        $type = $data['type'];

        $rows = [];

        switch ($type) {
            case 'tasks':
                $query = Task::with(['assignee', 'project', 'timeLogs']);

                if (!empty($data['project_id'])) {
                    $query->where('project_id', $data['project_id']);
                }
                if (!empty($data['start_date'])) {
                    $query->where('created_at', '>=', $data['start_date']);
                }
                if (!empty($data['end_date'])) {
                    $query->where('created_at', '<=', $data['end_date']);
                }
                if (!empty($data['status'])) {
                    $query->where('status', $data['status']);
                }
                if (!empty($data['priority'])) {
                    $query->where('priority', $data['priority']);
                }

                $tasks = $query->get();

                $rows[] = ['ID', 'Title', 'Project', 'Assignee', 'Status', 'Priority', 'Due Date', 'Progress', 'Hours Logged', 'Created At'];

                foreach ($tasks as $task) {
                    $hours = round($task->timeLogs->sum('duration') / 3600, 1);
                    $rows[] = [
                        $task->id,
                        $task->title,
                        $task->project?->name ?? '',
                        $task->assignee?->name ?? 'Unassigned',
                        $task->status,
                        $task->priority,
                        $task->due_date ? \Carbon\Carbon::parse($task->due_date)->format('Y-m-d') : '',
                        $task->progress ?? 0,
                        $hours,
                        $task->created_at?->format('Y-m-d H:i:s'),
                    ];
                }
                break;

            case 'projects':
                $query = Project::with(['clientInfo', 'tasks']);

                if (!empty($data['start_date'])) {
                    $query->where('created_at', '>=', $data['start_date']);
                }
                if (!empty($data['end_date'])) {
                    $query->where('created_at', '<=', $data['end_date']);
                }

                $projects = $query->get();

                $rows[] = ['ID', 'Name', 'Client', 'Status', 'Total Tasks', 'Completed Tasks', 'Progress %', 'Created At'];

                foreach ($projects as $project) {
                    $total = $project->tasks->count();
                    $completed = $project->tasks->where('status', 'Done')->count();
                    $rows[] = [
                        $project->id,
                        $project->name,
                        $project->clientInfo?->name ?? $project->client ?? '',
                        $project->status,
                        $total,
                        $completed,
                        $total > 0 ? round(($completed / $total) * 100) : 0,
                        $project->created_at?->format('Y-m-d H:i:s'),
                    ];
                }
                break;

            case 'team_performance':
                $users = User::with(['teams', 'attendance'])->get();

                $rows[] = ['ID', 'Name', 'Email', 'Department', 'Teams', 'Total Tasks', 'Completed Tasks', 'Completion Rate', 'Attendance Rate'];

                foreach ($users as $user) {
                    $tasks = Task::where('assigned_to', $user->id)->get();
                    $total = $tasks->count();
                    $completed = $tasks->where('status', 'Done')->count();

                    $attendance = $user->attendance;
                    $presentDays = $attendance->whereIn('status', ['present', 'late'])->count();
                    $totalDays = $attendance->count();

                    $rows[] = [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->department?->name ?? '',
                        $user->teams->pluck('name')->implode(', '),
                        $total,
                        $completed,
                        $total > 0 ? round(($completed / $total) * 100) . '%' : '0%',
                        $totalDays > 0 ? round(($presentDays / $totalDays) * 100) . '%' : 'N/A',
                    ];
                }
                break;

            case 'attendance':
                $query = Attendance::with('user');

                if (!empty($data['start_date'])) {
                    $query->where('date', '>=', $data['start_date']);
                }
                if (!empty($data['end_date'])) {
                    $query->where('date', '<=', $data['end_date']);
                }

                $records = $query->get();

                $rows[] = ['ID', 'User', 'Date', 'Status', 'Clock In', 'Clock Out', 'Hours'];

                foreach ($records as $record) {
                    $hours = '';
                    if ($record->clock_in && $record->clock_out) {
                        $in = \Carbon\Carbon::parse($record->clock_in);
                        $out = \Carbon\Carbon::parse($record->clock_out);
                        $hours = round($in->diffInHours($out), 1);
                    }
                    $rows[] = [
                        $record->id,
                        $record->user?->name ?? 'Unknown',
                        $record->date,
                        $record->status,
                        $record->clock_in ?? '',
                        $record->clock_out ?? '',
                        $hours,
                    ];
                }
                break;
        }

        $filename = $type . '_report_' . now()->format('Y-m-d_His');

        if ($format === 'json') {
            return response()->json([
                'data' => $rows,
                'generated_at' => now()->toDateTimeString(),
                'type' => $type,
                'total_rows' => count($rows) - 1,
            ]);
        }

        return response()->stream(function () use ($rows, $filename) {
            $handle = fopen('php://output', 'w');
            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
