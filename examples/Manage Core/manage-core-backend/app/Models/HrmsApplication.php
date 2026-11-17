<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HrmsApplication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'job_id', 'candidate_id', 'stage', 'applied_at', 'status'
    ];

    protected $casts = [
        'applied_at' => 'datetime',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(HrmsJob::class, 'job_id');
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(HrmsCandidate::class, 'candidate_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(HrmsInterview::class, 'application_id');
    }
}
