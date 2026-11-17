<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsAnnotation extends Model
{
    protected $table = 'dms_annotations';

    protected $fillable = [
        'document_id', 'version_id', 'user_id', 'type', 'content',
        'page_number', 'position', 'color', 'is_resolved',
    ];

    protected $casts = [
        'position' => 'array',
        'is_resolved' => 'boolean',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(DmsDocumentVersion::class, 'version_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
