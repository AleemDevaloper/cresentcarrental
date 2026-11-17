<?php

namespace App\Models\MFG;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialConsumption extends Model
{
    protected $table = 'mfg_material_consumptions';

    protected $fillable = [
        'work_order_id',
        'item_name',
        'planned_quantity',
        'actual_quantity',
        'unit',
        'unit_cost',
        'total_cost',
        'variance',
        'notes',
    ];

    protected $casts = [
        'planned_quantity' => 'decimal:4',
        'actual_quantity' => 'decimal:4',
        'unit_cost' => 'decimal:4',
        'total_cost' => 'decimal:2',
        'variance' => 'decimal:4',
    ];

    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }
}
