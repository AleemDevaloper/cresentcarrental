<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    protected $fillable = [
        'code', 'name', 'display_name', 'account_type_id',
        'account_group_id', 'parent_id', 'description',
        'normal_balance', 'currency', 'is_active',
        'is_system_locked', 'opening_balance', 'current_balance',
        'sort_order', 'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_system_locked' => 'boolean',
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'sort_order' => 'integer',
    ];
}
