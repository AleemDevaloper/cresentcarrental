<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmAutomation;
use App\Models\CrmAutomationRun;
use App\Models\CrmAutomationTrigger;
use App\Models\CrmAutomationCondition;
use App\Models\CrmAutomationAction;
use App\Services\Crm\CrmAutomationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmAutomationController extends Controller
{
    public function __construct(private CrmAutomationService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = CrmAutomation::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        foreach (['is_active', 'test_mode', 'entity_type'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $items = $query->withCount('runs')->paginate($request->input('per_page', 25));
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
        $auto = CrmAutomation::with(['triggers', 'conditions', 'actions'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $auto]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'entity_type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'test_mode' => 'nullable|boolean',
            'max_executions_per_record' => 'nullable|integer|min:1',
            'triggers' => 'required|array|min:1',
            'triggers.*.event' => 'required|string',
            'conditions' => 'nullable|array',
            'conditions.*.field' => 'required|string',
            'conditions.*.operator' => 'required|string',
            'conditions.*.value' => 'nullable',
            'conditions.*.logic' => 'nullable|in:and,or',
            'actions' => 'required|array|min:1',
            'actions.*.type' => 'required|string',
            'actions.*.params' => 'nullable|array',
            'actions.*.delay_minutes' => 'nullable|integer',
        ]);
        $validated['created_by'] = auth()->id();

        $automation = DB::connection('tenant')->transaction(function () use ($validated) {
            $auto = CrmAutomation::create(collect($validated)->except(['triggers', 'conditions', 'actions'])->toArray());
            foreach ($validated['triggers'] as $i => $t) {
                CrmAutomationTrigger::create([
                    'automation_id' => $auto->id,
                    'event' => $t['event'],
                    'order' => $i,
                ]);
            }
            foreach ($validated['conditions'] ?? [] as $i => $c) {
                CrmAutomationCondition::create([
                    'automation_id' => $auto->id,
                    'field' => $c['field'],
                    'operator' => $c['operator'],
                    'value' => $c['value'] ?? null,
                    'logic' => $c['logic'] ?? 'and',
                    'order' => $i,
                ]);
            }
            foreach ($validated['actions'] as $i => $a) {
                CrmAutomationAction::create([
                    'automation_id' => $auto->id,
                    'type' => $a['type'],
                    'params' => $a['params'] ?? [],
                    'delay_minutes' => $a['delay_minutes'] ?? 0,
                    'order' => $i,
                ]);
            }
            return $auto;
        });

        return response()->json(['success' => true, 'data' => $automation->load(['triggers', 'conditions', 'actions'])], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $auto = CrmAutomation::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'entity_type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'test_mode' => 'nullable|boolean',
            'max_executions_per_record' => 'nullable|integer|min:1',
        ]);
        $auto->update($validated);
        return response()->json(['success' => true, 'data' => $auto->fresh(['triggers', 'conditions', 'actions'])]);
    }

    public function destroy($id): JsonResponse
    {
        $auto = CrmAutomation::findOrFail($id);
        $auto->delete();
        return response()->json(['success' => true, 'message' => 'Automation deleted']);
    }

    public function toggle($id): JsonResponse
    {
        $auto = CrmAutomation::findOrFail($id);
        $auto->update(['is_active' => !$auto->is_active]);
        return response()->json(['success' => true, 'data' => $auto->fresh()]);
    }

    public function indexRuns(Request $request, $id): JsonResponse
    {
        $query = CrmAutomationRun::where('automation_id', $id);
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        $items = $query->orderBy('started_at', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function runNow(Request $request, $id): JsonResponse
    {
        $auto = CrmAutomation::findOrFail($id);
        $validated = $request->validate([
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
        ]);
        $entityClass = $validated['entity_type'];
        $entity = $entityClass::findOrFail($validated['entity_id']);
        $run = $this->service->execute($auto, $entity);
        return response()->json(['success' => true, 'data' => $run]);
    }
}