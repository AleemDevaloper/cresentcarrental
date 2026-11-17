<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Admission extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'academic_year_id', 'program_id', 'student_id',
        'admission_number', 'first_name', 'last_name', 'date_of_birth',
        'gender', 'email', 'phone', 'address', 'city', 'province',
        'previous_school', 'previous_grade', 'guardian_name', 'guardian_contact',
        'application_date', 'admission_date', 'status', 'remarks',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'application_date' => 'date',
        'admission_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
