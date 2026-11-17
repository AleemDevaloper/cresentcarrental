<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CostCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CostCenterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CostCenter::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $items = $query->orderBy('name')->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'total' => $items->total(),
                'currentPage' => $items->currentPage(),
                'lastPage' => $items->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:cost_centers,code',
            'name' => 'required|string',
            'cost_type' => 'nullable|string',
            'annual_budget' => 'nullable|numeric',
            'allocation_method' => 'nullable|string',
            'manager' => 'nullable|string',
            'department' => 'nullable|string',
            'branch' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $item = CostCenter::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(CostCenter $costCenter): JsonResponse
    {
        return response()->json(['data' => $costCenter]);
    }

    public function update(Request $request, CostCenter $costCenter): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:cost_centers,code,' . $costCenter->id,
            'name' => 'sometimes|string',
            'cost_type' => 'nullable|string',
            'annual_budget' => 'nullable|numeric',
            'allocation_method' => 'nullable|string',
            'manager' => 'nullable|string',
            'department' => 'nullable|string',
            'branch' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $costCenter->update($validated);

        return response()->json(['data' => $costCenter]);
    }

    public function destroy(CostCenter $costCenter): JsonResponse
    {
        $costCenter->delete();

        return response()->json(['data' => ['id' => $costCenter->id]], 200);
    }
}
