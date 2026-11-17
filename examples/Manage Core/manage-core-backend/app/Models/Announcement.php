<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'created_by',
        'title',
        'summary',
        'description',
        'type',
        'priority',
        'severity_color',
        'status',
        'is_platform_wide',
        'target_tenant_ids',
        'target_roles',
        'target_departments',
        'module_visibility',
        'placements',
        'delivery_channels',
        'actions',
        'attachments',
        'tags',
        'requires_acknowledgement',
        'requires_read_confirmation',
        'dismissible',
        'scheduled_at',
        'published_at',
        'starts_at',
        'expires_at',
        'timezone',
    ];

    protected $casts = [
        'is_platform_wide' => 'boolean',
        'target_tenant_ids' => 'array',
        'target_roles' => 'array',
        'target_departments' => 'array',
        'module_visibility' => 'array',
        'placements' => 'array',
        'delivery_channels' => 'array',
        'actions' => 'array',
        'attachments' => 'array',
        'tags' => 'array',
        'requires_acknowledgement' => 'boolean',
        'requires_read_confirmation' => 'boolean',
        'dismissible' => 'boolean',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function receipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(AnnouncementReceipt::class);
    }

    public function auditLogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(AnnouncementAuditLog::class);
    }
}
