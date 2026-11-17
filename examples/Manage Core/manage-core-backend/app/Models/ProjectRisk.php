<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectRisk extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'category',
        'probability',
        'impact',
        'status',
        'mitigation_plan',
        'owner_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
