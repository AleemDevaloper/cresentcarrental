<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HrmsPerformanceReview extends Model
{
    protected $fillable = [
        'user_id',
        'reviewer_id',
        'review_cycle',
        'review_date',
        'rating',
        'strengths',
        'areas_for_improvement',
        'employee_comments',
        'manager_comments',
        'status',
        'kpi_ratings'
    ];

    protected $casts = [
        'review_date' => 'date',
        'rating' => 'decimal:2',
        'kpi_ratings' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
