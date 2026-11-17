<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiUsageLog extends Model
{
    protected $connection = 'mysql';

    protected $table = 'ai_usage_logs';

    protected $fillable = [
        'user_id', 'feature', 'provider', 'model', 'prompt', 'response',
        'input_tokens', 'output_tokens', 'cost', 'duration_ms',
        'status', 'error_message', 'ip', 'user_agent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
