<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBacklog extends Model
{
    protected $fillable = [
        'project_id',
        'sprint_id',
        'title',
        'description',
        'type',
        'priority',
        'status',
        'story_points',
        'assigned_to',
        'sort_order',
    ];

    protected $casts = [
        'story_points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(ProjectSprint::class, 'sprint_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
