<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'name', 'sku', 'barcode', 'attributes', 'cost_price',
        'selling_price', 'weight', 'dimensions', 'is_active',
    ];

    protected $casts = [
        'attributes' => 'array',
        'dimensions' => 'array',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'weight' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
