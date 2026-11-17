<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmAutomationTrigger extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_automation_triggers';

    protected $fillable = [
        'automation_id', 'event', 'conditions', 'order',
    ];

    protected $casts = [
        'conditions' => 'array',
        'order' => 'integer',
    ];

    public function automation()
    {
        return $this->belongsTo(CrmAutomation::class, 'automation_id');
    }
}