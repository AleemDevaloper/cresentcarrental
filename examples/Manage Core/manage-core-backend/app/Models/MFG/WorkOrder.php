<?php

namespace App\Models\MFG;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkOrder extends Model
{
    protected $table = 'mfg_work_orders';

    protected $fillable = [
        'work_order_number',
        'production_order_id',
        'bom_id',
        'status',
        'quantity_to_produce',
        'quantity_produced',
        'quantity_scrapped',
        'start_date',
        'end_date',
        'actual_end_date',
        'assigned_to',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'quantity_to_produce' => 'decimal:4',
        'quantity_produced' => 'decimal:4',
        'quantity_scrapped' => 'decimal:4',
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_end_date' => 'date',
    ];

    public function productionOrder(): BelongsTo
    {
        return $this->belongsTo(ProductionOrder::class, 'production_order_id');
    }

    public function bom(): BelongsTo
    {
        return $this->belongsTo(BillOfMaterial::class, 'bom_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function materialConsumptions(): HasMany
    {
        return $this->hasMany(MaterialConsumption::class, 'work_order_id');
    }
}
