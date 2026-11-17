<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementReceipt extends Model
{
    protected $connection = 'mysql';

    protected $fillable = [
        'announcement_id',
        'tenant_id',
        'user_id',
        'delivered_at',
        'opened_at',
        'read_at',
        'acknowledged_at',
        'dismissed_at',
        'device',
        'browser',
        'ip_address',
    ];

    protected $casts = [
        'delivered_at' => 'datetime',
        'opened_at' => 'datetime',
        'read_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'dismissed_at' => 'datetime',
    ];

    public function announcement(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Announcement::class);
    }
}
