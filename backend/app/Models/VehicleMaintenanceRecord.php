<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenanceRecord extends Model
{
    protected $fillable = [
        'vehicle_id', 'created_by', 'type', 'description', 'cost',
        'odometer', 'performed_at', 'next_due_at', 'status',
    ];

    protected function casts(): array
    {
        return ['cost' => 'decimal:2', 'performed_at' => 'date', 'next_due_at' => 'date'];
    }

    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
}
