<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'folder_id', 'name', 'slug', 'description', 'file_path', 'file_type',
        'file_extension', 'file_size', 'mime_type', 'thumbnail_path', 'version', 'status',
        'approval_status', 'signature_status', 'confidentiality', 'retention_policy',
        'retention_until', 'owner_id', 'department', 'project_id', 'client_id', 'tags',
        'metadata', 'is_template', 'is_archived', 'watermark_enabled', 'download_limit',
        'expires_at', 'last_viewed_at', 'view_count', 'download_count', 'created_by',
    ];

    protected $appends = [];

    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'is_template' => 'boolean',
        'is_archived' => 'boolean',
        'watermark_enabled' => 'boolean',
        'retention_until' => 'datetime',
        'expires_at' => 'datetime',
        'last_viewed_at' => 'datetime',
    ];

    public function getPreviewUrlAttribute(): ?string
    {
        if ($this->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($this->file_path)) {
            return url('/api/v1/dms/documents/' . $this->id . '/serve');
        }
        return null;
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(DmsFolder::class, 'folder_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DmsDocumentVersion::class, 'document_id');
    }

    public function signatures(): HasMany
    {
        return $this->hasMany(DmsDocumentSignature::class, 'document_id');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(DmsDocumentApproval::class, 'document_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(DmsDocumentComment::class, 'document_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(DmsDocumentShare::class, 'document_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(DmsAuditLog::class, 'document_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
