<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryAlert extends Model
{
    protected $fillable = [
        'alert_type', 'product_id', 'warehouse_id', 'severity', 'title', 'message',
        'context', 'status', 'resolved_by', 'resolved_at',
    ];

    protected $casts = ['context' => 'array', 'resolved_at' => 'datetime'];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
}
