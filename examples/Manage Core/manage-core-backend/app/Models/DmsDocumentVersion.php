<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocumentVersion extends Model
{
    protected $fillable = [
        'document_id', 'version', 'file_path', 'file_size', 'file_type', 'mime_type',
        'comment', 'created_by',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
