<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmCalendarEvent extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_calendar_events';

    protected $fillable = [
        'title', 'description', 'type', 'status',
        'start_at', 'end_at', 'all_day', 'location', 'timezone', 'color',
        'owner_id', 'related_type', 'related_id', 'activity_id',
        'attendees', 'notes', 'created_by',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'all_day' => 'boolean',
        'attendees' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function related()
    {
        return $this->morphTo();
    }
}