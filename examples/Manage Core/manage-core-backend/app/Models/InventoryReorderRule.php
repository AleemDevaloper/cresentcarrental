<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryReorderRule extends Model
{
    protected $fillable = [
        'product_id', 'product_variant_id', 'warehouse_id', 'minimum_stock', 'maximum_stock',
        'reorder_point', 'reorder_quantity', 'safety_stock', 'lead_time_days',
        'supplier_pack_multiple', 'preferred_supplier_id', 'is_active',
    ];

    protected $casts = [
        'minimum_stock' => 'decimal:4', 'maximum_stock' => 'decimal:4',
        'reorder_point' => 'decimal:4', 'reorder_quantity' => 'decimal:4',
        'safety_stock' => 'decimal:4', 'supplier_pack_multiple' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
}
