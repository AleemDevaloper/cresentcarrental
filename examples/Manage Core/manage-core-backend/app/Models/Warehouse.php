<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    protected $fillable = ['name', 'location', 'capacity', 'manager_id'];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function finances(): HasMany
    {
        return $this->hasMany(WarehouseFinance::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(WarehouseLocation::class);
    }
}
