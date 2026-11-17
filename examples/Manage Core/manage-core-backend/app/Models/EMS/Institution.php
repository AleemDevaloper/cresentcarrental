<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'name', 'short_name', 'code', 'logo', 'cover_image', 'description',
        'registration_number', 'institution_type', 'status', 'founded_date',
        'website', 'email', 'phone', 'emergency_contact', 'tax_registration',
        'currency', 'language', 'timezone', 'country', 'province', 'city',
        'postal_code', 'address', 'latitude', 'longitude',
        'principal', 'vice_principal', 'director', 'registrar',
    ];

    protected $casts = [
        'founded_date' => 'date',
    ];

    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(Teacher::class);
    }

    public function academicYears(): HasMany
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
