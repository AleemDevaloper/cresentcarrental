<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    protected $fillable = [
        'category_id', 'name', 'asset_code', 'location', 
        'assigned_user_id', 'purchase_date', 'purchase_cost', 
        'current_value', 'warranty_expiry', 'status'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'warranty_expiry' => 'date',
        'purchase_cost' => 'decimal:2',
        'current_value' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'category_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(AssetMaintenance::class);
    }

    public function depreciations(): HasMany
    {
        return $this->hasMany(AssetDepreciation::class);
    }
}
