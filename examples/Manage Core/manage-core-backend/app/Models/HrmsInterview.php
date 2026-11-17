<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HrmsInterview extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'application_id', 'interviewer_id', 'interview_date', 
        'type', 'status', 'feedback', 'rating'
    ];

    protected $casts = [
        'interview_date' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(HrmsApplication::class, 'application_id');
    }

    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }
}
