<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'name',
        'domain',
        'subdomain',
        'database',
        'status',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function modules(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'module_tenant')
                    ->withPivot(['status', 'license_type', 'license_key', 'expires_at', 'settings'])
                    ->withTimestamps();
    }
}
