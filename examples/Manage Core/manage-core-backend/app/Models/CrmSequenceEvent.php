<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmSequenceEvent extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_sequence_events';

    protected $fillable = [
        'enrollment_id', 'step_id', 'event_type', 'payload', 'occurred_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'occurred_at' => 'datetime',
    ];

    public function enrollment()
    {
        return $this->belongsTo(CrmSequenceEnrollment::class, 'enrollment_id');
    }

    public function step()
    {
        return $this->belongsTo(CrmSequenceStep::class, 'step_id');
    }
}