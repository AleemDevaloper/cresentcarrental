<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectResource extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'resource_name',
        'resource_type',
        'role',
        'allocation_percent',
        'hourly_rate',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'allocation_percent' => 'integer',
        'hourly_rate' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
