<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectProgress extends Model
{
    protected $table = 'project_progress';

    protected $fillable = [
        'project_id',
        'milestone',
        'progress_percent',
        'notes',
        'reported_by',
        'reported_date',
    ];

    protected $casts = [
        'progress_percent' => 'integer',
        'reported_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
