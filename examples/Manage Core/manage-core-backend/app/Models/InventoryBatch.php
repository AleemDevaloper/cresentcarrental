<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryBatch extends Model
{
    protected $fillable = [
        'batch_number', 'manufacturer_batch_number', 'product_id', 'product_variant_id',
        'warehouse_id', 'location_id', 'manufacturing_date', 'expiry_date', 'received_date',
        'original_quantity', 'reserved_quantity', 'unit_cost', 'supplier_id', 'status',
        'on_hand_quantity', 'issued_quantity', 'notes', 'created_by',
    ];

    protected $casts = [
        'manufacturing_date' => 'date', 'expiry_date' => 'date', 'received_date' => 'date',
        'original_quantity' => 'decimal:4', 'on_hand_quantity' => 'decimal:4', 'issued_quantity' => 'decimal:4',
        'reserved_quantity' => 'decimal:4', 'unit_cost' => 'decimal:4',
    ];

    protected $appends = ['available_quantity', 'expiry_status', 'days_remaining'];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function location(): BelongsTo { return $this->belongsTo(WarehouseLocation::class, 'location_id'); }
    public function serials(): HasMany { return $this->hasMany(InventorySerialNumber::class, 'batch_id'); }
    public function costLayers(): HasMany { return $this->hasMany(InventoryCostLayer::class, 'batch_id'); }

    public function getAvailableQuantityAttribute(): float
    {
        return (float) $this->on_hand_quantity - (float) $this->reserved_quantity;
    }

    public function getDaysRemainingAttribute(): ?int
    {
        return $this->expiry_date ? now()->startOfDay()->diffInDays($this->expiry_date, false) : null;
    }

    public function getExpiryStatusAttribute(): string
    {
        if (!$this->expiry_date) return 'no_expiry';
        if ($this->expiry_date->isPast()) return 'expired';
        if ($this->expiry_date->lte(now()->addDays(30)->startOfDay())) return 'expiring_soon';
        return 'fresh';
    }
}
