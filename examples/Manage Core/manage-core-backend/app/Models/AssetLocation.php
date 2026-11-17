<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetLocation extends Model
{
    protected $fillable = [
        'code', 'name', 'location_type', 'max_capacity', 'address', 'description',
    ];

    protected $casts = [
        'max_capacity' => 'integer',
    ];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'location');
    }
}
