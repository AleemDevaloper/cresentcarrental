<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryAlert;
use App\Models\InventoryBatch;
use App\Models\InventoryCostLayer;
use App\Models\InventoryReorderRule;
use App\Models\InventorySerialMovement;
use App\Models\InventorySerialNumber;
use App\Models\InventoryStock;
use App\Models\InventoryStockCount;
use App\Models\InventoryStockCountItem;
use App\Services\InventoryStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdvancedInventoryController extends Controller
{
    public function batches(Request $request): JsonResponse
    {
        $items = InventoryBatch::with(['product', 'variant', 'warehouse', 'location'])
            ->when($request->filled('search'), fn ($q) => $q->where('batch_number', 'like', '%' . $request->input('search') . '%'))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->input('product_id')))
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->boolean('expiry_only'), fn ($q) => $q->whereNotNull('expiry_date')->whereDate('expiry_date', '<=', now()->addDays(90)))
            ->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storeBatch(Request $request): JsonResponse
    {
        $data = $request->validate([
            'batch_number' => 'required|string|max:100',
            'manufacturer_batch_number' => 'nullable|string|max:100',
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'location_id' => 'nullable|exists:warehouse_locations,id',
            'manufacturing_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:manufacturing_date',
            'received_date' => 'nullable|date',
            'original_quantity' => 'required|numeric|min:0',
            'unit_cost' => 'nullable|numeric|min:0',
            'supplier_id' => 'nullable|integer',
            'status' => 'nullable|in:active,quarantine,released,blocked,expired,depleted,archived',
            'notes' => 'nullable|string',
        ]);
        $batch = InventoryBatch::create([...$data, 'created_by' => auth()->id()]);
        return response()->json(['data' => $batch->load(['product', 'warehouse', 'location'])], 201);
    }

    public function updateBatch(Request $request, InventoryBatch $batch): JsonResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|in:active,quarantine,released,blocked,expired,depleted,archived',
            'notes' => 'nullable|string',
            'expiry_date' => 'nullable|date|after_or_equal:manufacturing_date',
        ]);
        if (($data['status'] ?? null) === 'released' && $batch->expiry_date?->isPast()) {
            return response()->json(['message' => 'Expired batches cannot be released.'], 422);
        }
        $batch->update($data);
        return response()->json(['data' => $batch->fresh()->load(['product', 'warehouse', 'location'])]);
    }

    public function serials(Request $request): JsonResponse
    {
        $items = InventorySerialNumber::with(['product', 'variant', 'batch', 'warehouse', 'location'])
            ->when($request->filled('search'), fn ($q) => $q->where('serial_number', 'like', '%' . $request->input('search') . '%'))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->input('product_id')))
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storeSerial(Request $request): JsonResponse
    {
        $data = $request->validate([
            'serial_number' => 'required|string|max:150|unique:inventory_serial_numbers,serial_number',
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'batch_id' => 'nullable|exists:inventory_batches,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'location_id' => 'nullable|exists:warehouse_locations,id',
            'status' => 'nullable|in:available,reserved,sold,installed,returned,damaged,lost,stolen,under_repair,warranty,retired,scrapped',
            'purchase_reference' => 'nullable|string|max:100',
            'receipt_reference' => 'nullable|string|max:100',
            'purchase_date' => 'nullable|date',
            'warranty_start' => 'nullable|date',
            'warranty_end' => 'nullable|date|after_or_equal:warranty_start',
            'customer_id' => 'nullable|integer',
            'current_owner' => 'nullable|string|max:255',
        ]);
        $serial = InventorySerialNumber::create($data);
        return response()->json(['data' => $serial->load(['product', 'batch', 'warehouse', 'location'])], 201);
    }

    public function updateSerial(Request $request, InventorySerialNumber $serial): JsonResponse
    {
        $data = $request->validate(['status' => 'sometimes|in:available,reserved,sold,installed,returned,damaged,lost,stolen,under_repair,warranty,retired,scrapped', 'current_owner' => 'nullable|string|max:255']);
        $old = $serial->status;
        $serial->update($data);
        if (isset($data['status']) && $old !== $data['status']) {
            InventorySerialMovement::create(['serial_id' => $serial->id, 'movement_type' => $data['status'], 'source_type' => 'manual', 'user_id' => auth()->id()]);
        }
        return response()->json(['data' => $serial->fresh()->load(['product', 'batch', 'warehouse', 'location', 'movements'])]);
    }

    public function counts(Request $request): JsonResponse
    {
        $items = InventoryStockCount::with(['warehouse', 'items.product'])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storeCount(Request $request): JsonResponse
    {
        $data = $request->validate(['warehouse_id' => 'required|exists:warehouses,id', 'count_type' => 'required|in:full,location,product,category,cycle', 'scheduled_date' => 'nullable|date', 'blind_count' => 'nullable|boolean', 'notes' => 'nullable|string']);
        $count = InventoryStockCount::create([...$data, 'count_number' => 'CNT-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4)), 'created_by' => auth()->id()]);
        return response()->json(['data' => $count->load('warehouse')], 201);
    }

    public function submitCountItem(Request $request, InventoryStockCount $count): JsonResponse
    {
        if (!in_array($count->status, ['draft', 'scheduled', 'in_progress'], true)) {
            return response()->json(['message' => 'This count is no longer editable.'], 422);
        }
        $data = $request->validate([
            'product_id' => 'required|exists:products,id', 'product_variant_id' => 'nullable|exists:product_variants,id',
            'batch_id' => 'nullable|exists:inventory_batches,id', 'serial_id' => 'nullable|exists:inventory_serial_numbers,id',
            'location_id' => 'nullable|exists:warehouse_locations,id', 'counted_quantity' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50', 'reason' => 'nullable|string|max:255', 'notes' => 'nullable|string',
        ]);
        $stock = InventoryStock::where('product_id', $data['product_id'])->where('warehouse_id', $count->warehouse_id)
            ->where('product_variant_id', $data['product_variant_id'] ?? null)->where('location_id', $data['location_id'] ?? null)
            ->where('batch_id', $data['batch_id'] ?? null)->where('serial_id', $data['serial_id'] ?? null)->first();
        $system = (float) ($stock?->on_hand ?? 0);
        $item = $count->items()->updateOrCreate([
            'product_id' => $data['product_id'], 'product_variant_id' => $data['product_variant_id'] ?? null,
            'batch_id' => $data['batch_id'] ?? null, 'serial_id' => $data['serial_id'] ?? null, 'location_id' => $data['location_id'] ?? null,
        ], [...$data, 'system_quantity' => $system, 'difference' => (float) $data['counted_quantity'] - $system, 'counted_by' => auth()->id(), 'counted_at' => now()]);
        $count->update(['status' => 'in_progress', 'started_at' => $count->started_at ?: now()]);
        return response()->json(['data' => $item->load('product')]);
    }

    public function approveCount(InventoryStockCount $count): JsonResponse
    {
        if ($count->status !== 'pending_review' && $count->status !== 'in_progress') {
            return response()->json(['message' => 'Only an active count can be approved.'], 422);
        }
        $count->update(['status' => 'approved', 'approved_by' => auth()->id(), 'approved_at' => now(), 'completed_at' => now()]);
        return response()->json(['data' => $count->fresh()]);
    }

    public function reconcileCount(InventoryStockCount $count, InventoryStockService $service): JsonResponse
    {
        if ($count->status !== 'approved') return response()->json(['message' => 'Count must be approved before reconciliation.'], 422);
        DB::transaction(function () use ($count, $service) {
            foreach ($count->items()->where('difference', '<>', 0)->get() as $item) {
                $service->postMovement([
                    'reference_no' => $count->count_number, 'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id, 'warehouse_id' => $count->warehouse_id,
                    'location_id' => $item->location_id, 'batch_id' => $item->batch_id, 'serial_id' => $item->serial_id,
                    'movement_type' => $item->difference > 0 ? 'adjustment_in' : 'adjustment_out',
                    'quantity' => (float) $item->difference, 'unit' => $item->unit, 'reason' => 'Stock count reconciliation',
                    'source_type' => 'inventory_stock_count', 'source_id' => (string) $count->id,
                ]);
            }
            $count->update(['status' => 'reconciled', 'reconciled_at' => now()]);
        });
        return response()->json(['data' => $count->fresh()->load('items')]);
    }

    public function reorderRules(Request $request): JsonResponse
    {
        $items = InventoryReorderRule::with(['product', 'warehouse'])
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->input('product_id')))
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storeReorderRule(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id', 'product_variant_id' => 'nullable|exists:product_variants,id',
            'warehouse_id' => 'nullable|exists:warehouses,id', 'minimum_stock' => 'nullable|numeric|min:0',
            'maximum_stock' => 'nullable|numeric|min:0', 'reorder_point' => 'required|numeric|min:0',
            'reorder_quantity' => 'required|numeric|gt:0', 'safety_stock' => 'nullable|numeric|min:0',
            'lead_time_days' => 'nullable|integer|min:0', 'supplier_pack_multiple' => 'nullable|numeric|min:0',
            'preferred_supplier_id' => 'nullable|integer', 'is_active' => 'nullable|boolean',
        ]);
        $rule = InventoryReorderRule::updateOrCreate(
            ['product_id' => $data['product_id'], 'product_variant_id' => $data['product_variant_id'] ?? null, 'warehouse_id' => $data['warehouse_id'] ?? null],
            $data
        );
        return response()->json(['data' => $rule->load(['product', 'warehouse'])], 201);
    }

    public function alerts(Request $request): JsonResponse
    {
        $items = InventoryAlert::with(['product', 'warehouse'])->where('status', 'open')->latest()->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function resolveAlert(InventoryAlert $alert): JsonResponse
    {
        $alert->update(['status' => 'resolved', 'resolved_by' => auth()->id(), 'resolved_at' => now()]);
        return response()->json(['data' => $alert->fresh()]);
    }

    public function allocation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|numeric|gt:0',
            'method' => 'required|in:fifo,fefo',
        ]);
        $query = InventoryCostLayer::where('product_id', $data['product_id'])
            ->where('warehouse_id', $data['warehouse_id'])
            ->where('remaining_quantity', '>', 0)
            ->when(array_key_exists('product_variant_id', $data), fn ($q) => $q->where('product_variant_id', $data['product_variant_id']));
        if ($data['method'] === 'fefo') {
            $query->leftJoin('inventory_batches', 'inventory_batches.id', '=', 'inventory_cost_layers.batch_id')
                ->orderByRaw('inventory_batches.expiry_date IS NULL')
                ->orderBy('inventory_batches.expiry_date')
                ->select('inventory_cost_layers.*');
        } else {
            $query->orderBy('received_at')->orderBy('id');
        }
        $remaining = (float) $data['quantity'];
        $allocation = [];
        foreach ($query->get() as $layer) {
            if ($remaining <= 0) break;
            $used = min($remaining, (float) $layer->remaining_quantity);
            $allocation[] = ['layer_id' => $layer->id, 'batch_id' => $layer->batch_id, 'quantity' => $used, 'unit_cost' => (float) $layer->unit_cost];
            $remaining -= $used;
        }
        if ($remaining > 0) return response()->json(['message' => 'Insufficient cost-layer quantity for allocation.'], 422);
        return response()->json(['data' => ['method' => $data['method'], 'quantity' => (float) $data['quantity'], 'allocation' => $allocation]]);
    }

    public function health(Request $request): JsonResponse
    {
        $stocks = DB::table('inventory_stocks')
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->get(['product_id', 'warehouse_id', 'on_hand', 'reserved', 'average_cost']);
        $rules = InventoryReorderRule::where('is_active', true)->get()->keyBy(fn ($rule) => $rule->product_id . ':' . ($rule->warehouse_id ?: 'all'));
        $health = ['total_units' => 0, 'total_value' => 0, 'low_stock' => 0, 'out_of_stock' => 0, 'overstock' => 0, 'healthy' => 0];
        foreach ($stocks as $stock) {
            $onHand = (float) ($stock->on_hand ?? 0);
            $reserved = (float) ($stock->reserved ?? 0);
            $averageCost = (float) ($stock->average_cost ?? 0);
            $available = $onHand - $reserved;

            $health['total_units'] += $onHand;
            $health['total_value'] += $onHand * $averageCost;
            $rule = $rules->get($stock->product_id . ':' . $stock->warehouse_id) ?: $rules->get($stock->product_id . ':all');
            if ($available <= 0) $health['out_of_stock']++;
            elseif ($rule && $available <= (float) $rule->reorder_point) $health['low_stock']++;
            elseif ($rule && $rule->maximum_stock !== null && $onHand > (float) $rule->maximum_stock) $health['overstock']++;
            else $health['healthy']++;
        }
        $health['expiring_soon'] = InventoryBatch::when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->whereNotNull('expiry_date')->whereBetween('expiry_date', [now()->startOfDay(), now()->addDays(30)->endOfDay()])->count();
        $health['expired'] = InventoryBatch::when($request->filled('warehouse_id'), fn ($q) => $q->where('warehouse_id', $request->input('warehouse_id')))
            ->whereNotNull('expiry_date')->whereDate('expiry_date', '<', now()->startOfDay())->count();
        return response()->json(['data' => $health]);
    }

    public function scanAlerts(): JsonResponse
    {
        $created = 0;
        foreach (InventoryBatch::whereNotNull('expiry_date')->whereDate('expiry_date', '<=', now()->addDays(30))->get() as $batch) {
            $type = $batch->expiry_date->isPast() ? 'expired' : 'expiry_warning';
            $exists = InventoryAlert::where('alert_type', $type)->where('product_id', $batch->product_id)
                ->where('warehouse_id', $batch->warehouse_id)->where('status', 'open')
                ->whereJsonContains('context->batch_id', $batch->id)->exists();
            if (!$exists) {
                InventoryAlert::create([
                    'alert_type' => $type, 'product_id' => $batch->product_id, 'warehouse_id' => $batch->warehouse_id,
                    'severity' => $type === 'expired' ? 'critical' : 'warning',
                    'title' => $type === 'expired' ? 'Expired batch' : 'Batch expiring soon',
                    'message' => "Batch {$batch->batch_number} requires inventory review.",
                    'context' => ['batch_id' => $batch->id, 'expiry_date' => $batch->expiry_date->toDateString()],
                ]);
                if ($type === 'expired' && $batch->status !== 'expired') $batch->update(['status' => 'expired']);
                $created++;
            }
        }
        return response()->json(['data' => ['created' => $created]]);
    }
}
