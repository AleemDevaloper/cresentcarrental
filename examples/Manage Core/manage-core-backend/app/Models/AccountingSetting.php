<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountingSetting extends Model
{
    protected $fillable = [
        'key', 'value', 'group', 'type', 'description',
        'is_system', 'sort_order',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'sort_order' => 'integer',
    ];
}
