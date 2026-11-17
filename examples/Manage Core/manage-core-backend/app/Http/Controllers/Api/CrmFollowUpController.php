<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmFollowUp;
use App\Services\Crm\CrmFollowUpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmFollowUpController extends Controller
{
    public function __construct(private CrmFollowUpService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = CrmFollowUp::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['type', 'status', 'priority', 'assigned_to', 'lead_id', 'contact_id', 'customer_id', 'deal_id', 'owner_id'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        if ($request->input('overdue') === 'true') {
            $query->whereIn('status', ['pending', 'due'])->where('due_at', '<', now());
        }
        if ($request->filled('due_from')) $query->whereDate('due_at', '>=', $request->input('due_from'));
        if ($request->filled('due_to')) $query->whereDate('due_at', '<=', $request->input('due_to'));

        $sort = $request->input('sort', 'due_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);

        $items = $query->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function show($id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        return response()->json(['success' => true, 'data' => $f]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:email,call,task,meeting,reminder',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'status' => 'nullable|in:pending,due,completed,snoozed,cancelled,failed',
            'due_at' => 'required|date',
            'reminder_at' => 'nullable|date',
            'lead_id' => 'nullable|integer',
            'contact_id' => 'nullable|integer',
            'customer_id' => 'nullable|integer',
            'deal_id' => 'nullable|integer',
            'assigned_to' => 'nullable|integer',
            'template_id' => 'nullable|integer',
            'sequence_id' => 'nullable|integer',
        ]);
        $f = $this->service->schedule($validated);
        return response()->json(['success' => true, 'data' => $f], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:email,call,task,meeting,reminder',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'status' => 'nullable|in:pending,due,completed,snoozed,cancelled,failed',
            'due_at' => 'sometimes|date',
            'reminder_at' => 'nullable|date',
            'assigned_to' => 'nullable|integer',
        ]);
        $f->update($validated);
        return response()->json(['success' => true, 'data' => $f->fresh()]);
    }

    public function complete(Request $request, $id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $f = $this->service->complete($f, $request->input('result'));
        return response()->json(['success' => true, 'data' => $f]);
    }

    public function snooze(Request $request, $id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $request->validate(['due_at' => 'required|date']);
        $f = $this->service->snooze($f, \Carbon\Carbon::parse($request->input('due_at')));
        return response()->json(['success' => true, 'data' => $f]);
    }

    public function reschedule(Request $request, $id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $request->validate(['due_at' => 'required|date']);
        $f->update(['due_at' => $request->input('due_at'), 'status' => 'pending']);
        return response()->json(['success' => true, 'data' => $f]);
    }

    public function cancel(Request $request, $id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $f = $this->service->cancel($f, $request->input('reason'));
        return response()->json(['success' => true, 'data' => $f]);
    }

    public function destroy($id): JsonResponse
    {
        $f = CrmFollowUp::findOrFail($id);
        $f->delete();
        return response()->json(['success' => true, 'message' => 'Follow-up deleted']);
    }

    public function stats(Request $request): JsonResponse
    {
        $userId = $request->input('user_id', auth()->id());
        $today = now()->toDateString();
        $stats = [
            'due_today' => CrmFollowUp::where('assigned_to', $userId)->whereDate('due_at', $today)->whereIn('status', ['pending', 'due'])->count(),
            'overdue' => CrmFollowUp::where('assigned_to', $userId)->whereIn('status', ['pending', 'due'])->where('due_at', '<', now())->count(),
            'upcoming' => CrmFollowUp::where('assigned_to', $userId)->whereIn('status', ['pending', 'due'])->where('due_at', '>', now())->where('due_at', '<=', now()->addDays(7))->count(),
            'completed' => CrmFollowUp::where('assigned_to', $userId)->where('status', 'completed')->where('completed_at', '>=', now()->subDays(30))->count(),
            'snoozed' => CrmFollowUp::where('assigned_to', $userId)->where('status', 'snoozed')->count(),
            'failed' => CrmFollowUp::where('assigned_to', $userId)->where('status', 'failed')->count(),
        ];
        return response()->json(['success' => true, 'data' => $stats]);
    }
}