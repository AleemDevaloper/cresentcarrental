<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmAutomationAction extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_automation_actions';

    protected $fillable = [
        'automation_id', 'type', 'params', 'order', 'delay_minutes',
    ];

    protected $casts = [
        'params' => 'array',
        'order' => 'integer',
        'delay_minutes' => 'integer',
    ];

    public function automation()
    {
        return $this->belongsTo(CrmAutomation::class, 'automation_id');
    }
}