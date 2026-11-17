<?php

namespace App\Models\MFG;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillOfMaterial extends Model
{
    protected $table = 'mfg_boms';

    protected $fillable = [
        'bom_code',
        'name',
        'product_name',
        'product_id',
        'version',
        'status',
        'description',
        'total_cost',
        'created_by',
    ];

    protected $casts = [
        'total_cost' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BomItem::class, 'bom_id');
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'bom_id');
    }
}
