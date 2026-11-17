<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocumentApproval extends Model
{
    protected $fillable = [
        'document_id', 'approver_id', 'approver_email', 'stage', 'status', 'comment',
        'escalated_to', 'approval_order', 'approved_at', 'rejected_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
