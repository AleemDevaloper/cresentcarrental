<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryStockCountItem extends Model
{
    protected $fillable = [
        'stock_count_id', 'product_id', 'product_variant_id', 'batch_id', 'serial_id',
        'location_id', 'system_quantity', 'counted_quantity', 'difference', 'unit',
        'reason', 'notes', 'counted_by', 'counted_at',
    ];

    protected $casts = [
        'system_quantity' => 'decimal:4', 'counted_quantity' => 'decimal:4',
        'difference' => 'decimal:4', 'counted_at' => 'datetime',
    ];

    public function count(): BelongsTo { return $this->belongsTo(InventoryStockCount::class, 'stock_count_id'); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
}
