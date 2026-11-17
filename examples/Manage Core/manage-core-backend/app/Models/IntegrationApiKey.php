<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntegrationApiKey extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'name',
        'api_key',
        'scopes',
        'last_used_at',
        'is_active',
    ];

    protected $casts = [
        'scopes' => 'array',
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
