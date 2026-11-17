<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsAuditLog extends Model
{
    protected $fillable = [
        'tenant_id', 'document_id', 'folder_id', 'user_id', 'action', 'details',
        'ip_address', 'user_agent', 'device', 'location',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(DmsFolder::class, 'folder_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
