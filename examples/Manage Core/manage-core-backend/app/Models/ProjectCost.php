<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectCost extends Model
{
    protected $fillable = [
        'project_id',
        'budget_id',
        'type',
        'description',
        'amount',
        'incurred_date',
        'incurred_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'incurred_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function budget(): BelongsTo
    {
        return $this->belongsTo(ProjectBudget::class, 'budget_id');
    }

    public function incurredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'incurred_by');
    }
}
