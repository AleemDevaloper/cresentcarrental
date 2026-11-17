<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetClearance extends Model
{
    protected $fillable = [
        'user_id', 'asset_name', 'asset_code', 'return_date', 'condition', 'status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
