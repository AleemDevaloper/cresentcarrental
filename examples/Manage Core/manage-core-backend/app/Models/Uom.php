<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uom extends Model
{
    protected $fillable = [
        'name', 'symbol', 'category', 'is_base', 'conversion_multiplier', 'base_unit',
    ];

    protected $casts = [
        'is_base' => 'boolean',
        'conversion_multiplier' => 'decimal:10,4',
    ];
}
