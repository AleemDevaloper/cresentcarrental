<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmAutomationRun extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_automation_runs';

    protected $fillable = [
        'automation_id', 'entity_type', 'entity_id', 'status',
        'context', 'result', 'error', 'actions_executed',
        'triggered_by', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'context' => 'array',
        'result' => 'array',
        'actions_executed' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function automation()
    {
        return $this->belongsTo(CrmAutomation::class, 'automation_id');
    }
}