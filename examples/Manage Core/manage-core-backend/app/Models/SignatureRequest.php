<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SignatureRequest extends Model
{
    protected $fillable = ['title', 'document_path', 'creator_id', 'status', 'expires_at'];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function signers(): HasMany
    {
        return $this->hasMany(SignatureSigner::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(SignatureAuditLog::class);
    }
}
