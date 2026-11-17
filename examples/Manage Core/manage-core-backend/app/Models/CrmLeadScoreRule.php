<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmLeadScoreRule extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_lead_score_rules';

    protected $fillable = [
        'name', 'category', 'event', 'points', 'is_active', 'sort_order', 'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'points' => 'integer',
        'sort_order' => 'integer',
    ];
}