<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmSequenceEnrollment extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_sequence_enrollments';

    protected $fillable = [
        'sequence_id', 'current_step_id', 'lead_id', 'contact_id',
        'customer_id', 'deal_id', 'owner_id', 'status',
        'enrolled_at', 'next_step_at', 'completed_at', 'stopped_at',
        'stop_reason', 'step_count', 'created_by',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'next_step_at' => 'datetime',
        'completed_at' => 'datetime',
        'stopped_at' => 'datetime',
        'step_count' => 'integer',
    ];

    public function sequence()
    {
        return $this->belongsTo(CrmSequence::class, 'sequence_id');
    }

    public function currentStep()
    {
        return $this->belongsTo(CrmSequenceStep::class, 'current_step_id');
    }

    public function lead()
    {
        return $this->belongsTo(CrmLead::class, 'lead_id');
    }

    public function contact()
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function customer()
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function deal()
    {
        return $this->belongsTo(CrmDeal::class, 'deal_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function events()
    {
        return $this->hasMany(CrmSequenceEvent::class, 'enrollment_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function stop(string $reason): void
    {
        $this->update([
            'status' => 'stopped',
            'stopped_at' => now(),
            'stop_reason' => $reason,
        ]);
    }

    public function complete(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }
}