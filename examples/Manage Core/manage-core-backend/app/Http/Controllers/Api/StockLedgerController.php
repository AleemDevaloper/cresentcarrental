<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockLedgerEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockLedgerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StockLedgerEntry::with(['product', 'variant', 'warehouse', 'location'])->latest('movement_date');
        foreach (['product_id', 'warehouse_id', 'movement_type', 'batch_no', 'serial_no'] as $field) {
            if ($request->filled($field)) $query->where($field, $request->input($field));
        }
        $items = $query->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function store(Request $request): JsonResponse
    {
        $entry = DB::transaction(function () use ($request) {
            return StockLedgerEntry::create($request->validate([
                'reference_no' => 'required|string|max:100',
                'product_id' => 'required|exists:products,id',
                'product_variant_id' => 'nullable|exists:product_variants,id',
                'warehouse_id' => 'required|exists:warehouses,id',
                'location_id' => 'nullable|exists:warehouse_locations,id',
                'movement_type' => 'required|in:opening,purchase,sale,sales_return,purchase_return,transfer,adjustment,damage,expiry,consumption,production,stock_count',
                'quantity' => 'required|numeric|not_in:0',
                'unit' => 'nullable|string|max:50',
                'batch_no' => 'nullable|string|max:100',
                'serial_no' => 'nullable|string|max:100',
                'unit_cost' => 'nullable|numeric|min:0',
                'movement_date' => 'required|date',
                'source_type' => 'nullable|string|max:100',
                'source_id' => 'nullable|string|max:100',
                'reason' => 'nullable|string',
            ]));
        });
        return response()->json(['data' => $entry->load(['product', 'warehouse', 'location'])], 201);
    }
}
