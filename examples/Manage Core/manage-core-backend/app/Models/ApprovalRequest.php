<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ApprovalRequest extends Model
{
    protected $fillable = [
        'requester_id',
        'approver_id',
        'type',
        'approvable_id',
        'approvable_type',
        'status',
        'priority',
        'reason',
        'metadata',
        'approver_comment',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function approvable(): MorphTo
    {
        return $this->morphTo();
    }

    public function comments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ApprovalComment::class);
    }

    public function history(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ApprovalHistory::class);
    }
}
