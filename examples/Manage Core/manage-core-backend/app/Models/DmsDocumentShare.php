<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocumentShare extends Model
{
    protected $fillable = [
        'document_id', 'shared_by', 'shared_with_user_id', 'shared_with_email',
        'access_level', 'share_token', 'password', 'expires_at', 'max_downloads',
        'is_revoked', 'last_accessed_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_revoked' => 'boolean',
        'last_accessed_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function sharedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_by');
    }

    public function sharedWithUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_with_user_id');
    }
}
