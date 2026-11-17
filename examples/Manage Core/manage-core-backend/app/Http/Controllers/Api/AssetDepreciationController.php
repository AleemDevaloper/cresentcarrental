<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetDepreciation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetDepreciationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AssetDepreciation::with('asset');

        if ($assetId = $request->integer('asset_id')) {
            $query->where('asset_id', $assetId);
        }

        $items = $query->orderByDesc('entry_date')->paginate($request->integer('per_page', 15));

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
            'asset_id' => 'required|exists:assets,id',
            'amount' => 'required|numeric',
            'entry_date' => 'required|date',
            'remaining_value' => 'required|numeric',
        ]);

        $depreciation = AssetDepreciation::create($validated);

        $asset = Asset::find($validated['asset_id']);
        if ($asset) {
            $asset->current_value = $validated['remaining_value'];
            $asset->save();
        }

        return response()->json(['data' => $depreciation->load('asset')], 201);
    }

    public function show(AssetDepreciation $assetDepreciation): JsonResponse
    {
        return response()->json(['data' => $assetDepreciation->load('asset')]);
    }

    public function update(Request $request, AssetDepreciation $assetDepreciation): JsonResponse
    {
        $validated = $request->validate([
            'asset_id' => 'sometimes|exists:assets,id',
            'amount' => 'sometimes|numeric',
            'entry_date' => 'sometimes|date',
            'remaining_value' => 'sometimes|numeric',
        ]);

        $assetDepreciation->update($validated);

        return response()->json(['data' => $assetDepreciation->load('asset')]);
    }

    public function destroy(AssetDepreciation $assetDepreciation): JsonResponse
    {
        $assetDepreciation->delete();

        return response()->json(['data' => ['id' => $assetDepreciation->id]], 200);
    }
}
