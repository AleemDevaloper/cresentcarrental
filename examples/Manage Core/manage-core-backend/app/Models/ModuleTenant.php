<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleTenant extends Model
{
    protected $connection = 'mysql';

    protected $table = 'module_tenant';
    
    protected $fillable = [
        'tenant_id', 'module_id', 'status', 'license_type', 
        'license_key', 'expires_at', 'settings'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'settings' => 'array',
    ];
}
