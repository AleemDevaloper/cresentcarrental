<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryCostLayer extends Model
{
    protected $fillable = [
        'product_id', 'product_variant_id', 'warehouse_id', 'location_id', 'batch_id',
        'source_type', 'source_id', 'received_at', 'original_quantity', 'remaining_quantity',
        'unit_cost', 'status',
    ];

    protected $casts = [
        'received_at' => 'datetime', 'original_quantity' => 'decimal:4',
        'remaining_quantity' => 'decimal:4', 'unit_cost' => 'decimal:4',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
}
