<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmSequenceStep extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_sequence_steps';

    protected $fillable = [
        'sequence_id', 'order', 'name', 'type', 'delay_days', 'delay_hours',
        'send_time', 'template_id', 'conditions', 'settings',
    ];

    protected $casts = [
        'order' => 'integer',
        'delay_days' => 'integer',
        'delay_hours' => 'integer',
        'conditions' => 'array',
        'settings' => 'array',
    ];

    public function sequence()
    {
        return $this->belongsTo(CrmSequence::class, 'sequence_id');
    }

    public function template()
    {
        return $this->belongsTo(CrmEmailTemplate::class, 'template_id');
    }
}