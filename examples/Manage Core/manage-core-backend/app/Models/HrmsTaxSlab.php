<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HrmsTaxSlab extends Model
{
    protected $fillable = [
        'income_from',
        'income_to',
        'fixed_tax',
        'percentage',
        'is_active',
    ];

    protected $casts = [
        'income_from' => 'decimal:2',
        'income_to' => 'decimal:2',
        'fixed_tax' => 'decimal:2',
        'percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
