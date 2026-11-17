<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockTransfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockTransferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StockTransfer::with('product');

 if ($request->filled('status')) {
            $status = $request->string('status');
            $query->where('status', $status);
        }
 if ($request->filled('from_warehouse')) {
            $from = $request->string('from_warehouse');
            $query->where('from_warehouse', $from);
        }
 if ($request->filled('to_warehouse')) {
            $to = $request->string('to_warehouse');
            $query->where('to_warehouse', $to);
        }

        $items = $query->orderByDesc('request_date')->paginate($request->integer('per_page', 15));

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
            'transfer_no' => 'required|string|unique:stock_transfers,transfer_no',
            'from_warehouse' => 'nullable|string',
            'to_warehouse' => 'nullable|string',
            'material' => 'nullable|string',
            'quantity' => 'nullable|numeric',
            'carrier' => 'nullable|string',
            'tracking_no' => 'nullable|string',
            'status' => 'nullable|in:requested,approved,dispatched,received,cancelled',
            'request_date' => 'nullable|date',
        ]);

        $item = StockTransfer::create($validated);

        return response()->json(['data' => $item->load('product')], 201);
    }

    public function show(StockTransfer $stockTransfer): JsonResponse
    {
        return response()->json(['data' => $stockTransfer->load('product')]);
    }

    public function update(Request $request, StockTransfer $stockTransfer): JsonResponse
    {
        $validated = $request->validate([
            'transfer_no' => 'sometimes|string|unique:stock_transfers,transfer_no,' . $stockTransfer->id,
            'from_warehouse' => 'nullable|string',
            'to_warehouse' => 'nullable|string',
            'material' => 'nullable|string',
            'quantity' => 'nullable|numeric',
            'carrier' => 'nullable|string',
            'tracking_no' => 'nullable|string',
            'status' => 'nullable|in:requested,approved,dispatched,received,cancelled',
            'request_date' => 'nullable|date',
        ]);

        $stockTransfer->update($validated);

        return response()->json(['data' => $stockTransfer->load('product')]);
    }

    public function destroy(StockTransfer $stockTransfer): JsonResponse
    {
        $stockTransfer->delete();

        return response()->json(['data' => ['id' => $stockTransfer->id]], 200);
    }
}
