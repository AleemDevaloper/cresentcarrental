<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WarehouseLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseLocationController extends Controller
{
    public function index(Warehouse $warehouse): JsonResponse
    {
        return response()->json(['data' => $warehouse->locations()->with('children')->orderBy('name')->get()]);
    }

    public function store(Request $request, Warehouse $warehouse): JsonResponse
    {
        $location = $warehouse->locations()->create($request->validate([
            'parent_id' => 'nullable|exists:warehouse_locations,id',
            'code' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'location_type' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $location], 201);
    }

    public function update(Request $request, WarehouseLocation $warehouseLocation): JsonResponse
    {
        $warehouseLocation->update($request->validate([
            'parent_id' => 'nullable|exists:warehouse_locations,id',
            'code' => 'sometimes|string|max:100',
            'name' => 'sometimes|string|max:255',
            'location_type' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $warehouseLocation]);
    }

    public function destroy(WarehouseLocation $warehouseLocation): JsonResponse
    {
        $warehouseLocation->delete();
        return response()->json(['data' => ['id' => $warehouseLocation->id]]);
    }
}
