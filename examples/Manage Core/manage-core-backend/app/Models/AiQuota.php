<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiQuota extends Model
{
    protected $connection = 'mysql';

    protected $table = 'ai_quotas';

    protected $fillable = [
        'organization', 'request_limit', 'token_limit', 'cost_limit', 'period', 'enabled',
    ];

    protected $casts = [
        'request_limit' => 'integer',
        'token_limit' => 'integer',
        'cost_limit' => 'float',
        'enabled' => 'boolean',
    ];
}
