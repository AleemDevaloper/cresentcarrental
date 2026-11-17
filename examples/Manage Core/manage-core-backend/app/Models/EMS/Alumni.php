<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Alumni extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'student_id', 'first_name', 'last_name',
        'email', 'phone', 'graduation_year', 'program_name',
        'current_occupation', 'current_company', 'current_location',
        'linkedin_url', 'facebook_url', 'address', 'city', 'country',
        'is_employed', 'is_verified', 'status', 'notes',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
        'is_employed' => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
