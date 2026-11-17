<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryBatch;
use App\Models\InventorySerialNumber;
use App\Services\InventoryStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchasingController extends Controller
{
    public function supplierProducts(Request $request): JsonResponse
    {
        $items = DB::table('supplier_products')->join('vendors', 'vendors.id', '=', 'supplier_products.vendor_id')
            ->join('products', 'products.id', '=', 'supplier_products.product_id')
            ->select('supplier_products.*', 'vendors.name as vendor_name', 'products.name as product_name', 'products.sku')
            ->when($request->filled('vendor_id'), fn ($q) => $q->where('vendor_id', $request->input('vendor_id')))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->input('product_id')))
            ->when($request->filled('search'), fn ($q) => $q->where(function ($w) use ($request) {
                $term = '%' . $request->input('search') . '%';
                $w->where('supplier_sku', 'like', $term)->orWhere('products.name', 'like', $term)->orWhere('products.sku', 'like', $term);
            }))->orderBy('products.name')->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storeSupplierProduct(Request $request): JsonResponse
    {
        $data = $request->validate([
            'vendor_id' => 'required|exists:vendors,id', 'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id', 'supplier_sku' => 'nullable|string|max:100',
            'supplier_barcode' => 'nullable|string|max:100', 'purchase_unit' => 'nullable|string|max:50',
            'conversion_factor' => 'nullable|numeric|gt:0', 'minimum_order_quantity' => 'nullable|numeric|min:0',
            'order_multiple' => 'nullable|numeric|gt:0', 'lead_time_days' => 'nullable|integer|min:0',
            'last_purchase_price' => 'nullable|numeric|min:0', 'currency' => 'nullable|string|max:10',
            'is_preferred' => 'nullable|boolean', 'status' => 'nullable|in:active,inactive',
        ]);
        $id = DB::table('supplier_products')->insertGetId([...$data, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => DB::table('supplier_products')->find($id)], 201);
    }

    public function requisitions(Request $request): JsonResponse
    {
        return $this->paginate('purchase_requisitions', $request, ['status', 'warehouse_id'], 'created_at');
    }

    public function storeRequisition(Request $request): JsonResponse
    {
        $data = $request->validate([
            'warehouse_id' => 'nullable|exists:warehouses,id', 'requesting_department' => 'nullable|string|max:150',
            'required_date' => 'nullable|date', 'priority' => 'nullable|in:low,normal,high,urgent',
            'reason' => 'nullable|string', 'notes' => 'nullable|string',
            'items' => 'required|array|min:1', 'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id', 'items.*.quantity' => 'required|numeric|gt:0',
            'items.*.unit' => 'nullable|string|max:50', 'items.*.estimated_unit_cost' => 'nullable|numeric|min:0',
        ]);
        $id = DB::transaction(function () use ($data) {
            $items = $data['items']; unset($data['items']);
            $id = DB::table('purchase_requisitions')->insertGetId([...$data, 'pr_number' => 'PR-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4)), 'requested_by' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
            foreach ($items as $item) DB::table('purchase_requisition_items')->insert([...$item, 'requisition_id' => $id, 'created_at' => now(), 'updated_at' => now()]);
            return $id;
        });
        return response()->json(['data' => DB::table('purchase_requisitions')->find($id)], 201);
    }

    public function purchaseOrders(Request $request): JsonResponse
    {
        $query = DB::table('purchase_orders')->join('vendors', 'vendors.id', '=', 'purchase_orders.vendor_id')
            ->select('purchase_orders.*', 'vendors.name as vendor_name')
            ->when($request->filled('status'), fn ($q) => $q->where('purchase_orders.status', $request->input('status')))
            ->when($request->filled('vendor_id'), fn ($q) => $q->where('purchase_orders.vendor_id', $request->input('vendor_id')))
            ->when($request->filled('warehouse_id'), fn ($q) => $q->where('purchase_orders.warehouse_id', $request->input('warehouse_id')))
            ->latest('purchase_orders.created_at');
        $items = $query->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function storePurchaseOrder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'vendor_id' => 'required|exists:vendors,id', 'warehouse_id' => 'required|exists:warehouses,id',
            'order_date' => 'required|date', 'expected_delivery_date' => 'nullable|date', 'currency' => 'nullable|string|max:10',
            'exchange_rate' => 'nullable|numeric|gt:0', 'payment_terms' => 'nullable|string|max:100',
            'delivery_terms' => 'nullable|string|max:100', 'over_receipt_tolerance' => 'nullable|numeric|min:0|max:100',
            'items' => 'required|array|min:1', 'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id', 'items.*.quantity' => 'required|numeric|gt:0',
            'items.*.unit' => 'nullable|string|max:50', 'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_amount' => 'nullable|numeric|min:0', 'items.*.location_id' => 'nullable|exists:warehouse_locations,id',
        ]);
        $id = DB::transaction(function () use ($data) {
            $items = $data['items']; unset($data['items']);
            $subtotal = collect($items)->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);
            $tax = collect($items)->sum(fn ($item) => (float) ($item['tax_amount'] ?? 0));
            $id = DB::table('purchase_orders')->insertGetId([...$data, 'po_number' => 'PO-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4)), 'subtotal' => $subtotal, 'tax_amount' => $tax, 'total_amount' => $subtotal + $tax, 'created_by' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
            foreach ($items as $item) DB::table('purchase_order_items')->insert([...$item, 'purchase_order_id' => $id, 'total_amount' => ((float) $item['quantity'] * (float) $item['unit_price']) + (float) ($item['tax_amount'] ?? 0), 'created_at' => now(), 'updated_at' => now()]);
            return $id;
        });
        return response()->json(['data' => DB::table('purchase_orders')->find($id)], 201);
    }

    public function approvePurchaseOrder(int $purchaseOrder): JsonResponse
    {
        $updated = DB::table('purchase_orders')->where('id', $purchaseOrder)->whereIn('status', ['draft', 'submitted', 'pending_approval'])->update(['status' => 'approved', 'updated_at' => now()]);
        if (!$updated) return response()->json(['message' => 'Purchase order cannot be approved in its current state.'], 422);
        return response()->json(['data' => DB::table('purchase_orders')->find($purchaseOrder)]);
    }

    public function goodsReceipts(Request $request): JsonResponse
    {
        return $this->paginate('goods_receipts', $request, ['status', 'vendor_id', 'warehouse_id'], 'created_at');
    }

    public function storeGoodsReceipt(Request $request): JsonResponse
    {
        $data = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id', 'receipt_date' => 'required|date',
            'delivery_note_number' => 'nullable|string|max:100', 'supplier_invoice_reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string', 'items' => 'required|array|min:1', 'items.*.purchase_order_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.received_quantity' => 'required|numeric|gt:0', 'items.*.accepted_quantity' => 'required|numeric|min:0',
            'items.*.rejected_quantity' => 'nullable|numeric|min:0', 'items.*.damaged_quantity' => 'nullable|numeric|min:0',
            'items.*.unit_cost' => 'required|numeric|min:0', 'items.*.batch_id' => 'nullable|exists:inventory_batches,id',
            'items.*.batch_number' => 'nullable|string|max:100', 'items.*.manufacturing_date' => 'nullable|date',
            'items.*.expiry_date' => 'nullable|date', 'items.*.serial_numbers' => 'nullable|array',
            'items.*.location_id' => 'nullable|exists:warehouse_locations,id',
        ]);
        $po = DB::table('purchase_orders')->where('id', $data['purchase_order_id'])->first();
        if (!$po || !in_array($po->status, ['approved', 'sent_to_supplier', 'partially_received'], true)) return response()->json(['message' => 'Purchase order must be approved before receiving.'], 422);
        $id = DB::transaction(function () use ($data, $po) {
            $items = $data['items']; unset($data['items']);
            $first = DB::table('purchase_order_items')->where('purchase_order_id', $po->id)->first();
            $id = DB::table('goods_receipts')->insertGetId([...$data, 'vendor_id' => $po->vendor_id, 'warehouse_id' => $po->warehouse_id, 'grn_number' => 'GRN-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4)), 'status' => 'draft', 'received_by' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
            foreach ($items as $item) {
                $poItem = DB::table('purchase_order_items')->lockForUpdate()->find($item['purchase_order_item_id']);
                if (!$poItem || $poItem->purchase_order_id !== $po->id) abort(422, 'Receipt item does not belong to this purchase order.');
                $allowed = (float) $poItem->quantity * (1 + ((float) $po->over_receipt_tolerance / 100));
                if ((float) $poItem->received_quantity + (float) $item['received_quantity'] > $allowed) abort(422, 'Receipt exceeds the allowed purchase order quantity.');
                DB::table('goods_receipt_items')->insert([...$item, 'goods_receipt_id' => $id, 'product_id' => $poItem->product_id, 'product_variant_id' => $poItem->product_variant_id, 'ordered_quantity' => $poItem->quantity, 'accepted_quantity' => $item['accepted_quantity'], 'rejected_quantity' => $item['rejected_quantity'] ?? 0, 'damaged_quantity' => $item['damaged_quantity'] ?? 0, 'created_at' => now(), 'updated_at' => now()]);
            }
            return $id;
        });
        return response()->json(['data' => DB::table('goods_receipts')->find($id)], 201);
    }

    public function postGoodsReceipt(int $goodsReceipt, InventoryStockService $stockService): JsonResponse
    {
        DB::transaction(function () use ($goodsReceipt, $stockService) {
            $grn = DB::table('goods_receipts')->where('id', $goodsReceipt)->lockForUpdate()->first();
            if (!$grn || $grn->status !== 'draft') abort(422, 'Only a draft goods receipt can be posted.');
            $po = $grn->purchase_order_id ? DB::table('purchase_orders')->find($grn->purchase_order_id) : null;
            foreach (DB::table('goods_receipt_items')->where('goods_receipt_id', $grn->id)->get() as $item) {
                if ((float) $item->accepted_quantity <= 0) continue;
                $batchId = $item->batch_id;
                if ($item->batch_number) {
                    $batch = InventoryBatch::firstOrCreate(
                        ['batch_number' => $item->batch_number, 'product_id' => $item->product_id, 'warehouse_id' => $grn->warehouse_id],
                        ['product_variant_id' => $item->product_variant_id, 'location_id' => $item->location_id, 'expiry_date' => $item->expiry_date, 'manufacturing_date' => $item->manufacturing_date, 'received_date' => $grn->receipt_date, 'original_quantity' => 0, 'unit_cost' => $item->unit_cost, 'created_by' => auth()->id()]
                    );
                    $batchId = $batch->id;
                }
                $serials = json_decode($item->serial_numbers ?: '[]', true) ?: [];
                if ($serials && count($serials) !== (int) $item->accepted_quantity) abort(422, 'Serial count must equal accepted quantity.');
                if ($serials) foreach ($serials as $serialNumber) {
                    $serial = InventorySerialNumber::create(['serial_number' => $serialNumber, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'batch_id' => $batchId, 'warehouse_id' => $grn->warehouse_id, 'location_id' => $item->location_id, 'status' => 'available', 'receipt_reference' => $grn->grn_number, 'purchase_date' => $grn->receipt_date]);
                    $stockService->postMovement(['reference_no' => $grn->grn_number, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'warehouse_id' => $grn->warehouse_id, 'location_id' => $item->location_id, 'batch_id' => $batchId, 'serial_id' => $serial->id, 'movement_type' => 'receipt', 'quantity' => 1, 'unit_cost' => $item->unit_cost, 'source_type' => 'goods_receipt', 'source_id' => (string) $grn->id]);
                }
                elseif ($item->batch_id || $item->batch_number) {
                    $stockService->postMovement(['reference_no' => $grn->grn_number, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'warehouse_id' => $grn->warehouse_id, 'location_id' => $item->location_id, 'batch_id' => $batchId, 'movement_type' => 'receipt', 'quantity' => $item->accepted_quantity, 'unit_cost' => $item->unit_cost, 'source_type' => 'goods_receipt', 'source_id' => (string) $grn->id]);
                }
                else {
                    $stockService->postMovement(['reference_no' => $grn->grn_number, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'warehouse_id' => $grn->warehouse_id, 'location_id' => $item->location_id, 'movement_type' => 'receipt', 'quantity' => $item->accepted_quantity, 'unit_cost' => $item->unit_cost, 'source_type' => 'goods_receipt', 'source_id' => (string) $grn->id]);
                }
                DB::table('purchase_order_items')->where('id', $item->purchase_order_item_id)->increment('received_quantity', $item->accepted_quantity);
                DB::table('purchase_price_history')->insert(['vendor_id' => $grn->vendor_id, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'purchase_order_id' => $grn->purchase_order_id, 'goods_receipt_id' => $grn->id, 'quantity' => $item->accepted_quantity, 'unit_cost' => $item->unit_cost, 'receipt_date' => $grn->receipt_date, 'created_at' => now(), 'updated_at' => now()]);
            }
            $grn->status = 'posted'; DB::table('goods_receipts')->where('id', $grn->id)->update(['status' => 'posted', 'updated_at' => now()]);
            if ($po) {
                $remaining = DB::table('purchase_order_items')->where('purchase_order_id', $po->id)->whereColumn('received_quantity', '<', 'quantity')->exists();
                DB::table('purchase_orders')->where('id', $po->id)->update(['status' => $remaining ? 'partially_received' : 'fully_received', 'updated_at' => now()]);
            }
        });
        return response()->json(['data' => DB::table('goods_receipts')->find($goodsReceipt)]);
    }

    public function purchaseReturns(Request $request): JsonResponse
    {
        return $this->paginate('purchase_returns', $request, ['status', 'vendor_id', 'warehouse_id'], 'created_at');
    }

    public function storePurchaseReturn(Request $request): JsonResponse
    {
        $data = $request->validate([
            'vendor_id' => 'required|exists:vendors,id', 'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'goods_receipt_id' => 'nullable|exists:goods_receipts,id', 'warehouse_id' => 'required|exists:warehouses,id',
            'reason' => 'required|string|max:100', 'notes' => 'nullable|string', 'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id', 'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|numeric|gt:0', 'items.*.unit_cost' => 'nullable|numeric|min:0',
            'items.*.batch_id' => 'nullable|exists:inventory_batches,id', 'items.*.serial_id' => 'nullable|exists:inventory_serial_numbers,id',
            'items.*.location_id' => 'nullable|exists:warehouse_locations,id',
        ]);
        $id = DB::transaction(function () use ($data) {
            $items = $data['items']; unset($data['items']);
            $id = DB::table('purchase_returns')->insertGetId([...$data, 'return_number' => 'PRN-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4)), 'created_by' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
            foreach ($items as $item) DB::table('purchase_return_items')->insert([...$item, 'purchase_return_id' => $id, 'created_at' => now(), 'updated_at' => now()]);
            return $id;
        });
        return response()->json(['data' => DB::table('purchase_returns')->find($id)], 201);
    }

    public function postPurchaseReturn(int $purchaseReturn, InventoryStockService $stockService): JsonResponse
    {
        DB::transaction(function () use ($purchaseReturn, $stockService) {
            $return = DB::table('purchase_returns')->where('id', $purchaseReturn)->lockForUpdate()->first();
            if (!$return || $return->status !== 'draft') abort(422, 'Only a draft purchase return can be posted.');
            foreach (DB::table('purchase_return_items')->where('purchase_return_id', $return->id)->get() as $item) {
                $stockService->postMovement(['reference_no' => $return->return_number, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'warehouse_id' => $return->warehouse_id, 'location_id' => $item->location_id, 'batch_id' => $item->batch_id, 'serial_id' => $item->serial_id, 'movement_type' => 'purchase_return', 'quantity' => -abs((float) $item->quantity), 'unit_cost' => $item->unit_cost, 'source_type' => 'purchase_return', 'source_id' => (string) $return->id, 'reason' => $return->reason]);
            }
            DB::table('purchase_returns')->where('id', $return->id)->update(['status' => 'completed', 'updated_at' => now()]);
        });
        return response()->json(['data' => DB::table('purchase_returns')->find($purchaseReturn)]);
    }

    private function paginate(string $table, Request $request, array $filters, string $order): JsonResponse
    {
        $query = DB::table($table);
        foreach ($filters as $field) $query->when($request->filled($field), fn ($q) => $q->where($field, $request->input($field)));
        $items = $query->latest($order)->paginate($request->integer('per_page', 25));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }
}
