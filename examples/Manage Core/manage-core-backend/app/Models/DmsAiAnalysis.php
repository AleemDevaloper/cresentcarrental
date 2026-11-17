<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsAiAnalysis extends Model
{
    protected $table = 'dms_ai_analyses';

    protected $fillable = [
        'document_id', 'type', 'result', 'confidence', 'metadata',
        'status', 'error_message', 'analyzed_by', 'completed_at',
    ];

    protected $casts = [
        'result' => 'array',
        'metadata' => 'array',
        'confidence' => 'float',
        'completed_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function analyzer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'analyzed_by');
    }
}
