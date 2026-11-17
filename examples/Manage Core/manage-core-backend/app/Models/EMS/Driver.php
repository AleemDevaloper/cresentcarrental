<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'first_name', 'last_name', 'email', 'phone',
        'mobile', 'address', 'license_number', 'license_expiry',
        'license_type', 'date_of_birth', 'emergency_contact',
        'emergency_phone', 'joining_date', 'status', 'photo',
    ];

    protected $casts = [
        'license_expiry' => 'date',
        'date_of_birth' => 'date',
        'joining_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
