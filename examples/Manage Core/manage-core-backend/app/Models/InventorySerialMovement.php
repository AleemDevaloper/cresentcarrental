<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventorySerialMovement extends Model
{
    protected $fillable = [
        'serial_id', 'movement_type', 'from_warehouse_id', 'to_warehouse_id',
        'from_location_id', 'to_location_id', 'source_type', 'source_id', 'notes', 'user_id',
    ];

    public function serial(): BelongsTo { return $this->belongsTo(InventorySerialNumber::class, 'serial_id'); }
}
