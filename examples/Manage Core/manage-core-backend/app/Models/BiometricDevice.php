<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BiometricDevice extends Model
{
    protected $fillable = [
        'name',
        'vendor',
        'device_code',
        'serial_number',
        'ip_address',
        'port',
        'site_id',
        'timezone',
        'status',
        'last_sync_at',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'last_sync_at' => 'datetime',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function punchLogs(): HasMany
    {
        return $this->hasMany(BiometricPunchLog::class);
    }
}
