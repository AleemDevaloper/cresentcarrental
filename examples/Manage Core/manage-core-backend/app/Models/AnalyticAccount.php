<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticAccount extends Model
{
    protected $fillable = [
        'code', 'name', 'account_type', 'budget_assigned',
        'linked_project', 'customer', 'contract_id', 'gl_revenue_account', 'description',
    ];

    protected $casts = [
        'budget_assigned' => 'decimal:2',
    ];
}
