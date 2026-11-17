<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'product_code', 'name', 'sku', 'ean', 'alternate_barcode', 'category_id', 'brand_id', 'material_type',
        'product_type', 'default_unit',
        'purchase_cost', 'sales_price', 'initial_stock', 'min_stock', 'max_stock',
        'wholesale_price', 'retail_price', 'minimum_price', 'maximum_price',
        'track_inventory', 'track_batch', 'track_serial', 'track_expiry',
        'reorder_point', 'safety_stock', 'reorder_quantity', 'warehouse', 'bin_location',
        'costing_method', 'abc_class', 'tags', 'status',
    ];

    protected $casts = [
        'purchase_cost' => 'decimal:2',
        'sales_price' => 'decimal:2',
        'initial_stock' => 'integer',
        'min_stock' => 'integer',
        'max_stock' => 'integer',
        'reorder_point' => 'integer',
        'wholesale_price' => 'decimal:2',
        'retail_price' => 'decimal:2',
        'minimum_price' => 'decimal:2',
        'maximum_price' => 'decimal:2',
        'track_inventory' => 'boolean',
        'track_batch' => 'boolean',
        'track_serial' => 'boolean',
        'track_expiry' => 'boolean',
        'safety_stock' => 'decimal:2',
        'reorder_quantity' => 'decimal:2',
        'tags' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function stockLedger(): HasMany
    {
        return $this->hasMany(StockLedgerEntry::class);
    }

    public function stockTransfers(): HasMany
    {
        return $this->hasMany(StockTransfer::class);
    }

    public function batches(): HasMany
    {
        return $this->hasMany(InventoryBatch::class);
    }

    public function serialNumbers(): HasMany
    {
        return $this->hasMany(InventorySerialNumber::class);
    }
}
