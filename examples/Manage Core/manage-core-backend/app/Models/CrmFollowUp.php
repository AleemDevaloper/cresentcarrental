<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmFollowUp extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_followups';

    protected $fillable = [
        'subject', 'description', 'type', 'status', 'priority',
        'due_at', 'reminder_at', 'completed_at', 'cancelled_at',
        'attempt_count', 'source', 'sequence_id', 'sequence_enrollment_id', 'template_id',
        'owner_id', 'lead_id', 'contact_id', 'customer_id', 'deal_id', 'assigned_to',
        'result', 'created_by',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'reminder_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'attempt_count' => 'integer',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function template()
    {
        return $this->belongsTo(CrmEmailTemplate::class, 'template_id');
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

    public function sequence()
    {
        return $this->belongsTo(CrmSequence::class, 'sequence_id');
    }

    public function isOverdue(): bool
    {
        return in_array($this->status, ['pending', 'due']) &&
               $this->due_at && $this->due_at->isPast();
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }

    public function scopeOverdue($q)
    {
        return $q->whereIn('status', ['pending', 'due'])
                 ->where('due_at', '<', now());
    }
}