<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $connection = 'mysql';

    protected $fillable = [
        'name', 'code', 'version', 'status', 'description', 
        'dependencies', 'category', 'base_price', 'settings'
    ];

    protected $casts = [
        'dependencies' => 'array',
        'settings' => 'array',
    ];

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'module_tenant')
                    ->withPivot(['status', 'license_type', 'license_key', 'expires_at', 'settings'])
                    ->withTimestamps();
    }

    public function features(): HasMany
    {
        return $this->hasMany(ModuleFeature::class);
    }
}
