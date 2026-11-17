<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDisposal extends Model
{
    protected $fillable = [
        'asset_id', 'asset_name', 'disposal_type', 'book_value',
        'accum_depreciation', 'sale_price', 'scrap_value', 'recipient', 'reason', 'disposal_date',
    ];

    protected $casts = [
        'book_value' => 'decimal:2',
        'accum_depreciation' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'scrap_value' => 'decimal:2',
        'disposal_date' => 'date',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
