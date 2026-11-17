<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDepreciation extends Model
{
    protected $fillable = ['asset_id', 'amount', 'entry_date', 'remaining_value'];

    protected $casts = [
        'amount' => 'decimal:2',
        'entry_date' => 'date',
        'remaining_value' => 'decimal:2',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
