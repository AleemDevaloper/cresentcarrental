<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssetClearance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssetClearanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = AssetClearance::with('user');

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $clearances = $query->latest()->get();
        return response()->json(['data' => $clearances]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:users,id',
            'items' => 'required|json',
        ]);

        $items = json_decode($data['items'], true);
        if (!is_array($items) || empty($items)) {
            return response()->json(['message' => 'Items must be a non-empty JSON array.'], 422);
        }

        $clearance = DB::transaction(function() use ($request, $data, $items) {
            foreach ($items as $item) {
                AssetClearance::create([
                    'user_id' => $data['employee_id'],
                    'asset_name' => $item['asset_name'] ?? '',
                    'asset_code' => $item['asset_code'] ?? null,
                    'condition' => $item['condition'] ?? null,
                    'status' => !empty($item['returned']) ? 'cleared' : 'pending',
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            return AssetClearance::where('user_id', $data['employee_id'])
                ->with('user')
                ->latest()
                ->get();
        });

        return response()->json(['data' => $clearance], 201);
    }

    public function update(Request $request, AssetClearance $assetClearance): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'asset_name' => 'nullable|string',
            'asset_code' => 'nullable|string',
            'returned' => 'nullable|boolean',
            'condition' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($data['asset_name'])) $updateData['asset_name'] = $data['asset_name'];
        if (isset($data['asset_code'])) $updateData['asset_code'] = $data['asset_code'];
        if (isset($data['condition'])) $updateData['condition'] = $data['condition'];
        if (isset($data['remarks'])) $updateData['remarks'] = $data['remarks'];
        if (isset($data['returned'])) {
            $updateData['status'] = $data['returned'] ? 'cleared' : 'pending';
        }

        $assetClearance->update($updateData);
        return response()->json(['data' => $assetClearance->fresh('user')]);
    }

    public function finalize(Request $request, AssetClearance $assetClearance): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $assetClearance->update([
            'status' => 'cleared',
            'return_date' => now()->toDateString(),
        ]);

        return response()->json(['data' => $assetClearance->fresh('user')]);
    }
}
