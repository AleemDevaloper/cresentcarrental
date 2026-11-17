<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmSequence;
use App\Models\CrmSequenceStep;
use App\Models\CrmSequenceEnrollment;
use App\Services\Crm\CrmSequenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmSequenceController extends Controller
{
    public function __construct(private CrmSequenceService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = CrmSequence::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($request->filled('status')) $query->where('status', $request->input('status'));
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
        $sequence = CrmSequence::with(['steps.template', 'enrollments'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $sequence]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,paused,archived',
            'is_active' => 'nullable|boolean',
            'steps' => 'required|array|min:1',
            'steps.*.name' => 'nullable|string',
            'steps.*.type' => 'required|in:email,call,task',
            'steps.*.delay_days' => 'nullable|integer|min:0',
            'steps.*.delay_hours' => 'nullable|integer|min:0',
            'steps.*.send_time' => 'nullable|string',
            'steps.*.template_id' => 'nullable|integer',
        ]);
        $validated['owner_id'] = auth()->id();
        $validated['created_by'] = auth()->id();

        $sequence = DB::connection('tenant')->transaction(function () use ($validated) {
            $seq = CrmSequence::create(collect($validated)->except('steps')->toArray());
            foreach ($validated['steps'] as $i => $stepData) {
                CrmSequenceStep::create([
                    'sequence_id' => $seq->id,
                    'order' => $i + 1,
                    'name' => $stepData['name'] ?? null,
                    'type' => $stepData['type'],
                    'delay_days' => $stepData['delay_days'] ?? 0,
                    'delay_hours' => $stepData['delay_hours'] ?? 0,
                    'send_time' => $stepData['send_time'] ?? null,
                    'template_id' => $stepData['template_id'] ?? null,
                ]);
            }
            return $seq;
        });

        return response()->json(['success' => true, 'data' => $sequence->load('steps')], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,paused,archived',
            'is_active' => 'nullable|boolean',
        ]);
        $seq->update($validated);
        return response()->json(['success' => true, 'data' => $seq->fresh('steps')]);
    }

    public function destroy($id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $seq->delete();
        return response()->json(['success' => true, 'message' => 'Sequence deleted']);
    }

    public function addStep(Request $request, $id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string',
            'type' => 'required|in:email,call,task',
            'delay_days' => 'nullable|integer|min:0',
            'delay_hours' => 'nullable|integer|min:0',
            'send_time' => 'nullable|string',
            'template_id' => 'nullable|integer',
        ]);
        $order = $seq->steps()->max('order') + 1;
        $step = CrmSequenceStep::create(array_merge($validated, [
            'sequence_id' => $seq->id,
            'order' => $order,
        ]));
        return response()->json(['success' => true, 'data' => $step], 201);
    }

    public function removeStep($sequenceId, $stepId): JsonResponse
    {
        $step = CrmSequenceStep::where('sequence_id', $sequenceId)->findOrFail($stepId);
        $step->delete();
        return response()->json(['success' => true, 'message' => 'Step removed']);
    }

    public function enroll(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|in:lead,contact,customer,deal',
            'entity_id' => 'required|integer',
        ]);
        $entityClass = match ($validated['entity_type']) {
            'lead' => \App\Models\CrmLead::class,
            'contact' => \App\Models\CrmContact::class,
            'customer' => \App\Models\CrmCustomer::class,
            'deal' => \App\Models\CrmDeal::class,
        };
        $entity = $entityClass::findOrFail($validated['entity_id']);
        $enrollment = $this->service->enroll($id, $entity, auth()->id());
        return response()->json(['success' => true, 'data' => $enrollment]);
    }

    public function bulkEnroll(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|in:lead,contact,customer,deal',
            'entity_ids' => 'required|array',
            'entity_ids.*' => 'integer',
        ]);
        $entityClass = match ($validated['entity_type']) {
            'lead' => \App\Models\CrmLead::class,
            'contact' => \App\Models\CrmContact::class,
            'customer' => \App\Models\CrmCustomer::class,
            'deal' => \App\Models\CrmDeal::class,
        };
        $count = 0;
        foreach ($validated['entity_ids'] as $eid) {
            $entity = $entityClass::find($eid);
            if ($entity) {
                $this->service->enroll($id, $entity, auth()->id());
                $count++;
            }
        }
        return response()->json(['success' => true, 'count' => $count]);
    }

    public function indexEnrollments(Request $request, $id): JsonResponse
    {
        $query = CrmSequenceEnrollment::where('sequence_id', $id);
        if ($request->filled('status')) $query->where('status', $request->input('status'));
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

    public function stopEnrollment($enrollmentId): JsonResponse
    {
        $e = CrmSequenceEnrollment::findOrFail($enrollmentId);
        $e->stop('manual_stop');
        return response()->json(['success' => true, 'data' => $e->fresh()]);
    }

    public function pauseSequence($id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $seq->update(['status' => 'paused', 'is_active' => false]);
        CrmSequenceEnrollment::where('sequence_id', $id)->where('status', 'active')->update(['status' => 'paused']);
        return response()->json(['success' => true, 'data' => $seq]);
    }

    public function resumeSequence($id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $seq->update(['status' => 'active', 'is_active' => true]);
        CrmSequenceEnrollment::where('sequence_id', $id)->where('status', 'paused')->update(['status' => 'active']);
        return response()->json(['success' => true, 'data' => $seq]);
    }

    public function stats($id): JsonResponse
    {
        $seq = CrmSequence::findOrFail($id);
        $stats = [
            'active' => $seq->enrollments()->where('status', 'active')->count(),
            'completed' => $seq->enrollments()->where('status', 'completed')->count(),
            'stopped' => $seq->enrollments()->where('status', 'stopped')->count(),
            'paused' => $seq->enrollments()->where('status', 'paused')->count(),
            'reply_stop' => $seq->enrollments()->where('stop_reason', 'reply_received')->count(),
            'bounce_stop' => $seq->enrollments()->where('stop_reason', 'email_bounced')->count(),
        ];
        return response()->json(['success' => true, 'data' => $stats]);
    }
}