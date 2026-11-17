<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'user_id',
        'site_id',
        'shift_id',
        'date',
        'clock_in',
        'clock_out',
        'latitude_in',
        'longitude_in',
        'selfie_in',
        'latitude_out',
        'longitude_out',
        'selfie_out',
        'device_info',
        'ip_address',
        'verification_status',
        'verification_notes',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }
}
