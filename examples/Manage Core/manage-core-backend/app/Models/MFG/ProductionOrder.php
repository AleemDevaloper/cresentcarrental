<?php

namespace App\Models\MFG;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductionOrder extends Model
{
    protected $table = 'mfg_production_orders';

    protected $fillable = [
        'order_number',
        'product_name',
        'product_id',
        'quantity',
        'unit',
        'status',
        'priority',
        'start_date',
        'end_date',
        'actual_end_date',
        'estimated_cost',
        'actual_cost',
        'notes',
        'created_by',
        'assigned_to',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_end_date' => 'date',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'production_order_id');
    }
}
