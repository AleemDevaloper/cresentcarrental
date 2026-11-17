<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryStockCount extends Model
{
    protected $fillable = [
        'count_number', 'warehouse_id', 'count_type', 'scheduled_date', 'started_at',
        'completed_at', 'status', 'blind_count', 'notes', 'created_by', 'approved_by',
        'approved_at', 'reconciled_at',
    ];

    protected $casts = [
        'scheduled_date' => 'date', 'started_at' => 'datetime', 'completed_at' => 'datetime',
        'blind_count' => 'boolean', 'approved_at' => 'datetime', 'reconciled_at' => 'datetime',
    ];

    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function items(): HasMany { return $this->hasMany(InventoryStockCountItem::class, 'stock_count_id'); }
}
