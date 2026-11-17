<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'created_by',
        'name',
        'sr_no',
        'client_id',
        'client',
        'description',
        'submission_time',
        'status',
        'team_size',
        'file',
        'file_size',
    ];

    protected $casts = [
        'submission_time' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function clientInfo(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function milestones(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    public function members(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }
}
