<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'facility_bookings';

    protected $fillable = [
        'facility_id', 'user_id', 'title', 'description',
        'booking_date', 'start_time', 'end_time', 'purpose',
        'attendees', 'status', 'remarks',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'attendees' => 'integer',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
