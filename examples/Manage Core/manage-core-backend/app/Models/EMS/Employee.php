<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'department_id', 'user_id', 'employee_number',
        'first_name', 'last_name', 'email', 'phone', 'mobile',
        'date_of_birth', 'gender', 'address', 'city', 'province',
        'designation', 'department', 'joining_date', 'employment_type',
        'status', 'photo', 'emergency_contact', 'emergency_phone',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
