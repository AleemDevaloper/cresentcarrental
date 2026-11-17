<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'user_id', 'patient_type', 'first_name',
        'last_name', 'date_of_birth', 'gender', 'blood_group',
        'email', 'phone', 'mobile', 'address', 'city',
        'emergency_contact', 'emergency_phone', 'allergies',
        'medical_conditions', 'medications', 'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'allergies' => 'array',
        'medical_conditions' => 'array',
        'medications' => 'array',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
