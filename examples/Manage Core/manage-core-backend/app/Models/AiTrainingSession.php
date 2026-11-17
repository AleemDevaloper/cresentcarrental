<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTrainingSession extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'ai_training_sessions';

    protected $fillable = [
        'model_id', 'status', 'progress', 'current_epoch', 'loss', 'accuracy',
        'duration_ms', 'error_message', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'progress' => 'integer',
        'loss' => 'float',
        'accuracy' => 'float',
        'duration_ms' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function model()
    {
        return $this->belongsTo(AiTrainingModel::class, 'model_id');
    }
}
