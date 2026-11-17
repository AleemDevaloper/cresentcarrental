<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockLedgerEntry extends Model
{
    protected $fillable = [
        'reference_no', 'product_id', 'product_variant_id', 'warehouse_id', 'location_id',
        'movement_type', 'quantity', 'unit', 'batch_no', 'serial_no', 'unit_cost',
        'movement_date', 'user_id', 'source_type', 'source_id', 'reason', 'transaction_id',
        'quantity_in', 'quantity_out', 'net_quantity', 'total_cost', 'running_balance',
        'source_module', 'status', 'batch_id', 'serial_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'unit_cost' => 'decimal:4',
        'movement_date' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(WarehouseLocation::class, 'location_id');
    }

    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
    public function serial(): BelongsTo { return $this->belongsTo(InventorySerialNumber::class, 'serial_id'); }
}
