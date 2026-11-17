<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryReservation;
use App\Models\InventoryStock;
use App\Services\InventoryStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryStockController extends Controller
{
    public function levels(Request $request): JsonResponse
    {
        $query = InventoryStock::with(['product', 'variant', 'warehouse', 'location'])
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->input('product_id')))
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->when($request->filled('location_id'), fn ($q) => $q->where('location_id', $request->input('location_id')))
            ->when($request->filled('product_variant_id'), fn ($q) => $q->where('product_variant_id', $request->input('product_variant_id')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = '%' . $request->input('search') . '%';
                $q->whereHas('product', fn ($product) => $product->where('name', 'like', $term)->orWhere('sku', 'like', $term));
            })
            ->orderByDesc('last_movement_at');
        $items = $query->paginate(min(max($request->integer('per_page', 25), 1), 100));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function movement(Request $request, InventoryStockService $service): JsonResponse
    {
        $data = $request->validate([
            'reference_no' => 'required|string|max:100',
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'location_id' => 'nullable|exists:warehouse_locations,id',
            'batch_id' => 'nullable|exists:inventory_batches,id',
            'serial_id' => 'nullable|exists:inventory_serial_numbers,id',
            'movement_type' => 'required|in:opening,purchase,receipt,issue,sale,sales_return,purchase_return,transfer_in,transfer_out,adjustment_in,adjustment_out,damage,expiry,consumption,production_receipt,production_issue',
            'quantity' => 'required|numeric|not_in:0',
            'unit' => 'nullable|string|max:50',
            'unit_cost' => 'nullable|numeric|min:0',
            'movement_date' => 'nullable|date',
            'reason' => 'nullable|string',
            'source_type' => 'nullable|string|max:100',
            'source_id' => 'nullable|string|max:100',
            'source_module' => 'nullable|string|max:100',
        ]);
        $entry = $service->postMovement($data);
        return response()->json(['data' => $entry->load(['product', 'warehouse', 'location'])], 201);
    }

    public function reserve(Request $request, InventoryStockService $service): JsonResponse
    {
        $reservation = $service->reserve($request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'location_id' => 'nullable|exists:warehouse_locations,id',
            'batch_id' => 'nullable|exists:inventory_batches,id',
            'serial_id' => 'nullable|exists:inventory_serial_numbers,id',
            'quantity' => 'required|numeric|gt:0',
            'source_type' => 'nullable|string|max:100',
            'source_id' => 'nullable|string|max:100',
        ]));
        return response()->json(['data' => $reservation->load(['product', 'warehouse', 'location'])], 201);
    }

    public function reservations(Request $request): JsonResponse
    {
        $items = InventoryReservation::with(['product', 'warehouse', 'location'])
            ->where('status', 'active')->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }
}
