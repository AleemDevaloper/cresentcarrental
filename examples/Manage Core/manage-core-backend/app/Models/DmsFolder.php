<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsFolder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'parent_id', 'name', 'slug', 'description', 'color', 'icon',
        'access_level', 'owner_id', 'department', 'is_archived', 'sort_order', 'created_by',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DmsDocument::class, 'folder_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(DmsAuditLog::class, 'folder_id');
    }
}
