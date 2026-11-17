<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\LeaveQuota;
use App\Models\LeaveAccrualRule;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\ApprovalRequest;
use App\Models\ApprovalHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LeaveController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Leave::query();

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        $leaves = $query->with(['user', 'approval.approver'])->latest()->paginate($request->per_page ?? 50);
        return response()->json(['data' => $leaves]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'document' => 'nullable|file|max:5120',
        ]);

        $leave = DB::transaction(function () use ($request, $data) {
            $leaveData = [
                'type' => $data['type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'reason' => $data['reason'] ?? null,
                'status' => 'Pending',
            ];

            if ($request->hasFile('document')) {
                $leaveData['document_path'] = $request->file('document')->store('leave-documents', 'public');
            }

            $leave = $request->user()->leaves()->create($leaveData);

            $approval = ApprovalRequest::create([
                'requester_id' => $request->user()->id,
                'type' => 'leave_request',
                'approvable_id' => $leave->id,
                'approvable_type' => Leave::class,
                'reason' => $data['reason'] ?? "Leave request for {$data['type']}",
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'pending',
                'metadata' => [
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'leave_type' => $data['type'],
                ],
            ]);

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $request->user()->id,
                'action' => 'created',
                'note' => 'Leave request submitted for approval.',
            ]);

            return $leave;
        });

        return response()->json(['data' => $leave->load('approval')], 201);
    }

    public function updateStatus(Request $request, Leave $leave): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|string|in:Approved,Rejected,Pending',
            'admin_comment' => 'nullable|string',
        ]);

        $leave->update([
            'status' => $data['status'],
            'admin_comment' => $data['admin_comment'] ?? null,
        ]);

        return response()->json(['data' => $leave]);
    }

    public function destroy(Leave $leave): JsonResponse
    {
        if ($leave->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($leave->status !== 'Pending' && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Cannot delete non-pending leave requests.'], 422);
        }

        $leave->delete();
        return response()->json(['ok' => true]);
    }

    public function quotas(Request $request): JsonResponse
    {
        $query = LeaveQuota::with(['leaveType', 'user']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        return response()->json(['data' => $query->latest()->paginate($request->per_page ?? 50)]);
    }

    public function storeQuota(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'leave_type' => 'required|string|max:255',
            'allocated' => 'required|integer|min:0',
            'year' => 'required|integer|min:2000|max:2100',
            'notes' => 'nullable|string',
        ]);

        $quota = DB::transaction(function () use ($validated, $request) {
            return LeaveQuota::updateOrCreate(
                ['user_id' => $validated['user_id'], 'leave_type' => $validated['leave_type'], 'year' => $validated['year']],
                [
                    'allocated' => $validated['allocated'],
                    'notes' => $validated['notes'] ?? null,
                    'updated_by' => $request->user()->id,
                ]
            );
        });

        return response()->json(['data' => $quota], 201);
    }

    public function bulkAllocateQuota(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'leave_type' => 'required|string|max:255',
            'allocated' => 'required|integer|min:0',
            'year' => 'required|integer|min:2000|max:2100',
            'notes' => 'nullable|string',
        ]);

        $quotas = DB::transaction(function () use ($validated, $request) {
            $created = [];

            foreach ($validated['user_ids'] as $userId) {
                $created[] = LeaveQuota::updateOrCreate(
                    ['user_id' => $userId, 'leave_type' => $validated['leave_type'], 'year' => $validated['year']],
                    [
                        'allocated' => $validated['allocated'],
                        'notes' => $validated['notes'] ?? null,
                        'updated_by' => $request->user()->id,
                    ]
                );
            }

            return $created;
        });

        return response()->json(['data' => $quotas, 'meta' => ['total' => count($quotas)]], 201);
    }

    public function accrualRules(Request $request): JsonResponse
    {
        return response()->json(['data' => LeaveAccrualRule::with('leaveType')->latest()->get()]);
    }

    public function storeAccrualRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'leave_type' => 'required|string|max:255',
            'frequency' => 'required|string|in:monthly,quarterly,yearly',
            'accrual_rate' => 'required|numeric|min:0',
            'max_accrual' => 'nullable|integer|min:0',
            'effective_date' => 'required|date',
            'applicable_to' => 'nullable|array',
            'applicable_to.*' => 'exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $rule = LeaveAccrualRule::create($validated);
        return response()->json(['data' => $rule], 201);
    }

    public function runAccrual(Request $request): JsonResponse
    {
        $request->validate([
            'leave_type' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $rules = LeaveAccrualRule::when($request->leave_type, function ($q) use ($request) {
            $q->where('leave_type', $request->leave_type);
        })->get();

        if ($rules->isEmpty()) {
            return response()->json(['message' => 'No accrual rules found.'], 404);
        }

        $results = DB::transaction(function () use ($rules, $request) {
            $processed = [];

            foreach ($rules as $rule) {
                $userQuery = User::where('status', 'Active');

                if ($rule->applicable_to) {
                    $userQuery->whereIn('id', $rule->applicable_to);
                }

                if ($request->user_id) {
                    $userQuery->where('id', $request->user_id);
                }

                $users = $userQuery->get();

                foreach ($users as $user) {
                    $quota = LeaveQuota::firstOrCreate(
                        ['user_id' => $user->id, 'leave_type' => $rule->leave_type, 'year' => Carbon::now()->year],
                        ['allocated' => 0, 'updated_by' => $request->user()->id]
                    );

                    $accrualAmount = $rule->accrual_rate;

                    if ($rule->max_accrual && ($quota->allocated + $accrualAmount) > $rule->max_accrual) {
                        $accrualAmount = max(0, $rule->max_accrual - $quota->allocated);
                    }

                    if ($accrualAmount > 0) {
                        $quota->increment('allocated', $accrualAmount);
                    }

                    $processed[] = [
                        'user_id' => $user->id,
                        'leave_type' => $rule->leave_type,
                        'accrued' => $accrualAmount,
                        'total' => $quota->fresh()->allocated,
                    ];
                }
            }

            return $processed;
        });

        return response()->json(['data' => $results, 'meta' => ['processed' => count($results)]]);
    }

    public function balances(Request $request): JsonResponse
    {
        $userId = $request->has('user_id') && $request->user()->role === 'Admin'
            ? $request->user_id
            : $request->user()->id;

        $year = $request->year ?? Carbon::now()->year;

        $quotas = LeaveQuota::where('user_id', $userId)
            ->where('year', $year)
            ->get();

        $usedLeaves = Leave::where('user_id', $userId)
            ->whereYear('start_date', $year)
            ->where('status', 'Approved')
            ->get()
            ->groupBy('type')
            ->map(function ($leaves) {
                return $leaves->sum(function ($leave) {
                    return Carbon::parse($leave->start_date)->diffInDays(Carbon::parse($leave->end_date)) + 1;
                });
            });

        $balances = $quotas->map(function ($quota) use ($usedLeaves) {
            $used = $usedLeaves->get($quota->leave_type, 0);
            return [
                'leave_type' => $quota->leave_type,
                'year' => $quota->year,
                'allocated' => $quota->allocated,
                'used' => $used,
                'remaining' => max(0, $quota->allocated - $used),
            ];
        });

        return response()->json(['data' => $balances]);
    }

    public function calendar(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'user_id' => 'nullable|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $query = Leave::where('status', 'Approved')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_date', [$request->start_date, $request->end_date])
                  ->orWhereBetween('end_date', [$request->start_date, $request->end_date]);
            });

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->department_id) {
            $query->whereHas('user.profile', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        $leaves = $query->with('user')->get()->map(function ($leave) {
            return [
                'id' => $leave->id,
                'title' => $leave->type . ' - ' . $leave->user->name,
                'start' => $leave->start_date,
                'end' => Carbon::parse($leave->end_date)->addDay()->toDateString(),
                'type' => $leave->type,
                'user_name' => $leave->user->name,
                'user_id' => $leave->user_id,
                'className' => 'leave-' . strtolower(str_replace(' ', '-', $leave->type)),
            ];
        });

        return response()->json(['data' => $leaves]);
    }

    public function analytics(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $leaves = Leave::whereBetween('start_date', [$request->start_date, $request->end_date])->get();

        $totalRequests = $leaves->count();
        $approved = $leaves->where('status', 'Approved')->count();
        $rejected = $leaves->where('status', 'Rejected')->count();
        $pending = $leaves->where('status', 'Pending')->count();

        $byType = $leaves->groupBy('type')->map(function ($items, $type) {
            return [
                'type' => $type,
                'count' => $items->count(),
                'approved' => $items->where('status', 'Approved')->count(),
            ];
        })->values();

        $byDepartment = $leaves->groupBy('user.profile.department_id')->map(function ($items, $deptId) {
            $deptName = optional(optional($items->first()->user)->profile)->department_id;
            return [
                'department' => $deptName,
                'count' => $items->count(),
            ];
        })->values();

        return response()->json(['data' => [
            'period' => ['start' => $request->start_date, 'end' => $request->end_date],
            'summary' => [
                'total_requests' => $totalRequests,
                'approved' => $approved,
                'rejected' => $rejected,
                'pending' => $pending,
                'approval_rate' => $totalRequests > 0 ? round(($approved / $totalRequests) * 100, 2) : 0,
            ],
            'by_type' => $byType,
            'by_department' => $byDepartment,
        ]]);
    }

    public function types(Request $request): JsonResponse
    {
        return response()->json(['data' => LeaveType::when($request->has('active'), function ($q) use ($request) {
            $q->where('is_active', $request->boolean('active'));
        })->get()]);
    }
}
