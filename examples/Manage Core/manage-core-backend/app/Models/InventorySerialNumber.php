<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventorySerialNumber extends Model
{
    protected $fillable = [
        'serial_number', 'product_id', 'product_variant_id', 'batch_id', 'warehouse_id',
        'location_id', 'status', 'purchase_reference', 'receipt_reference', 'purchase_date',
        'warranty_start', 'warranty_end', 'customer_id', 'current_owner',
    ];

    protected $casts = [
        'purchase_date' => 'date', 'warranty_start' => 'date', 'warranty_end' => 'date',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }
    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function location(): BelongsTo { return $this->belongsTo(WarehouseLocation::class, 'location_id'); }
    public function movements(): HasMany { return $this->hasMany(InventorySerialMovement::class, 'serial_id'); }
}
