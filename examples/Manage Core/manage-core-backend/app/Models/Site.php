<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'radius',
        'qr_code',
        'status',
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function geoFences(): HasMany
    {
        return $this->hasMany(SiteGeoFence::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(SiteAssignment::class);
    }

    public function activeAssignments(): HasMany
    {
        return $this->hasMany(SiteAssignment::class)->where('is_active', true);
    }

    public function biometricDevices(): HasMany
    {
        return $this->hasMany(BiometricDevice::class);
    }
}
