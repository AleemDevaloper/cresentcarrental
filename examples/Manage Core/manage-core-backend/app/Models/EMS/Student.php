<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'program_id', 'user_id', 'student_number',
        'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_group',
        'nationality', 'religion', 'email', 'phone', 'mobile',
        'address', 'city', 'province', 'postal_code', 'country',
        'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
        'guardian_name', 'guardian_contact', 'guardian_relation',
        'enrollment_date', 'graduation_date', 'status', 'photo',
        'previous_school', 'academic_standing',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'enrollment_date' => 'date',
        'graduation_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function fees(): HasMany
    {
        return $this->hasMany(Fee::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
