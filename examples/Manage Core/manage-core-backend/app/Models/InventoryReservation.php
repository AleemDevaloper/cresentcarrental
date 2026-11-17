<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryReservation extends Model
{
    protected $fillable = [
        'reservation_no', 'product_id', 'product_variant_id', 'warehouse_id',
        'location_id', 'quantity', 'source_type', 'source_id', 'status', 'created_by',
    ];

    protected $casts = ['quantity' => 'decimal:4'];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function location(): BelongsTo { return $this->belongsTo(WarehouseLocation::class, 'location_id'); }
}
