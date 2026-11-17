<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryStock extends Model
{
    protected $fillable = [
        'product_id', 'product_variant_id', 'warehouse_id', 'location_id',
        'batch_id', 'serial_id', 'on_hand', 'reserved', 'average_cost', 'last_movement_at',
    ];

    protected $casts = [
        'on_hand' => 'decimal:4',
        'reserved' => 'decimal:4',
        'average_cost' => 'decimal:4',
        'last_movement_at' => 'datetime',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function location(): BelongsTo { return $this->belongsTo(WarehouseLocation::class, 'location_id'); }
    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
    public function serial(): BelongsTo { return $this->belongsTo(InventorySerialNumber::class, 'serial_id'); }

    public function getAvailableAttribute(): float
    {
        return (float) $this->on_hand - (float) $this->reserved;
    }
}
