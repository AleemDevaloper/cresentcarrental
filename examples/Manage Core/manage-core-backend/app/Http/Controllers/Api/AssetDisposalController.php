<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetDisposal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetDisposalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AssetDisposal::with('asset');

 if ($request->filled('disposal_type')) {
            $type = $request->string('disposal_type');
            $query->where('disposal_type', $type);
        }

        $items = $query->orderByDesc('disposal_date')->paginate($request->integer('per_page', 15));

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
            'asset_id' => 'nullable|exists:assets,id',
            'asset_name' => 'nullable|string',
            'disposal_type' => 'nullable|in:sale,scrap,transfer',
            'book_value' => 'nullable|numeric',
            'accum_depreciation' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'scrap_value' => 'nullable|numeric',
            'recipient' => 'nullable|string',
            'reason' => 'nullable|string',
            'disposal_date' => 'nullable|date',
        ]);

        if (empty($validated['asset_name']) && !empty($validated['asset_id'])) {
            $asset = Asset::find($validated['asset_id']);
            $validated['asset_name'] = $asset ? $asset->name : null;
        }

        $item = AssetDisposal::create($validated);

        return response()->json(['data' => $item->load('asset')], 201);
    }

    public function show(AssetDisposal $assetDisposal): JsonResponse
    {
        return response()->json(['data' => $assetDisposal->load('asset')]);
    }

    public function update(Request $request, AssetDisposal $assetDisposal): JsonResponse
    {
        $validated = $request->validate([
            'asset_id' => 'nullable|exists:assets,id',
            'asset_name' => 'nullable|string',
            'disposal_type' => 'nullable|in:sale,scrap,transfer',
            'book_value' => 'nullable|numeric',
            'accum_depreciation' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'scrap_value' => 'nullable|numeric',
            'recipient' => 'nullable|string',
            'reason' => 'nullable|string',
            'disposal_date' => 'nullable|date',
        ]);

        $assetDisposal->update($validated);

        return response()->json(['data' => $assetDisposal->load('asset')]);
    }

    public function destroy(AssetDisposal $assetDisposal): JsonResponse
    {
        $assetDisposal->delete();

        return response()->json(['data' => ['id' => $assetDisposal->id]], 200);
    }
}
