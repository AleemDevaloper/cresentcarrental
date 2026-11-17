<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleInspection extends Model
{
    protected $fillable = [
        'vehicle_id',
        'booking_id',
        'inspected_by',
        'type',
        'result',
        'odometer',
        'checklist',
        'notes',
        'inspected_at',
    ];

    protected function casts(): array
    {
        return [
            'checklist' => 'array',
            'inspected_at' => 'datetime',
        ];
    }

    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function booking() { return $this->belongsTo(Booking::class); }
    public function inspector() { return $this->belongsTo(User::class, 'inspected_by'); }
}
