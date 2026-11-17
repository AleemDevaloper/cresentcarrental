<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LmsCourse extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'lms_courses';

    protected $fillable = [
        'institution_id', 'instructor_id', 'title', 'slug', 'description',
        'short_description', 'category', 'level', 'language',
        'thumbnail', 'price', 'discount_price', 'duration_weeks',
        'total_lessons', 'total_hours', 'requirements', 'objectives',
        'curriculum', 'is_published', 'status',
    ];

    protected $casts = [
        'requirements' => 'array',
        'objectives' => 'array',
        'curriculum' => 'array',
        'is_published' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
