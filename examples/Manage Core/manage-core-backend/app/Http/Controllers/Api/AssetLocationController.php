<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssetLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetLocationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AssetLocation::query();

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
            'code' => 'required|string|unique:asset_locations,code',
            'name' => 'required|string',
            'location_type' => 'nullable|string',
            'max_capacity' => 'nullable|integer',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $item = AssetLocation::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(AssetLocation $assetLocation): JsonResponse
    {
        return response()->json(['data' => $assetLocation]);
    }

    public function update(Request $request, AssetLocation $assetLocation): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:asset_locations,code,' . $assetLocation->id,
            'name' => 'sometimes|string',
            'location_type' => 'nullable|string',
            'max_capacity' => 'nullable|integer',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $assetLocation->update($validated);

        return response()->json(['data' => $assetLocation]);
    }

    public function destroy(AssetLocation $assetLocation): JsonResponse
    {
        $assetLocation->delete();

        return response()->json(['data' => ['id' => $assetLocation->id]], 200);
    }
}
