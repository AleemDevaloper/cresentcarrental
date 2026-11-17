<?php

namespace App\Services;

use App\Models\InventoryReservation;
use App\Models\InventoryStock;
use App\Models\StockLedgerEntry;
use App\Models\InventoryBatch;
use App\Models\InventoryCostLayer;
use App\Models\InventorySerialNumber;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryStockService
{
    public function postMovement(array $data): StockLedgerEntry
    {
        return DB::transaction(function () use ($data) {
            $quantity = (float) $data['quantity'];
            $isIn = $quantity > 0;
            $batch = !empty($data['batch_id']) ? InventoryBatch::lockForUpdate()->findOrFail($data['batch_id']) : null;
            if ($batch && $batch->status !== 'active' && $batch->status !== 'released' && !$isIn) {
                throw ValidationException::withMessages(['batch_id' => 'This batch is not available for issue.']);
            }
            if ($batch && $batch->expiry_date && $batch->expiry_date->isPast() && !$isIn) {
                throw ValidationException::withMessages(['batch_id' => 'Expired batches cannot be issued.']);
            }
            $serial = !empty($data['serial_id']) ? InventorySerialNumber::lockForUpdate()->findOrFail($data['serial_id']) : null;
            if ($serial && !$isIn && !in_array($serial->status, ['available', 'reserved', 'returned'], true)) {
                throw ValidationException::withMessages(['serial_id' => 'This serial number is not available for issue.']);
            }
            $stock = InventoryStock::where('product_id', $data['product_id'])
                ->where('warehouse_id', $data['warehouse_id'])
                ->where('product_variant_id', $data['product_variant_id'] ?? null)
                ->where('location_id', $data['location_id'] ?? null)
                ->where('batch_id', $data['batch_id'] ?? null)
                ->where('serial_id', $data['serial_id'] ?? null)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                $stock = InventoryStock::create([
                    'product_id' => $data['product_id'],
                    'product_variant_id' => $data['product_variant_id'] ?? null,
                    'warehouse_id' => $data['warehouse_id'],
                    'location_id' => $data['location_id'] ?? null,
                    'batch_id' => $data['batch_id'] ?? null,
                    'serial_id' => $data['serial_id'] ?? null,
                ]);
            }

            if (!$isIn && $stock->available < abs($quantity)) {
                throw ValidationException::withMessages(['quantity' => 'Insufficient available stock for this issue.']);
            }

            $unitCost = (float) ($data['unit_cost'] ?? $stock->average_cost ?? 0);
            $oldOnHand = (float) $stock->on_hand;
            $newOnHand = $oldOnHand + $quantity;
            $stock->update([
                'on_hand' => $newOnHand,
                'average_cost' => $isIn && $newOnHand > 0
                    ? (($oldOnHand * (float) $stock->average_cost) + ($quantity * $unitCost)) / $newOnHand
                    : $stock->average_cost,
                'last_movement_at' => now(),
            ]);
            if ($batch) {
                $batch->update([
                    'on_hand_quantity' => (float) $batch->on_hand_quantity + $quantity,
                    'issued_quantity' => (float) $batch->issued_quantity + ($isIn ? 0 : abs($quantity)),
                    'status' => (!$isIn && ((float) $batch->on_hand_quantity + $quantity) <= 0) ? 'depleted' : $batch->status,
                ]);
            }

            $entry = StockLedgerEntry::create([
                ...$data,
                'transaction_id' => $data['transaction_id'] ?? (string) Str::uuid(),
                'quantity' => $quantity,
                'quantity_in' => $isIn ? $quantity : 0,
                'quantity_out' => $isIn ? 0 : abs($quantity),
                'net_quantity' => $quantity,
                'unit_cost' => $unitCost,
                'total_cost' => abs($quantity) * $unitCost,
                'running_balance' => $newOnHand,
                'movement_date' => $data['movement_date'] ?? now(),
                'source_module' => $data['source_module'] ?? 'inventory',
                'status' => 'posted',
            ]);
            if ($isIn) {
                InventoryCostLayer::create([
                    'product_id' => $data['product_id'],
                    'product_variant_id' => $data['product_variant_id'] ?? null,
                    'warehouse_id' => $data['warehouse_id'],
                    'location_id' => $data['location_id'] ?? null,
                    'batch_id' => $data['batch_id'] ?? null,
                    'source_type' => $data['source_type'] ?? null,
                    'source_id' => $data['source_id'] ?? null,
                    'received_at' => $data['movement_date'] ?? now(),
                    'original_quantity' => $quantity,
                    'remaining_quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'status' => 'open',
                ]);
            }
            if ($serial) {
                $serial->update([
                    'status' => $isIn ? 'available' : 'sold',
                    'warehouse_id' => $isIn ? $data['warehouse_id'] : null,
                    'location_id' => $isIn ? ($data['location_id'] ?? null) : null,
                ]);
            }
            return $entry;
        });
    }

    public function reserve(array $data): InventoryReservation
    {
        return DB::transaction(function () use ($data) {
            $stock = InventoryStock::where('product_id', $data['product_id'])
                ->where('warehouse_id', $data['warehouse_id'])
                ->where('product_variant_id', $data['product_variant_id'] ?? null)
                ->where('location_id', $data['location_id'] ?? null)
                ->lockForUpdate()->first();
            if (!$stock || $stock->available < (float) $data['quantity']) {
                throw ValidationException::withMessages(['quantity' => 'Insufficient available stock to reserve.']);
            }
            $stock->increment('reserved', $data['quantity']);
            return InventoryReservation::create([
                ...$data,
                'reservation_no' => $data['reservation_no'] ?? 'RSV-' . strtoupper(Str::random(10)),
                'status' => 'active',
                'created_by' => $data['created_by'] ?? auth()->id(),
            ]);
        });
    }
}
