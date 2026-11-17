<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TaskSharedBoard extends Model
{
    protected $fillable = [
        'name',
        'description',
        'created_by',
        'status',
    ];

    protected $table = 'task_shared_boards';

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_shared_board_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_shared_board_task')
            ->withTimestamps();
    }
}
