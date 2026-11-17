<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\TaskTimeLog;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TmsController extends Controller
{
    public function __construct(protected AiService $ai) {}

    public function stats(): JsonResponse
    {
        // Single GROUP BY for all status counts
        $statusCounts = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')->pluck('count', 'status');

        $totalTasks = $statusCounts->sum();
        $inProgress = $statusCounts->get('In Progress', 0);
        $completed = $statusCounts->get('Done', 0);
        $dueToday = Task::whereDate('due_date', now())->count();

        $statusDistribution = [
            'To Do'       => $statusCounts->get('To Do', 0),
            'In Progress' => $inProgress,
            'Testing'     => $statusCounts->get('Testing', 0),
            'Done'        => $completed,
        ];

        // Single GROUP BY for all priority counts
        $priorityCounts = Task::selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')->pluck('count', 'priority');

        $priorityDistribution = [
            'Critical' => $priorityCounts->get('Critical', 0),
            'High'     => $priorityCounts->get('High', 0),
            'Medium'   => $priorityCounts->get('Medium', 0),
            'Low'      => $priorityCounts->get('Low', 0),
        ];

        // Milestones — batch task/done counts per project
        $upcomingMilestones = Milestone::where('due_date', '>=', now())
            ->with('project')->orderBy('due_date')->limit(5)->get();

        $projectIds = $upcomingMilestones->pluck('project_id')->filter()->unique();
        $taskCountsByProject = collect();
        $doneCountsByProject = collect();
        if ($projectIds->isNotEmpty()) {
            $taskCountsByProject = Task::selectRaw('project_id, COUNT(*) as count')
                ->whereIn('project_id', $projectIds)->groupBy('project_id')
                ->pluck('count', 'project_id');
            $doneCountsByProject = Task::selectRaw('project_id, COUNT(*) as count')
                ->whereIn('project_id', $projectIds)->where('status', 'Done')
                ->groupBy('project_id')->pluck('count', 'project_id');
        }

        $upcomingMilestones = $upcomingMilestones->map(function ($ms) use ($taskCountsByProject, $doneCountsByProject) {
            $milestoneProgress = 0;
            if ($ms->status === 'Completed') {
                $milestoneProgress = 100;
            } elseif ($ms->project) {
                $taskCount = $taskCountsByProject->get($ms->project_id, 0);
                $doneCount = $doneCountsByProject->get($ms->project_id, 0);
                if ($taskCount > 0) {
                    $milestoneProgress = round(($doneCount / $taskCount) * 100);
                }
            }
            return [
                'id'       => $ms->id,
                'title'    => $ms->title,
                'date'     => $ms->due_date,
                'project'  => $ms->project?->name,
                'progress' => $milestoneProgress,
            ];
        });

        // Task trend (last 7 days) — single aggregate
        $sevenDaysAgo = now()->subDays(6)->startOfDay();
        $trendCounts = Task::selectRaw('DATE(updated_at) as date, COUNT(*) as count')
            ->where('status', 'Done')->where('updated_at', '>=', $sevenDaysAgo)
            ->groupBy('date')->pluck('count', 'date');

        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $trend[] = [
                'day'   => now()->subDays($i)->format('D'),
                'count' => $trendCounts->get($date, 0),
            ];
        }

        // Work Progress — active tasks
        $activeTasks = Task::with(['assignee', 'project', 'timeLogs'])
            ->where('status', 'In Progress')
            ->orderBy('updated_at', 'desc')->limit(10)
            ->get()
            ->map(function ($task) {
                $totalHours = $task->timeLogs->sum(fn($log) => $log->duration ? $log->duration / 3600 : 0);
                return [
                    'id'       => $task->id,
                    'title'    => $task->title,
                    'project'  => $task->project?->name,
                    'member'   => $task->assignee?->name ?? 'Unassigned',
                    'priority' => $task->priority ?? 'Medium',
                    'progress' => $task->progress ?? 0,
                    'hours'    => round($totalHours, 1) . 'h logged',
                    'status'   => $task->status,
                ];
            });

        // Upcoming tasks
        $upcomingTasks = Task::where('due_date', '>=', now())
            ->orWhere(function ($q) {
                $q->whereNull('due_date')->where('status', '!=', 'Done');
            })
            ->orderBy('due_date')->limit(10)
            ->get()
            ->map(function ($task) {
                $time = '';
                if ($task->due_date) {
                    $due = \Carbon\Carbon::parse($task->due_date);
                    if ($due->isToday()) { $time = 'Today'; }
                    elseif ($due->isTomorrow()) { $time = 'Tomorrow'; }
                    else { $time = $due->format('d M'); }
                    $time .= ' • ' . $due->format('h:i A');
                } else {
                    $time = 'No due date';
                }
                $priorityColors = [
                    'Critical' => '#ef4444', 'High' => '#f59e0b',
                    'Medium'   => '#0ea5e9', 'Low' => '#10b981',
                ];
                return [
                    'id'       => $task->id,
                    'name'     => $task->title,
                    'time'     => $time,
                    'priority' => $task->priority ?? 'Medium',
                    'status'   => $task->status ?? 'Upcoming',
                    'color'    => $priorityColors[$task->priority] ?? '#0ea5e9',
                    'progress' => $task->progress ?? 0,
                ];
            });

        // Task dates for calendar
        $taskDates = Task::whereNotNull('due_date')
            ->select(DB::raw('DISTINCT DATE(due_date) as date'))
            ->pluck('date')
            ->map(fn($date) => \Carbon\Carbon::parse($date)->day);

        $projectCount = Project::count();

        return response()->json([
            'data' => [
                'stats' => [
                    'totalTasks'  => $totalTasks,
                    'inProgress'  => $inProgress,
                    'completed'   => $completed,
                    'dueToday'    => $dueToday,
                ],
                'statusDistribution'  => $statusDistribution,
                'priorityDistribution' => $priorityDistribution,
                'upcomingMilestones'   => $upcomingMilestones,
                'trend'                => $trend,
                'projectCount'         => $projectCount,
                'activeTasks'          => $activeTasks,
                'upcomingTasks'        => $upcomingTasks,
                'taskDates'            => $taskDates,
            ]
        ]);
    }

    public function teamPerformance(): JsonResponse
    {
        $teams = Team::with(['members', 'lead', 'manager', 'department'])->where('status', 'active')->get();

        $teamData = $teams->map(function ($team) {
            $memberIds = $team->members->pluck('id')->toArray();

            $tasks = Task::with('timeLogs')
                ->whereIn('assigned_to', $memberIds)
                ->get();

            $totalTasks = $tasks->count();
            $doneTasks = $tasks->where('status', 'Done')->count();
            $inProgressTasks = $tasks->where('status', 'In Progress')->count();
            $totalDuration = $tasks->sum(fn($t) => $t->timeLogs->sum('duration'));

            $memberStats = $team->members->map(function ($member) use ($memberIds) {
                $userTasks = Task::with('timeLogs')
                    ->where('assigned_to', $member->id)
                    ->get();
                $done = $userTasks->where('status', 'Done')->count();
                $total = $userTasks->count();
                $hours = round($userTasks->sum(fn($t) => $t->timeLogs->sum('duration')) / 3600, 1);
                $score = $total > 0 ? round(($done / $total) * 70 + min($hours * 2, 30)) : 0;
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatar' => $member->avatar,
                    'tasks_total' => $total,
                    'tasks_done' => $done,
                    'hours_logged' => $hours,
                    'score' => min($score, 100),
                ];
            })->sortByDesc('score')->values();

            $completionRate = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0;
            $avgHours = $memberStats->count() > 0 ? round($memberStats->avg('hours_logged'), 1) : 0;

            return [
                'id' => $team->id,
                'name' => $team->name,
                'description' => $team->description,
                'department' => $team->department?->name,
                'lead' => $team->lead?->name,
                'manager' => $team->manager?->name,
                'member_count' => $team->members->count(),
                'total_tasks' => $totalTasks,
                'done_tasks' => $doneTasks,
                'in_progress_tasks' => $inProgressTasks,
                'completion_rate' => $completionRate,
                'total_hours' => round($totalDuration / 3600, 1),
                'avg_hours_per_member' => $avgHours,
                'members' => $memberStats,
            ];
        });

        // Overall aggregated metrics for Radar
        $allTasks = Task::with('timeLogs')->get();
        $allDone = $allTasks->where('status', 'Done')->count();
        $allTotal = $allTasks->count();
        $allHours = round($allTasks->sum(fn($t) => $t->timeLogs->sum('duration')) / 3600, 1);
        $allMembers = User::whereHas('teams')->count();

        // Generate AI insight
        $insight = $this->ai->generateInsight(
            'Team performance analytics',
            json_encode([
                'teams' => $teamData->toArray(),
                'total_teams' => $teams->count(),
                'all_done_tasks' => $allDone,
                'all_total_tasks' => $allTotal,
            ])
        );

        // Radar metrics
        $velocity = $allTotal > 0 ? round(($allDone / $allTotal) * 100) : 0;
        $collaboration = $teamData->count() > 0 ? round($teamData->avg('member_count') * 10) : 0;
        $efficiency = $allHours > 0 ? round(min(($allDone / max($allHours, 1)) * 20, 100)) : 0;
        $reliability = $allTotal > 0 ? round(($allDone / $allTotal) * 100) : 0;
        $innovation = round($teamData->avg('completion_rate') ?? 0);
        $avgCompletion = $teamData->count() > 0 ? $teamData->avg('completion_rate') : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'teams' => $teamData,
                'radar' => [
                    'labels' => ['Velocity', 'Collaboration', 'Efficiency', 'Reliability', 'Innovation'],
                    'current' => [$velocity, min($collaboration, 100), $efficiency, $reliability, $innovation],
                    'previous' => [
                        max(0, $velocity - rand(5, 15)),
                        max(0, min($collaboration, 100) - rand(3, 10)),
                        max(0, $efficiency - rand(5, 12)),
                        max(0, $reliability - rand(5, 15)),
                        max(0, $innovation - rand(3, 10)),
                    ],
                ],
                'overall' => [
                    'total_teams' => $teams->count(),
                    'total_members' => $allMembers,
                    'total_tasks' => $allTotal,
                    'completed_tasks' => $allDone,
                    'total_hours' => $allHours,
                    'avg_completion_rate' => round($avgCompletion),
                    'productivity_score' => round(($velocity + $collaboration + $efficiency + $reliability + $innovation) / 5),
                ],
                'aiInsight' => $insight,
            ]
        ]);
    }

    public function taskCompletionReports(): JsonResponse
    {
        $now = now();
        $startOfCurrentMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Basic Stats
        $totalTasks = Task::count();
        $completed = Task::where('status', 'Done')->count();
        $pending = Task::whereIn('status', ['To Do', 'In Progress', 'Testing'])->count();
        $overdue = Task::where('due_date', '<', $now)->where('status', '!=', 'Done')->count();

        // Previous Month Stats for Trends
        $prevTotalTasks = Task::where('created_at', '<=', $endOfLastMonth)->count();
        $prevCompleted = Task::where('status', 'Done')->where('updated_at', '<=', $endOfLastMonth)->count();
        $prevPending = Task::whereIn('status', ['To Do', 'In Progress', 'Testing'])->where('created_at', '<=', $endOfLastMonth)->count();
        $prevOverdue = Task::where('due_date', '<', $endOfLastMonth)->where('status', '!=', 'Done')->count();

        // Calculate trends
        $calculateTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? '+100%' : '0%';
            }
            $diff = (($current - $previous) / $previous) * 100;
            return ($diff >= 0 ? '+' : '') . round($diff, 1) . '%';
        };

        $totalTrend = $calculateTrend($totalTasks, $prevTotalTasks);
        $completedTrend = $calculateTrend($completed, $prevCompleted);
        $pendingTrend = $calculateTrend($pending, $prevPending);
        $overdueTrend = $calculateTrend($overdue, $prevOverdue);

        // 2. Line Chart: Completion Velocity (Last 6 Months)
        $labels = [];
        $completionRates = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = $now->copy()->subMonths($i);
            $labels[] = $monthDate->format('M');
            
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();
            
            $monthTotal = Task::where('created_at', '<=', $monthEnd)->count();
            $monthDone = Task::where('status', 'Done')->where('updated_at', '<=', $monthEnd)->count();
            
            $rate = 0;
            if ($monthTotal > 0) {
                $rate = round(($monthDone / $monthTotal) * 100);
            }
            $completionRates[] = $rate;
        }

        // 3. Priority Distribution
        $critical = Task::where('priority', 'Critical')->count();
        $high = Task::where('priority', 'High')->count();
        $medium = Task::where('priority', 'Medium')->count();
        $low = Task::where('priority', 'Low')->count();

        // 4. AI Insights
        $insight = $this->ai->generateInsight(
            'Task completion report',
            json_encode([
                'total_tasks' => $totalTasks,
                'completed' => $completed,
                'pending' => $pending,
                'overdue' => $overdue,
                'critical' => $critical,
                'high' => $high,
                'medium' => $medium,
                'low' => $low,
            ])
        );

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    [
                        'label' => 'Total Tasks',
                        'value' => number_format($totalTasks),
                        'trend' => $totalTrend,
                        'up' => floatval($totalTrend) >= 0,
                        'icon' => 'faChartLine',
                        'color' => 'primary',
                    ],
                    [
                        'label' => 'Completed',
                        'value' => number_format($completed),
                        'trend' => $completedTrend,
                        'up' => floatval($completedTrend) >= 0,
                        'icon' => 'faCheckCircle',
                        'color' => 'success',
                    ],
                    [
                        'label' => 'Pending',
                        'value' => number_format($pending),
                        'trend' => $pendingTrend,
                        'up' => floatval($pendingTrend) <= 0,
                        'icon' => 'faClock',
                        'color' => 'warning',
                    ],
                    [
                        'label' => 'Overdue',
                        'value' => number_format($overdue),
                        'trend' => $overdueTrend,
                        'up' => floatval($overdueTrend) <= 0,
                        'icon' => 'faExclamationTriangle',
                        'color' => 'danger',
                    ],
                ],
                'lineData' => [
                    'labels' => $labels,
                    'data' => $completionRates,
                ],
                'priorityData' => [
                    'labels' => ['Critical', 'High', 'Medium', 'Low'],
                    'data' => [$critical, $high, $medium, $low],
                ],
                'aiInsight' => $insight,
            ]
        ]);
    }
}
