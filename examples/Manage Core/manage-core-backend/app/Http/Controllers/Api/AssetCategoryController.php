<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssetCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AssetCategory::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
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
            'name' => 'required|string|max:255|unique:asset_categories,name',
            'description' => 'nullable|string',
        ]);

        $item = AssetCategory::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(AssetCategory $assetCategory): JsonResponse
    {
        return response()->json(['data' => $assetCategory->load('assets')]);
    }

    public function update(Request $request, AssetCategory $assetCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:asset_categories,name,' . $assetCategory->id,
            'description' => 'nullable|string',
        ]);

        $assetCategory->update($validated);

        return response()->json(['data' => $assetCategory]);
    }

    public function destroy(AssetCategory $assetCategory): JsonResponse
    {
        $assetCategory->delete();

        return response()->json(['data' => ['id' => $assetCategory->id]]);
    }
}
