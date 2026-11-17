<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmDuplicateGroup;
use App\Services\Crm\CrmDuplicateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmDuplicateController extends Controller
{
    public function __construct(private CrmDuplicateService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = CrmDuplicateGroup::query()->with('members');
        if ($request->filled('entity_type')) $query->where('entity_type', $request->input('entity_type'));
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        $items = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 25));
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
        $group = CrmDuplicateGroup::with('members')->findOrFail($id);
        // Hydrate the entity records
        foreach ($group->members as $m) {
            $m->record = $m->entity_type::find($m->entity_id);
        }
        return response()->json(['success' => true, 'data' => $group]);
    }

    public function scan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|in:lead,contact,customer',
        ]);
        $entityClass = match ($validated['entity_type']) {
            'lead' => \App\Models\CrmLead::class,
            'contact' => \App\Models\CrmContact::class,
            'customer' => \App\Models\CrmCustomer::class,
        };
        \App\Jobs\Crm\DetectDuplicatesJob::dispatch($entityClass);
        return response()->json(['success' => true, 'message' => 'Duplicate scan queued']);
    }

    public function merge(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'primary_id' => 'required|integer',
            'duplicate_ids' => 'required|array',
            'duplicate_ids.*' => 'integer',
            'overrides' => 'nullable|array',
        ]);
        $group = CrmDuplicateGroup::findOrFail($id);
        $entity = $group->entity_type;
        $result = $this->service->merge($entity, $validated['primary_id'], $validated['duplicate_ids'], $validated['overrides'] ?? []);
        return response()->json(['success' => true, 'data' => $result]);
    }

    public function ignore($id): JsonResponse
    {
        $this->service->ignore($id);
        return response()->json(['success' => true]);
    }

    public function markNotDuplicate($id): JsonResponse
    {
        $this->service->markNotDuplicate($id);
        return response()->json(['success' => true]);
    }

    public function destroy($id): JsonResponse
    {
        $group = CrmDuplicateGroup::findOrFail($id);
        $group->members()->delete();
        $group->delete();
        return response()->json(['success' => true, 'message' => 'Group removed']);
    }
}