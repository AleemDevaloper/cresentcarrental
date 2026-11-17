<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Asset::with(['category', 'assignedUser']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('asset_code', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $assets = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $assets->items(),
            'meta' => [
                'total' => $assets->total(),
                'currentPage' => $assets->currentPage(),
                'lastPage' => $assets->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:asset_categories,id',
            'name' => 'required|string|max:255',
            'asset_code' => 'required|string|unique:assets,asset_code',
            'location' => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'purchase_date' => 'nullable|date',
            'purchase_cost' => 'nullable|numeric',
            'warranty_expiry' => 'nullable|date',
            'status' => 'nullable|string|in:active,maintenance,retired,stolen,lost',
        ]);

        $asset = Asset::create($validated + ['current_value' => $validated['purchase_cost'] ?? 0]);

        return response()->json(['data' => $asset->load(['category', 'assignedUser'])], 201);
    }

    public function show(Asset $asset): JsonResponse
    {
        return response()->json(['data' => $asset->load(['category', 'assignedUser', 'maintenances', 'depreciations'])]);
    }

    public function update(Request $request, Asset $asset): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:asset_categories,id',
            'name' => 'nullable|string|max:255',
            'location' => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'purchase_date' => 'nullable|date',
            'purchase_cost' => 'nullable|numeric',
            'current_value' => 'nullable|numeric',
            'warranty_expiry' => 'nullable|date',
            'status' => 'nullable|string|in:active,maintenance,retired,stolen,lost',
        ]);

        $asset->update($validated);

        return response()->json(['data' => $asset->load(['category', 'assignedUser'])]);
    }

    public function addMaintenance(Request $request, Asset $asset): JsonResponse
    {
        $validated = $request->validate([
            'maintenance_date' => 'required|date',
            'cost' => 'nullable|numeric',
            'description' => 'required|string',
            'performed_by' => 'nullable|string',
        ]);

        $maintenance = $asset->maintenances()->create($validated);

        return response()->json(['data' => $maintenance], 201);
    }

    public function destroy(Asset $asset): JsonResponse
    {
        $asset->delete();

        return response()->json(['data' => ['id' => $asset->id]]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(['data' => AssetCategory::all()]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'totalAssets' => Asset::count(),
                'activeAssets' => Asset::where('status', 'active')->count(),
                'underMaintenance' => Asset::where('status', 'maintenance')->count(),
                'totalValue' => Asset::sum('current_value'),
                'retiredAssets' => Asset::where('status', 'retired')->count(),
            ]
        ]);
    }
}
