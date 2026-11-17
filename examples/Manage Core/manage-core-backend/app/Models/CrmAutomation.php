<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmAutomation extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_automations';

    protected $fillable = [
        'name', 'description', 'entity_type', 'is_active', 'test_mode',
        'execution_count', 'success_count', 'failure_count',
        'max_executions_per_record', 'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'test_mode' => 'boolean',
        'execution_count' => 'integer',
        'success_count' => 'integer',
        'failure_count' => 'integer',
        'max_executions_per_record' => 'integer',
    ];

    public function triggers()
    {
        return $this->hasMany(CrmAutomationTrigger::class, 'automation_id')->orderBy('order');
    }

    public function conditions()
    {
        return $this->hasMany(CrmAutomationCondition::class, 'automation_id')->orderBy('order');
    }

    public function actions()
    {
        return $this->hasMany(CrmAutomationAction::class, 'automation_id')->orderBy('order');
    }

    public function runs()
    {
        return $this->hasMany(CrmAutomationRun::class, 'automation_id')->orderBy('started_at', 'desc');
    }
}