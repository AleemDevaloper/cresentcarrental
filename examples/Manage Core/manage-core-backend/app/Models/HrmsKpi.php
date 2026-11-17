<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HrmsKpi extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'unit',
        'target_value',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'target_value' => 'decimal:2',
    ];
}
