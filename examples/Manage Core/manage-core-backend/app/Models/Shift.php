<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'grace_period_in',
        'grace_period_out',
        'break_duration',
        'half_day_threshold',
        'is_overtime_eligible',
        'days_of_week',
        'status',
    ];

    protected $casts = [
        'days_of_week' => 'array',
        'is_overtime_eligible' => 'boolean',
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
