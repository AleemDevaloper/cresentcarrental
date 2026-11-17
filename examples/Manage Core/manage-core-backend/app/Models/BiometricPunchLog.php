<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BiometricPunchLog extends Model
{
    protected $fillable = [
        'biometric_device_id',
        'user_id',
        'employee_code',
        'punch_time',
        'punch_type',
        'verify_mode',
        'work_code',
        'source',
        'sync_status',
        'sync_notes',
        'attendance_id',
        'raw_payload',
    ];

    protected $casts = [
        'punch_time' => 'datetime',
        'raw_payload' => 'array',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(BiometricDevice::class, 'biometric_device_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }
}
