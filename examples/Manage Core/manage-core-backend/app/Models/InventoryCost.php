<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryCost extends Model
{
    protected $fillable = ['inventory_item_id', 'unit_cost', 'prev_cost', 'variance', 'effective_date', 'vendor_reference'];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'prev_cost' => 'decimal:2',
        'variance' => 'decimal:2',
        'effective_date' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
