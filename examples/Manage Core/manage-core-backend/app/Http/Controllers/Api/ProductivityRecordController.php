<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductivityRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductivityRecordController extends Controller
{
    public function index(): JsonResponse
    {
        $records = ProductivityRecord::where('user_id', auth()->id())->latest()->get();
        return response()->json(['data' => $records]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'owner' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'attachment_name' => 'nullable|string',
        ]);

        $data['user_id'] = auth()->id();

        $record = ProductivityRecord::create($data);
        return response()->json(['data' => $record], 201);
    }

    public function show(ProductivityRecord $productivityRecord): JsonResponse
    {
        if ($productivityRecord->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json(['data' => $productivityRecord]);
    }

    public function update(Request $request, ProductivityRecord $productivityRecord): JsonResponse
    {
        if ($productivityRecord->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'owner' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'attachment_name' => 'nullable|string',
        ]);

        $productivityRecord->update($data);
        return response()->json(['data' => $productivityRecord]);
    }

    public function destroy(ProductivityRecord $productivityRecord): JsonResponse
    {
        if ($productivityRecord->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $productivityRecord->delete();
        return response()->json(['ok' => true]);
    }
}
