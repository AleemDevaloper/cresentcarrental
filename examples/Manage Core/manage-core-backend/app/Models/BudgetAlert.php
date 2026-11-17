<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetAlert extends Model
{
    protected $fillable = [
        'code', 'name', 'alert_category', 'severity',
        'trigger_limit', 'recipients', 'channels', 'description', 'status',
    ];

    protected $casts = [
        'trigger_limit' => 'decimal:5,2',
    ];
}
