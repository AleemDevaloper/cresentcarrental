<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HrmsJob extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'department_id', 'designation_id', 
        'employment_type', 'location', 'vacancy_count', 'expiry_date', 'status'
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(HrmsApplication::class, 'job_id');
    }
}
