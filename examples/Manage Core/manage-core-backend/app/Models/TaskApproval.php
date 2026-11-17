<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskApproval extends Model
{
    protected $fillable = [
        'task_id',
        'submitted_by',
        'approved_by',
        'status',
        'notes',
        'rejection_reason',
        'submitted_at',
        'resolved_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    protected $table = 'task_approvals';

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
