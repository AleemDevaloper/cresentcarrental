<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'title', 'description', 'event_type',
        'start_date', 'end_date', 'start_time', 'end_time',
        'location', 'venue', 'organizer', 'organizer_contact',
        'max_attendees', 'registration_fee', 'cover_image',
        'is_published', 'status', 'remarks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'registration_fee' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
