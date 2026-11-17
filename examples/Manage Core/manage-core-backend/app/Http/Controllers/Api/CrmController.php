<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmCustomer;
use App\Models\CrmLead;
use App\Models\CrmContact;
use App\Models\CrmDeal;
use App\Models\CrmPipeline;
use App\Models\CrmPipelineStage;
use App\Models\CrmActivity;
use App\Models\CrmCampaign;
use App\Models\CrmNote;
use App\Models\CrmTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CrmController extends Controller
{
    private function genCode(string $prefix): string
    {
        $count = DB::connection('tenant')->table('crm_customers')->where('code', 'like', $prefix . '-%')->count() + 1;
        return $prefix . '-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
    }

    // ========================
    // Dashboard
    // ========================
    public function dashboard(): JsonResponse
    {
        $totalCustomers = CrmCustomer::count();
        $activeLeads = CrmLead::whereIn('status', ['new', 'contacted', 'qualified'])->count();
        $openDeals = CrmDeal::where('status', 'open')->count();
        $wonDealsMtd = CrmDeal::where('status', 'won')
            ->whereMonth('won_at', now()->month)
            ->whereYear('won_at', now()->year)
            ->count();
        $lostDealsMtd = CrmDeal::where('status', 'lost')
            ->whereMonth('lost_at', now()->month)
            ->whereYear('lost_at', now()->year)
            ->count();
        $pipelineValue = CrmDeal::where('status', 'open')->sum('amount');
        $wonValueMtd = CrmDeal::where('status', 'won')
            ->whereMonth('won_at', now()->month)
            ->whereYear('won_at', now()->year)
            ->sum('amount');
        $totalLeads = CrmLead::count();
        $convertedLeads = CrmLead::where('status', 'converted')->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;
        $activitiesToday = CrmActivity::whereDate('due_date', today())
            ->where('status', '!=', 'completed')
            ->count();
        $overdueActivities = CrmActivity::where('due_date', '<', today())
            ->where('status', '!=', 'completed')
            ->count();

        $leadsByStatus = CrmLead::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')->get()->toArray();
        $dealsByStage = CrmDeal::select('stage', DB::raw('count(*) as count, sum(amount) as total'))
            ->where('status', 'open')
            ->groupBy('stage')->get()->toArray();
        $customersByType = CrmCustomer::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')->get()->toArray();
        $customersByRating = CrmCustomer::select('rating', DB::raw('count(*) as count'))
            ->groupBy('rating')->get()->toArray();

        $recentActivities = CrmActivity::with(['customer:id,name', 'lead:id,name', 'deal:id,name'])
            ->orderBy('created_at', 'desc')->limit(10)->get();

        $topPerformers = CrmDeal::select('assigned_to', DB::raw('count(*) as won_count, sum(amount) as total_revenue'))
            ->where('status', 'won')
            ->whereNotNull('assigned_to')
            ->groupBy('assigned_to')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->with('assignedUser:id,name')
            ->get();

        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyTrend[] = [
                'month' => $month->format('M Y'),
                'leads' => CrmLead::whereMonth('created_at', $month->month)->whereYear('created_at', $month->year)->count(),
                'deals_won' => CrmDeal::where('status', 'won')->whereMonth('won_at', $month->month)->whereYear('won_at', $month->year)->count(),
                'revenue' => CrmDeal::where('status', 'won')->whereMonth('won_at', $month->month)->whereYear('won_at', $month->year)->sum('amount') ?: 0,
            ];
        }

        return response()->json([
            'data' => [
                'stats' => [
                    'total_customers' => $totalCustomers,
                    'active_leads' => $activeLeads,
                    'open_deals' => $openDeals,
                    'won_deals_mtd' => $wonDealsMtd,
                    'lost_deals_mtd' => $lostDealsMtd,
                    'pipeline_value' => (float) $pipelineValue,
                    'won_value_mtd' => (float) $wonValueMtd,
                    'conversion_rate' => $conversionRate,
                    'activities_today' => $activitiesToday,
                    'overdue_activities' => $overdueActivities,
                ],
                'leads_by_status' => $leadsByStatus,
                'deals_by_stage' => $dealsByStage,
                'customers_by_type' => $customersByType,
                'customers_by_rating' => $customersByRating,
                'recent_activities' => $recentActivities,
                'top_performers' => $topPerformers,
                'monthly_trend' => $monthlyTrend,
            ]
        ]);
    }

    // ========================
    // Customers
    // ========================
    public function indexCustomers(Request $request): JsonResponse
    {
        $query = CrmCustomer::with(['assignedUser:id,name']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }
        foreach (['status', 'type', 'rating', 'assigned_to', 'industry', 'size'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $sort = $request->input('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $sortField = ltrim($sort, '-');
        $query->orderBy($sortField, $direction);
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(),
            'total' => $items->total(),
        ]]);
    }

    public function showCustomer($id): JsonResponse
    {
        $customer = CrmCustomer::with(['assignedUser:id,name', 'creator:id,name', 'contacts', 'leads', 'deals'])
            ->findOrFail($id);
        $stats = [
            'contacts_count' => $customer->contacts->count(),
            'leads_count' => $customer->leads->count(),
            'deals_count' => $customer->deals->count(),
            'won_deals_count' => $customer->deals->where('status', 'won')->count(),
            'total_revenue' => $customer->deals->where('status', 'won')->sum('amount'),
        ];
        $activities = CrmActivity::where('customer_id', $id)
            ->orderBy('created_at', 'desc')->limit(20)->get();
        return response()->json(['data' => $customer, 'stats' => $stats, 'activities' => $activities]);
    }

    public function storeCustomer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:100',
            'size' => 'nullable|in:small,medium,enterprise',
            'type' => 'nullable|in:prospect,active,inactive,churned',
            'status' => 'nullable|in:active,inactive',
            'rating' => 'nullable|integer|min:1|max:5',
            'annual_revenue' => 'nullable|numeric|min:0',
            'employee_count' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'source' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
        ]);
        $validated['code'] = $this->genCode('CUS');
        $validated['created_by'] = auth()->id();
        $validated['tags'] = $validated['tags'] ?? [];
        $customer = CrmCustomer::create($validated);
        return response()->json(['data' => $customer], 201);
    }

    public function updateCustomer(Request $request, $id): JsonResponse
    {
        $customer = CrmCustomer::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:100',
            'size' => 'nullable|in:small,medium,enterprise',
            'type' => 'nullable|in:prospect,active,inactive,churned',
            'status' => 'nullable|in:active,inactive',
            'rating' => 'nullable|integer|min:1|max:5',
            'annual_revenue' => 'nullable|numeric|min:0',
            'employee_count' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'source' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
        ]);
        $customer->update($validated);
        return response()->json(['data' => $customer->fresh()]);
    }

    public function destroyCustomer($id): JsonResponse
    {
        $customer = CrmCustomer::findOrFail($id);
        $customer->delete();
        return response()->json(['message' => 'Customer deleted']);
    }

    // ========================
    // Leads
    // ========================
    public function indexLeads(Request $request): JsonResponse
    {
        $query = CrmLead::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }
        foreach (['status', 'rating', 'source', 'assigned_to', 'campaign_id', 'customer_id', 'industry'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $sort = $request->input('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function showLead($id): JsonResponse
    {
        $lead = CrmLead::with([
            'assignedUser:id,name',
            'customer:id,name,company',
            'campaign:id,name',
            'creator:id,name',
            'activities.assignedUser:id,name',
            'notes.creator:id,name',
        ])->findOrFail($id);
        return response()->json(['data' => $lead]);
    }

    public function storeLead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|in:new,contacted,qualified,unqualified,lost,converted',
            'rating' => 'nullable|in:hot,warm,cold',
            'score' => 'nullable|integer|min:0|max:100',
            'industry' => 'nullable|string|max:100',
            'estimated_value' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'expected_close_date' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'campaign_id' => 'nullable|integer|exists:crm_campaigns,id',
            'tags' => 'nullable|array',
        ]);
        $count = CrmLead::count() + 1;
        $validated['code'] = 'LEAD-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
        $validated['created_by'] = auth()->id();
        $validated['tags'] = $validated['tags'] ?? [];
        $lead = CrmLead::create($validated);
        return response()->json(['data' => $lead], 201);
    }

    public function updateLead(Request $request, $id): JsonResponse
    {
        $lead = CrmLead::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|in:new,contacted,qualified,unqualified,lost,converted',
            'rating' => 'nullable|in:hot,warm,cold',
            'score' => 'nullable|integer|min:0|max:100',
            'industry' => 'nullable|string|max:100',
            'estimated_value' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'expected_close_date' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'campaign_id' => 'nullable|integer|exists:crm_campaigns,id',
            'lost_reason' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);
        $lead->update($validated);
        return response()->json(['data' => $lead->fresh()]);
    }

    public function destroyLead($id): JsonResponse
    {
        $lead = CrmLead::findOrFail($id);
        $lead->delete();
        return response()->json(['message' => 'Lead deleted']);
    }

    public function convertLead(Request $request, $id): JsonResponse
    {
        $lead = CrmLead::findOrFail($id);
        if ($lead->status === 'converted') {
            return response()->json(['message' => 'Lead already converted'], 400);
        }

        $validated = $request->validate([
            'create_company' => 'nullable|boolean',
            'create_contact' => 'nullable|boolean',
            'create_deal' => 'nullable|boolean',
            'company_id' => 'nullable|integer|exists:crm_customers,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'deal_name' => 'nullable|string|max:255',
            'deal_amount' => 'nullable|numeric|min:0',
            'deal_stage' => 'nullable|string|max:100',
            'deal_pipeline_id' => 'nullable|integer|exists:crm_pipelines,id',
            'deal_expected_close_date' => 'nullable|date',
        ]);

        $result = DB::connection('tenant')->transaction(function () use ($lead, $validated) {
            $customerId = null;
            $contactId = null;
            $dealId = null;

            if (!empty($validated['company_id'])) {
                $customerId = (int) $validated['company_id'];
            } elseif ($validated['create_company'] !== false) {
                $existing = null;
                if (!empty($lead->email)) {
                    $existing = CrmCustomer::where('email', $lead->email)->first();
                }
                if (!$existing && !empty($lead->company)) {
                    $existing = CrmCustomer::where('company', $lead->company)->first();
                }
                if ($existing) {
                    $customerId = $existing->id;
                } else {
                    $customer = CrmCustomer::create([
                        'name' => $lead->name,
                        'company' => $lead->company,
                        'email' => $lead->email,
                        'phone' => $lead->phone,
                        'industry' => $lead->industry,
                        'address' => $lead->address,
                        'city' => $lead->city,
                        'state' => $lead->state,
                        'country' => $lead->country,
                        'postal_code' => $lead->postal_code,
                        'source' => $lead->source,
                        'type' => 'active',
                        'status' => 'active',
                        'assigned_to' => $lead->assigned_to,
                        'created_by' => auth()->id(),
                        'code' => $this->genCode('CUS'),
                        'tags' => $lead->tags ?? [],
                    ]);
                    $customerId = $customer->id;
                }
            }

            if (!empty($validated['contact_id'])) {
                $contactId = (int) $validated['contact_id'];
            } elseif ($validated['create_contact'] !== false) {
                $existing = null;
                if (!empty($lead->email)) {
                    $existing = CrmContact::where('email', $lead->email)->first();
                }
                if ($existing) {
                    $contactId = $existing->id;
                } else {
                    $contact = CrmContact::create([
                        'name' => $lead->name,
                        'first_name' => $this->firstName($lead->name),
                        'last_name' => $this->lastName($lead->name),
                        'email' => $lead->email,
                        'phone' => $lead->phone,
                        'title' => $lead->title,
                        'customer_id' => $customerId,
                        'status' => 'active',
                        'assigned_to' => $lead->assigned_to,
                        'created_by' => auth()->id(),
                        'source' => $lead->source,
                        'tags' => $lead->tags ?? [],
                    ]);
                    $contactId = $contact->id;
                }
            }

            if (($validated['create_deal'] ?? true) === true && $customerId) {
                $pipelineId = $validated['deal_pipeline_id'] ?? null;
                $stage = $validated['deal_stage'] ?? null;

                if (!$pipelineId) {
                    $defaultPipeline = CrmPipeline::where('is_default', true)->first()
                        ?: CrmPipeline::where('is_active', true)->first()
                        ?: CrmPipeline::first();
                    $pipelineId = $defaultPipeline?->id;
                }

                if ($pipelineId && !$stage) {
                    $firstStage = CrmPipelineStage::where('pipeline_id', $pipelineId)
                        ->orderBy('sort_order')
                        ->first();
                    $stage = $firstStage?->name;
                }

                $deal = CrmDeal::create([
                    'name' => $validated['deal_name'] ?? ($lead->company ?: $lead->name) . ' - Opportunity',
                    'customer_id' => $customerId,
                    'contact_id' => $contactId,
                    'lead_id' => $lead->id,
                    'pipeline_id' => $pipelineId,
                    'stage' => $stage,
                    'amount' => $validated['deal_amount'] ?? $lead->estimated_value ?? 0,
                    'currency' => $lead->currency ?? 'USD',
                    'expected_close_date' => $validated['deal_expected_close_date'] ?? $lead->expected_close_date,
                    'status' => 'open',
                    'source' => $lead->source,
                    'assigned_to' => $lead->assigned_to,
                    'created_by' => auth()->id(),
                ]);
                $dealId = $deal->id;
            }

            $lead->update([
                'status' => 'converted',
                'converted_at' => now(),
                'customer_id' => $customerId ?? $lead->customer_id,
            ]);

            CrmActivity::create([
                'type' => 'task',
                'subject' => 'Lead converted',
                'description' => sprintf(
                    'Lead "%s" converted%s%s%s',
                    $lead->name,
                    $customerId ? ' to customer' : '',
                    $contactId ? ' + contact' : '',
                    $dealId ? ' + deal' : ''
                ),
                'lead_id' => $lead->id,
                'customer_id' => $customerId,
                'contact_id' => $contactId,
                'deal_id' => $dealId,
                'status' => 'completed',
                'completed_at' => now(),
                'created_by' => auth()->id(),
            ]);

            return [
                'lead_id' => $lead->id,
                'customer_id' => $customerId,
                'contact_id' => $contactId,
                'deal_id' => $dealId,
            ];
        });

        return response()->json([
            'data' => $lead->fresh(),
            'conversion' => $result,
            'message' => 'Lead converted successfully',
        ]);
    }

    private function firstName(string $full): string
    {
        $parts = preg_split('/\s+/', trim($full)) ?: [];
        return $parts[0] ?? '';
    }

    private function lastName(string $full): string
    {
        $parts = preg_split('/\s+/', trim($full)) ?: [];
        if (count($parts) <= 1) return '';
        array_shift($parts);
        return implode(' ', $parts);
    }

    public function importLeads(Request $request): JsonResponse
    {
        $request->validate([
            'leads' => 'required|array|min:1',
            'leads.*' => 'required|array',
        ]);

        $standardFields = [
            'name', 'company', 'email', 'phone', 'title', 'source', 'status',
            'rating', 'score', 'industry', 'estimated_value', 'currency',
            'expected_close_date', 'address', 'city', 'state', 'country',
            'postal_code', 'notes', 'assigned_to', 'customer_id', 'campaign_id',
            'tags',
        ];

        $validStatuses = ['new', 'contacted', 'qualified', 'unqualified', 'lost', 'converted'];
        $validRatings = ['hot', 'warm', 'cold'];
        $validSources = ['website', 'referral', 'social', 'email', 'cold_call', 'event', 'partner', 'advertisement', 'import', 'other'];

        $imported = 0;
        $errors = [];
        $maxCode = CrmLead::selectRaw("MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)) as max_num")->value('max_num') ?? 0;
        $count = (int) $maxCode;

        DB::connection('tenant')->beginTransaction();
        try {
            foreach ($request->input('leads') as $idx => $row) {
                $count++;
                $code = 'LEAD-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);

                $data = ['code' => $code, 'created_by' => auth()->id(), 'tags' => []];
                $customFields = [];

                foreach ($row as $key => $value) {
                    $lowerKey = strtolower(str_replace(' ', '_', trim($key)));
                    if (in_array($lowerKey, $standardFields)) {
                        $data[$lowerKey] = $value ?: null;
                    } else {
                        $customFields[$lowerKey] = $value;
                    }
                }

                if (empty($data['name']) && empty($data['email']) && empty($data['company'])) {
                    $errors[] = ['row' => $idx + 1, 'error' => 'Missing name, email, or company'];
                    continue;
                }

                if (empty($data['name'])) {
                    $data['name'] = $data['email'] ?? $data['company'] ?? 'Imported Lead';
                }

                $data['custom_fields'] = $customFields;

                $rawStatus = strtolower(str_replace(' ', '_', trim($data['status'] ?? '')));
                $data['status'] = in_array($rawStatus, $validStatuses) ? $rawStatus : 'new';

                $rawRating = strtolower(trim($data['rating'] ?? ''));
                $data['rating'] = in_array($rawRating, $validRatings) ? $rawRating : null;

                $rawSource = strtolower(str_replace(' ', '_', trim($data['source'] ?? '')));
                $data['source'] = in_array($rawSource, $validSources) ? $rawSource : 'import';

                if (isset($data['score']) && $data['score'] !== null) {
                    $score = (int) $data['score'];
                    $data['score'] = max(0, min(100, $score));
                }

                if (isset($data['assigned_to'])) unset($data['assigned_to']);
                if (isset($data['customer_id'])) unset($data['customer_id']);
                if (isset($data['campaign_id'])) unset($data['campaign_id']);

                CrmLead::create($data);
                $imported++;
            }
            DB::connection('tenant')->commit();
        } catch (\Exception $e) {
            DB::connection('tenant')->rollBack();
            return response()->json(['message' => 'Import failed: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'message' => "Imported {$imported} leads" . ($errors ? ", " . count($errors) . " skipped" : ''),
            'imported' => $imported,
            'errors' => $errors,
        ]);
    }

    // ========================
    // Contacts
    // ========================
    public function indexContacts(Request $request): JsonResponse
    {
        $query = CrmContact::with(['customer:id,name,company']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        foreach (['customer_id', 'status', 'is_primary'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $query->orderBy($request->input('sort', '-created_at'), 'desc');
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function storeContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_id' => 'required|integer|exists:crm_customers,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:100',
            'is_primary' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive',
            'notes' => 'nullable|string',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'birthday' => 'nullable|date',
            'anniversary' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);
        $validated['created_by'] = auth()->id();
        $validated['tags'] = $validated['tags'] ?? [];
        $contact = CrmContact::create($validated);
        return response()->json(['data' => $contact], 201);
    }

    public function updateContact(Request $request, $id): JsonResponse
    {
        $contact = CrmContact::findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:100',
            'is_primary' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive',
            'notes' => 'nullable|string',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'birthday' => 'nullable|date',
            'anniversary' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);
        $contact->update($validated);
        return response()->json(['data' => $contact->fresh()]);
    }

    public function destroyContact($id): JsonResponse
    {
        $contact = CrmContact::findOrFail($id);
        $contact->delete();
        return response()->json(['message' => 'Contact deleted']);
    }

    // ========================
    // Pipelines
    // ========================
    public function pipelines(): JsonResponse
    {
        $pipelines = CrmPipeline::with(['stages' => function ($q) { $q->orderBy('sort_order'); }])
            ->orderBy('sort_order')->get();
        return response()->json(['data' => $pipelines]);
    }

    public function storePipeline(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_default' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'stages' => 'nullable|array',
            'stages.*.name' => 'required|string|max:100',
            'stages.*.sort_order' => 'nullable|integer',
            'stages.*.probability' => 'nullable|integer|min:0|max:100',
            'stages.*.color' => 'nullable|string|max:20',
            'stages.*.is_won' => 'nullable|boolean',
            'stages.*.is_lost' => 'nullable|boolean',
        ]);
        $validated['created_by'] = auth()->id();
        $maxSort = CrmPipeline::max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSort + 1;
        $pipeline = DB::connection('tenant')->transaction(function () use ($validated) {
            $pipeline = CrmPipeline::create($validated);
            if (!empty($validated['stages'])) {
                foreach ($validated['stages'] as $i => $stage) {
                    CrmPipelineStage::create([
                        'pipeline_id' => $pipeline->id,
                        'name' => $stage['name'],
                        'sort_order' => $stage['sort_order'] ?? $i,
                        'probability' => $stage['probability'] ?? 50,
                        'color' => $stage['color'] ?? '#6366f1',
                        'is_won' => $stage['is_won'] ?? false,
                        'is_lost' => $stage['is_lost'] ?? false,
                    ]);
                }
            }
            return $pipeline;
        });
        return response()->json(['data' => $pipeline->load('stages')], 201);
    }

    public function updatePipeline(Request $request, $id): JsonResponse
    {
        $pipeline = CrmPipeline::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_default' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);
        $pipeline->update($validated);
        return response()->json(['data' => $pipeline->fresh('stages')]);
    }

    // ========================
    // Deals
    // ========================
    public function indexDeals(Request $request): JsonResponse
    {
        $query = CrmDeal::with(['customer:id,name,company', 'lead:id,name', 'contact:id,first_name,last_name', 'assignedUser:id,name', 'pipeline:id,name']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['stage', 'status', 'priority', 'customer_id', 'lead_id', 'contact_id', 'assigned_to', 'pipeline_id', 'source'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $sort = $request->input('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function showDeal($id): JsonResponse
    {
        $deal = CrmDeal::with([
            'customer:id,name,company',
            'lead:id,name,company',
            'contact:id,first_name,last_name,name',
            'pipeline.stages',
            'assignedUser:id,name',
            'creator:id,name',
            'activities.assignedUser:id,name',
        ])->findOrFail($id);
        return response()->json(['data' => $deal]);
    }

    public function storeDeal(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'customer_id' => 'required|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'pipeline_id' => 'nullable|integer|exists:crm_pipelines,id',
            'stage' => 'nullable|in:lead,qualified,proposal,negotiation,won,lost',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'source' => 'nullable|string|max:100',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'description' => 'nullable|string',
            'next_step' => 'nullable|string',
        ]);
        $count = CrmDeal::count() + 1;
        $validated['code'] = 'DEAL-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
        $validated['created_by'] = auth()->id();
        $deal = CrmDeal::create($validated);
        return response()->json(['data' => $deal], 201);
    }

    public function updateDeal(Request $request, $id): JsonResponse
    {
        $deal = CrmDeal::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'customer_id' => 'sometimes|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'pipeline_id' => 'nullable|integer|exists:crm_pipelines,id',
            'stage' => 'nullable|in:lead,qualified,proposal,negotiation,won,lost',
            'amount' => 'sometimes|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'source' => 'nullable|string|max:100',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'description' => 'nullable|string',
            'next_step' => 'nullable|string',
        ]);
        $deal->update($validated);
        return response()->json(['data' => $deal->fresh()]);
    }

    public function destroyDeal($id): JsonResponse
    {
        $deal = CrmDeal::findOrFail($id);
        $deal->delete();
        return response()->json(['message' => 'Deal deleted']);
    }

    public function moveStage(Request $request, $id): JsonResponse
    {
        $deal = CrmDeal::findOrFail($id);
        $validated = $request->validate([
            'stage' => 'required|in:lead,qualified,proposal,negotiation,won,lost',
            'probability' => 'nullable|integer|min:0|max:100',
        ]);
        $deal->update($validated);
        return response()->json(['data' => $deal->fresh()]);
    }

    public function markWon(Request $request, $id): JsonResponse
    {
        $deal = CrmDeal::findOrFail($id);
        $validated = $request->validate([
            'actual_close_date' => 'nullable|date',
        ]);
        $deal->update([
            'status' => 'won',
            'stage' => 'won',
            'won_at' => now(),
            'actual_close_date' => $validated['actual_close_date'] ?? now()->toDateString(),
            'probability' => 100,
        ]);
        return response()->json(['data' => $deal->fresh()]);
    }

    public function markLost(Request $request, $id): JsonResponse
    {
        $deal = CrmDeal::findOrFail($id);
        $validated = $request->validate([
            'lost_reason' => 'required|string|max:500',
        ]);
        $deal->update([
            'status' => 'lost',
            'stage' => 'lost',
            'lost_at' => now(),
            'lost_reason' => $validated['lost_reason'],
            'probability' => 0,
        ]);
        return response()->json(['data' => $deal->fresh()]);
    }

    // ========================
    // Activities
    // ========================
    public function indexActivities(Request $request): JsonResponse
    {
        $query = CrmActivity::with(['customer:id,name', 'lead:id,name', 'deal:id,name', 'contact:id,first_name,last_name', 'assignedUser:id,name']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['type', 'status', 'priority', 'assigned_to', 'customer_id', 'lead_id', 'deal_id', 'contact_id', 'created_by'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        if ($request->filled('due_from')) $query->whereDate('due_date', '>=', $request->input('due_from'));
        if ($request->filled('due_to')) $query->whereDate('due_date', '<=', $request->input('due_to'));
        $sort = $request->input('sort', 'due_date');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function storeActivity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:call,email,meeting,task,sms,note,whatsapp,demo,follow_up',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:planned,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:0',
            'outcome' => 'nullable|string|max:255',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'deal_id' => 'nullable|integer|exists:crm_deals,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'location' => 'nullable|string|max:255',
        ]);
        $validated['created_by'] = auth()->id();
        $activity = CrmActivity::create($validated);
        return response()->json(['data' => $activity], 201);
    }

    public function updateActivity(Request $request, $id): JsonResponse
    {
        $activity = CrmActivity::findOrFail($id);
        $validated = $request->validate([
            'type' => 'sometimes|in:call,email,meeting,task,sms,note,whatsapp,demo,follow_up',
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:planned,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:0',
            'outcome' => 'nullable|string|max:255',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'deal_id' => 'nullable|integer|exists:crm_deals,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'location' => 'nullable|string|max:255',
        ]);
        $activity->update($validated);
        return response()->json(['data' => $activity->fresh()]);
    }

    public function completeActivity($id): JsonResponse
    {
        $activity = CrmActivity::findOrFail($id);
        $activity->update(['status' => 'completed', 'completed_at' => now()]);
        return response()->json(['data' => $activity->fresh()]);
    }

    public function destroyActivity($id): JsonResponse
    {
        $activity = CrmActivity::findOrFail($id);
        $activity->delete();
        return response()->json(['message' => 'Activity deleted']);
    }

    // ========================
    // Campaigns
    // ========================
    public function indexCampaigns(Request $request): JsonResponse
    {
        $query = CrmCampaign::with(['assignedUser:id,name']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['type', 'status', 'assigned_to'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $query->orderBy($request->input('sort', '-created_at'), 'desc');
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function storeCampaign(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:email,sms,social,ads,event,webinar,direct_mail',
            'status' => 'nullable|in:draft,scheduled,running,completed,paused,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'expected_revenue' => 'nullable|numeric|min:0',
            'actual_revenue' => 'nullable|numeric|min:0',
            'target_audience' => 'nullable|string',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);
        $validated['created_by'] = auth()->id();
        $campaign = CrmCampaign::create($validated);
        return response()->json(['data' => $campaign], 201);
    }

    public function updateCampaign(Request $request, $id): JsonResponse
    {
        $campaign = CrmCampaign::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:email,sms,social,ads,event,webinar,direct_mail',
            'status' => 'nullable|in:draft,scheduled,running,completed,paused,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'expected_revenue' => 'nullable|numeric|min:0',
            'actual_revenue' => 'nullable|numeric|min:0',
            'target_audience' => 'nullable|string',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);
        $campaign->update($validated);
        return response()->json(['data' => $campaign->fresh()]);
    }

    public function destroyCampaign($id): JsonResponse
    {
        $campaign = CrmCampaign::findOrFail($id);
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted']);
    }

    // ========================
    // Notes
    // ========================
    public function indexNotes(Request $request): JsonResponse
    {
        $query = CrmNote::with(['creator:id,name', 'customer:id,name', 'lead:id,name', 'deal:id,name']);
        foreach (['customer_id', 'lead_id', 'deal_id', 'contact_id', 'activity_id', 'is_pinned', 'created_by'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $query->orderBy('is_pinned', 'desc')->orderBy('created_at', 'desc');
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function storeNote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'body' => 'nullable|string',
            'description' => 'nullable|string',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'deal_id' => 'nullable|integer|exists:crm_deals,id',
            'contact_id' => 'nullable|integer|exists:crm_contacts,id',
            'activity_id' => 'nullable|integer|exists:crm_activities,id',
            'is_pinned' => 'nullable|boolean',
        ]);
        $content = $validated['content'] ?? ($validated['body'] ?? $validated['description'] ?? null);
        if (!$content) {
            return response()->json(['message' => 'Note content is required'], 422);
        }
        $validated['content'] = $content;
        $validated['created_by'] = auth()->id();
        $note = CrmNote::create($validated);
        return response()->json(['data' => $note], 201);
    }

    public function destroyNote($id): JsonResponse
    {
        $note = CrmNote::findOrFail($id);
        $note->delete();
        return response()->json(['message' => 'Note deleted']);
    }

    // ========================
    // Tasks
    // ========================
    public function indexTasks(Request $request): JsonResponse
    {
        $query = CrmTask::with(['assignedUser:id,name', 'creator:id:name', 'customer:id,name', 'lead:id,name', 'deal:id,name']);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['status', 'priority', 'assigned_to', 'customer_id', 'lead_id', 'deal_id', 'created_by'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $sort = $request->input('sort', '-due_date');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);
        $perPage = (int) $request->input('per_page', 25);
        $items = $query->paginate($perPage);
        return response()->json(['data' => $items->items(), 'meta' => [
            'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(), 'total' => $items->total(),
        ]]);
    }

    public function storeTask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,done,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'customer_id' => 'nullable|integer|exists:crm_customers,id',
            'lead_id' => 'nullable|integer|exists:crm_leads,id',
            'deal_id' => 'nullable|integer|exists:crm_deals,id',
            'reminder_at' => 'nullable|date',
        ]);
        $validated['created_by'] = auth()->id();
        $task = CrmTask::create($validated);
        return response()->json(['data' => $task], 201);
    }

    public function updateTask(Request $request, $id): JsonResponse
    {
        $task = CrmTask::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,done,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'reminder_at' => 'nullable|date',
        ]);
        $task->update($validated);
        return response()->json(['data' => $task->fresh()]);
    }

    public function completeTask($id): JsonResponse
    {
        $task = CrmTask::findOrFail($id);
        $task->update(['status' => 'done', 'completed_at' => now()]);
        return response()->json(['data' => $task->fresh()]);
    }

    public function destroyTask($id): JsonResponse
    {
        $task = CrmTask::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // ========================
    // Reports
    // ========================
    public function pipelineReport(Request $request): JsonResponse
    {
        $stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
        $report = [];
        foreach ($stages as $stage) {
            $deals = CrmDeal::where('stage', $stage);
            $report[] = [
                'stage' => $stage,
                'count' => $deals->count(),
                'total_amount' => (float) $deals->sum('amount'),
                'weighted_amount' => (float) $deals->get()->sum(function ($d) { return $d->amount * ($d->probability / 100); }),
            ];
        }
        return response()->json(['data' => $report]);
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
        $previous = 0;
        foreach ($stages as $i => $s) {
            $count = CrmLead::where('status', $s['key'])->count();
            $report[] = [
                'stage' => $s['key'],
                'label' => $s['label'],
                'count' => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0,
                'conversion_rate' => $i > 0 && $previous > 0 ? round(($count / $previous) * 100, 1) : 100,
            ];
            if ($s['key'] !== 'lost' && $s['key'] !== 'unqualified') $previous = $previous + $count;
        }
        return response()->json(['data' => $report, 'total_leads' => $total]);
    }

    public function activityReport(Request $request): JsonResponse
    {
        $types = ['call', 'email', 'meeting', 'task', 'sms', 'note', 'whatsapp', 'demo', 'follow_up'];
        $report = [];
        foreach ($types as $type) {
            $all = CrmActivity::where('type', $type);
            $completed = (clone $all)->where('status', 'completed');
            $report[] = [
                'type' => $type,
                'total' => $all->count(),
                'completed' => $completed->count(),
                'completion_rate' => $all->count() > 0 ? round(($completed->count() / $all->count()) * 100, 1) : 0,
            ];
        }
        return response()->json(['data' => $report]);
    }

    public function topPerformers(Request $request): JsonResponse
    {
        $performers = CrmDeal::select('assigned_to',
                DB::raw('count(*) as total_deals'),
                DB::raw("sum(case when status = 'won' then 1 else 0 end) as won_deals"),
                DB::raw("sum(case when status = 'lost' then 1 else 0 end) as lost_deals"),
                DB::raw("sum(case when status = 'open' then 1 else 0 end) as open_deals"),
                DB::raw("sum(case when status = 'won' then amount else 0 end) as total_revenue"),
                DB::raw("avg(case when status = 'won' then amount end) as avg_deal_size"))
            ->whereNotNull('assigned_to')
            ->groupBy('assigned_to')
            ->orderBy('total_revenue', 'desc')
            ->with('assignedUser:id,name')
            ->limit(10)
            ->get();
        return response()->json(['data' => $performers]);
    }

    public function revenueBySource(Request $request): JsonResponse
    {
        $sources = CrmDeal::select('source',
                DB::raw('count(*) as deal_count'),
                DB::raw("sum(case when status = 'won' then amount else 0 end) as revenue"),
                DB::raw("sum(amount) as pipeline_value"))
            ->whereNotNull('source')
            ->groupBy('source')
            ->orderBy('revenue', 'desc')
            ->get();
        return response()->json(['data' => $sources]);
    }

    // Additional show/destroy methods
    public function showContact($id): JsonResponse
    {
        $contact = CrmContact::with(['customer:id,name,company', 'creator:id,name', 'deals:id,name,stage,amount,currency,code'])->findOrFail($id);
        return response()->json(['data' => $contact]);
    }

    public function showActivity($id): JsonResponse
    {
        $activity = CrmActivity::with(['customer:id,name', 'lead:id,name', 'deal:id,name', 'contact:id,first_name,last_name', 'assignedUser:id,name', 'creator:id,name'])->findOrFail($id);
        return response()->json(['data' => $activity]);
    }

    public function showCampaign($id): JsonResponse
    {
        $campaign = CrmCampaign::with(['assignedUser:id,name', 'creator:id,name'])->findOrFail($id);
        return response()->json(['data' => $campaign]);
    }

    public function showPipeline($id): JsonResponse
    {
        $pipeline = CrmPipeline::with(['stages' => fn($q) => $q->orderBy('sort_order')])->findOrFail($id);
        return response()->json(['data' => $pipeline]);
    }

    public function destroyPipeline($id): JsonResponse
    {
        $pipeline = CrmPipeline::findOrFail($id);
        $pipeline->delete();
        return response()->json(['message' => 'Pipeline deleted']);
    }

    public function updateNote(Request $request, $id): JsonResponse
    {
        $note = CrmNote::findOrFail($id);
        $validated = $request->validate([
            'content' => 'sometimes|string',
            'is_pinned' => 'nullable|boolean',
        ]);
        $note->update($validated);
        return response()->json(['data' => $note->fresh()]);
    }
}
