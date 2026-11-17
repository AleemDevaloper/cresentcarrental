<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsScheduledJob extends Model
{
    protected $table = 'dms_scheduled_jobs';

    protected $fillable = [
        'tenant_id', 'name', 'type', 'status', 'configuration',
        'result', 'scheduled_at', 'started_at', 'completed_at', 'created_by',
    ];

    protected $casts = [
        'configuration' => 'array',
        'result' => 'array',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
