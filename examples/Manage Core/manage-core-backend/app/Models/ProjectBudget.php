<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectBudget extends Model
{
    protected $fillable = [
        'project_id',
        'category',
        'description',
        'amount',
        'spent',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'spent' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function costs(): HasMany
    {
        return $this->hasMany(ProjectCost::class, 'budget_id');
    }
}
