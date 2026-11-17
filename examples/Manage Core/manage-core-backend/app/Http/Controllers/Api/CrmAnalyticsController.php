<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmLead;
use App\Models\CrmCustomer;
use App\Models\CrmContact;
use App\Models\CrmDeal;
use App\Models\CrmActivity;
use App\Models\CrmTask;
use App\Models\CrmEmail;
use App\Models\CrmCampaign;
use App\Models\CrmFollowUp;
use App\Models\CrmSequence;
use App\Models\CrmPipeline;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmAnalyticsController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $today = now()->toDateString();
        $thisMonthStart = now()->startOfMonth();

        $stats = [
            'total_leads' => CrmLead::count(),
            'new_leads' => CrmLead::whereDate('created_at', $today)->count(),
            'qualified_leads' => CrmLead::where('status', 'qualified')->count(),
            'conversion_rate' => $this->safeRatio(CrmLead::where('status', 'converted')->count(), CrmLead::count()),
            'total_contacts' => CrmContact::count(),
            'total_companies' => CrmCustomer::count(),
            'open_deals' => CrmDeal::where('status', 'open')->count(),
            'won_deals' => CrmDeal::where('status', 'won')->count(),
            'lost_deals' => CrmDeal::where('status', 'lost')->count(),
            'pipeline_value' => (float) CrmDeal::where('status', 'open')->sum('amount'),
            'forecast_value' => (float) CrmDeal::where('status', 'open')->sum(DB::raw('amount * probability / 100')),
            'revenue' => (float) CrmDeal::where('status', 'won')->whereMonth('won_at', now()->month)->sum('amount'),
            'activities_today' => CrmActivity::whereDate('due_date', $today)->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'overdue_follow_ups' => CrmFollowUp::whereIn('status', ['pending', 'due'])->where('due_at', '<', now())->count(),
            'pending_tasks' => CrmTask::whereIn('status', ['todo', 'in_progress'])->count(),
            'emails_sent' => CrmEmail::where('direction', 'outbound')->count(),
            'emails_opened' => CrmEmail::whereNotNull('opened_at')->count(),
            'email_replies' => CrmEmail::whereNotNull('replied_at')->count(),
        ];

        $leadsBySource = CrmLead::select('source', DB::raw('count(*) as count'))
            ->whereNotNull('source')->groupBy('source')->get();
        $leadsByStatus = CrmLead::select('status', DB::raw('count(*) as count'))->groupBy('status')->get();
        $dealsByStage = CrmDeal::select('stage', DB::raw('count(*) as count, sum(amount) as total'))
            ->where('status', 'open')->groupBy('stage')->get();
        $revenueTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = now()->subMonths($i);
            $revenueTrend[] = [
                'month' => $m->format('M Y'),
                'revenue' => (float) CrmDeal::where('status', 'won')
                    ->whereMonth('won_at', $m->month)->whereYear('won_at', $m->year)->sum('amount'),
            ];
        }

        $topPerformers = CrmDeal::select('assigned_to',
                DB::raw('count(*) as deals'),
                DB::raw("sum(case when status='won' then amount else 0 end) as revenue"))
            ->whereNotNull('assigned_to')->where('status', 'won')
            ->groupBy('assigned_to')->orderBy('revenue', 'desc')->limit(5)
            ->with('assignedUser:id,name')->get();

        return response()->json(['success' => true, 'data' => [
            'stats' => $stats,
            'leads_by_source' => $leadsBySource,
            'leads_by_status' => $leadsByStatus,
            'deals_by_stage' => $dealsByStage,
            'revenue_trend' => $revenueTrend,
            'top_performers' => $topPerformers,
        ]]);
    }

    public function leadReport(Request $request): JsonResponse
    {
        $query = CrmLead::query();
        if ($request->filled('source')) $query->where('source', $request->input('source'));
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        if ($request->filled('from')) $query->whereDate('created_at', '>=', $request->input('from'));
        if ($request->filled('to')) $query->whereDate('created_at', '<=', $request->input('to'));

        return response()->json(['success' => true, 'data' => [
            'total' => $query->count(),
            'by_status' => (clone $query)->select('status', DB::raw('count(*) as count'))->groupBy('status')->get(),
            'by_source' => (clone $query)->select('source', DB::raw('count(*) as count'))->whereNotNull('source')->groupBy('source')->get(),
            'by_rating' => (clone $query)->select('rating', DB::raw('count(*) as count'))->whereNotNull('rating')->groupBy('rating')->get(),
            'by_month' => $this->groupByMonth($query, 'created_at'),
        ]]);
    }

    public function dealReport(Request $request): JsonResponse
    {
        $query = CrmDeal::query();
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        if ($request->filled('pipeline_id')) $query->where('pipeline_id', $request->input('pipeline_id'));
        if ($request->filled('assigned_to')) $query->where('assigned_to', $request->input('assigned_to'));

        $won = (clone $query)->where('status', 'won');
        $lost = (clone $query)->where('status', 'lost');
        $open = (clone $query)->where('status', 'open');

        return response()->json(['success' => true, 'data' => [
            'total' => $query->count(),
            'open_value' => (float) $open->sum('amount'),
            'won_value' => (float) $won->sum('amount'),
            'won_count' => $won->count(),
            'lost_count' => $lost->count(),
            'win_rate' => $this->safeRatio($won->count(), $won->count() + $lost->count()),
            'avg_deal_size' => (float) ($won->count() ? $won->sum('amount') / $won->count() : 0),
            'avg_sales_cycle' => $this->avgSalesCycle(),
            'by_stage' => $query->select('stage', DB::raw('count(*) as count, sum(amount) as total'))->groupBy('stage')->get(),
            'by_source' => (clone $query)->select('source', DB::raw('count(*) as count, sum(amount) as total'))->whereNotNull('source')->groupBy('source')->get(),
            'forecast_by_month' => $this->forecastByMonth(),
            'velocity' => $this->dealVelocity(),
        ]]);
    }

    public function activityReport(Request $request): JsonResponse
    {
        $query = CrmActivity::query();
        if ($request->filled('from')) $query->whereDate('due_date', '>=', $request->input('from'));
        if ($request->filled('to')) $query->whereDate('due_date', '<=', $request->input('to'));

        return response()->json(['success' => true, 'data' => [
            'by_type' => (clone $query)->select('type', DB::raw('count(*) as count'))->groupBy('type')->get(),
            'completion_by_type' => CrmActivity::select('type',
                    DB::raw('count(*) as total'),
                    DB::raw("sum(case when status='completed' then 1 else 0 end) as completed"))
                ->groupBy('type')->get(),
            'trend' => $this->groupByMonth($query, 'created_at'),
        ]]);
    }

    public function emailReport(Request $request): JsonResponse
    {
        $query = CrmEmail::query()->where('direction', 'outbound');
        if ($request->filled('from')) $query->whereDate('sent_at', '>=', $request->input('from'));
        if ($request->filled('to')) $query->whereDate('sent_at', '<=', $request->input('to'));
        $sent = $query->count();
        $opened = (clone $query)->whereNotNull('opened_at')->count();
        $clicked = (clone $query)->whereNotNull('clicked_at')->count();
        $replied = (clone $query)->whereNotNull('replied_at')->count();
        $bounced = (clone $query)->whereNotNull('bounced_at')->count();

        return response()->json(['success' => true, 'data' => [
            'sent' => $sent,
            'opened' => $opened,
            'clicked' => $clicked,
            'replied' => $replied,
            'bounced' => $bounced,
            'open_rate' => $this->safeRatio($opened, $sent),
            'click_rate' => $this->safeRatio($clicked, $sent),
            'reply_rate' => $this->safeRatio($replied, $sent),
            'bounce_rate' => $this->safeRatio($bounced, $sent),
            'trend' => $this->groupByMonth($query, 'sent_at'),
        ]]);
    }

    public function campaignReport(Request $request): JsonResponse
    {
        $items = CrmCampaign::query()
            ->when($request->filled('type'), fn($q) => $q->where('type', $request->input('type')))
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->input('status')))
            ->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function followUpReport(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'by_status' => CrmFollowUp::select('status', DB::raw('count(*) as count'))->groupBy('status')->get(),
            'by_type' => CrmFollowUp::select('type', DB::raw('count(*) as count'))->groupBy('type')->get(),
            'completion_rate' => $this->safeRatio(
                CrmFollowUp::where('status', 'completed')->count(),
                CrmFollowUp::count()
            ),
            'overdue' => CrmFollowUp::whereIn('status', ['pending', 'due'])->where('due_at', '<', now())->count(),
        ]]);
    }

    public function pipelineReport(Request $request): JsonResponse
    {
        $pipelines = CrmPipeline::with(['stages' => function ($q) { $q->orderBy('sort_order'); }])->get();
        $report = [];
        foreach ($pipelines as $p) {
            $stages = [];
            foreach ($p->stages as $s) {
                $deals = CrmDeal::where('pipeline_id', $p->id)->where('stage', $s->name);
                $stages[] = [
                    'stage' => $s->name,
                    'count' => $deals->count(),
                    'amount' => (float) $deals->sum('amount'),
                    'weighted' => (float) $deals->sum(DB::raw('amount * probability / 100')),
                ];
            }
            $report[] = ['pipeline' => $p->name, 'stages' => $stages];
        }
        return response()->json(['success' => true, 'data' => $report]);
    }

    public function performanceReport(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'reps' => CrmDeal::select('assigned_to',
                    DB::raw('count(*) as deals'),
                    DB::raw("sum(case when status='won' then 1 else 0 end) as won"),
                    DB::raw("sum(case when status='lost' then 1 else 0 end) as lost"),
                    DB::raw("sum(case when status='open' then 1 else 0 end) as open"),
                    DB::raw("sum(case when status='won' then amount else 0 end) as revenue"),
                    DB::raw("avg(case when status='won' then amount end) as avg_deal"))
                ->whereNotNull('assigned_to')->groupBy('assigned_to')->orderBy('revenue', 'desc')
                ->with('assignedUser:id,name')->limit(20)->get(),
        ]]);
    }

    public function conversionReport(Request $request): JsonResponse
    {
        $stages = [
            ['key' => 'new', 'label' => 'New'],
            ['key' => 'contacted', 'label' => 'Contacted'],
            ['key' => 'qualified', 'label' => 'Qualified'],
            ['key' => 'unqualified', 'label' => 'Unqualified'],
            ['key' => 'lost', 'label' => 'Lost'],
            ['key' => 'converted', 'label' => 'Converted'],
        ];
        $total = CrmLead::count();
        $report = [];
        foreach ($stages as $s) {
            $count = CrmLead::where('status', $s['key'])->count();
            $report[] = [
                'stage' => $s['key'],
                'label' => $s['label'],
                'count' => $count,
                'percentage' => $total ? round(($count / $total) * 100, 1) : 0,
            ];
        }
        return response()->json(['success' => true, 'data' => $report, 'total' => $total]);
    }

    public function sourceReport(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => CrmLead::select('source',
                DB::raw('count(*) as count'))
            ->whereNotNull('source')->groupBy('source')->get()]);
    }

    public function search(Request $request): JsonResponse
    {
        $term = $request->input('q', '');
        if (strlen($term) < 2) return response()->json(['success' => true, 'data' => []]);

        $results = [];
        $results['leads'] = CrmLead::where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%")
              ->orWhere('company', 'like', "%{$term}%")->orWhere('code', 'like', "%{$term}%");
        })->limit(10)->get(['id', 'name', 'email', 'company', 'code', 'status']);
        $results['contacts'] = CrmContact::where(function ($q) use ($term) {
            $q->where('first_name', 'like', "%{$term}%")->orWhere('last_name', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%")->orWhere('phone', 'like', "%{$term}%");
        })->limit(10)->get(['id', 'first_name', 'last_name', 'email', 'phone']);
        $results['customers'] = CrmCustomer::where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")->orWhere('company', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%");
        })->limit(10)->get(['id', 'name', 'company', 'email']);
        $results['deals'] = CrmDeal::where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")->orWhere('code', 'like', "%{$term}%");
        })->limit(10)->get(['id', 'name', 'code', 'amount', 'stage']);
        $results['emails'] = CrmEmail::where('subject', 'like', "%{$term}%")->limit(10)
            ->get(['id', 'subject', 'from_email', 'received_at', 'folder']);
        $results['tasks'] = CrmTask::where('title', 'like', "%{$term}%")->limit(10)->get(['id', 'title', 'status', 'due_date']);

        return response()->json(['success' => true, 'data' => $results]);
    }

    protected function safeRatio($a, $b): float
    {
        if (!$b) return 0;
        return round(($a / $b) * 100, 1);
    }

    protected function groupByMonth($query, $column): array
    {
        $rows = (clone $query)->select(
            DB::raw("DATE_FORMAT({$column}, '%Y-%m') as month"),
            DB::raw('count(*) as count')
        )->groupBy('month')->orderBy('month')->get();
        return $rows->toArray();
    }

    protected function forecastByMonth(): array
    {
        $rows = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = now()->subMonths($i);
            $rows[] = [
                'month' => $m->format('M Y'),
                'forecast' => (float) CrmDeal::where('status', 'open')
                    ->whereMonth('expected_close_date', $m->month)
                    ->whereYear('expected_close_date', $m->year)
                    ->sum(DB::raw('amount * probability / 100')),
            ];
        }
        return $rows;
    }

    protected function avgSalesCycle(): float
    {
        $deals = CrmDeal::whereNotNull('won_at')->get(['created_at', 'won_at']);
        if ($deals->isEmpty()) return 0;
        $totalDays = 0;
        foreach ($deals as $d) {
            $totalDays += $d->created_at->diffInDays($d->won_at);
        }
        return round($totalDays / $deals->count(), 1);
    }

    protected function dealVelocity(): array
    {
        $open = CrmDeal::where('status', 'open');
        return [
            'open_count' => $open->count(),
            'open_value' => (float) $open->sum('amount'),
            'avg_open_value' => (float) ($open->count() ? $open->sum('amount') / $open->count() : 0),
        ];
    }
}