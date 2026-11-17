<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facility extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'campus_id', 'name', 'code', 'type', 'description',
        'capacity', 'location', 'floor', 'contact_person',
        'contact_phone', 'operating_hours', 'amenities',
        'rules', 'is_bookable', 'status',
    ];

    protected $casts = [
        'amenities' => 'array',
        'rules' => 'array',
        'is_bookable' => 'boolean',
        'operating_hours' => 'array',
    ];

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }
}
