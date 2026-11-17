<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteGeoFence extends Model
{
    protected $table = 'geo_fences';

    protected $fillable = [
        'site_id',
        'name',
        'type',
        'coordinates',
        'radius',
        'is_active',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'radius' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
