<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Examination extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'course_id', 'title', 'description',
        'type', 'max_score', 'passing_score', 'weightage',
        'exam_date', 'start_time', 'end_time', 'duration_minutes',
        'location', 'room', 'status',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
