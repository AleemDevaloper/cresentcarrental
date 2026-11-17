<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'code',
        'days_allowed',
        'is_active',
        'requires_approval',
        'color',
        'description',
    ];

    protected $casts = [
        'days_allowed' => 'integer',
        'is_active' => 'boolean',
        'requires_approval' => 'boolean',
    ];
}
