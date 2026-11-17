<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmTask extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_tasks';

    protected $fillable = [
        'title', 'description', 'status', 'priority',
        'start_date', 'due_date', 'reminder_at', 'completed_at',
        'recurrence', 'assigned_to', 'created_by',
        'customer_id', 'lead_id', 'deal_id', 'contact_id', 'tags',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'due_date' => 'datetime',
        'reminder_at' => 'datetime',
        'completed_at' => 'datetime',
        'recurrence' => 'array',
        'tags' => 'array',
    ];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(CrmLead::class, 'lead_id');
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(CrmDeal::class, 'deal_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function isOverdue(): bool
    {
        return $this->due_date
            && $this->due_date->isPast()
            && !in_array($this->status, ['done', 'cancelled']);
    }
}