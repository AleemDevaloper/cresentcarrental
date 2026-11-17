<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CostCenter extends Model
{
    protected $fillable = [
        'code', 'name', 'cost_type', 'annual_budget',
        'allocation_method', 'manager', 'department', 'branch', 'description',
    ];

    protected $casts = [
        'annual_budget' => 'decimal:2',
    ];
}
