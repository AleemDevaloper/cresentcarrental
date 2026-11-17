<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmAutomationCondition extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_automation_conditions';

    protected $fillable = [
        'automation_id', 'field', 'operator', 'value', 'logic', 'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function automation()
    {
        return $this->belongsTo(CrmAutomation::class, 'automation_id');
    }
}