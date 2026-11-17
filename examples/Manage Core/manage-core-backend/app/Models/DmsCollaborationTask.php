<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsCollaborationTask extends Model
{
    protected $table = 'dms_collaboration_tasks';

    protected $fillable = [
        'document_id', 'assigned_to', 'created_by', 'title',
        'description', 'priority', 'status', 'due_date', 'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
