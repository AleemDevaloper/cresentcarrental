<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'project_id',
        'assigned_to',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'progress',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TaskTimeLog::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(TaskActivityLog::class);
    }

    public function dependencies(): HasMany
    {
        return $this->hasMany(TaskDependency::class);
    }

    public function dependentTasks(): HasMany
    {
        return $this->hasMany(TaskDependency::class, 'depends_on_task_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function multiAssignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_multi_assignees')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(TaskApproval::class);
    }

    public function getTotalDurationAttribute(): int
    {
        return $this->timeLogs->sum('duration');
    }
}
