<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTrainingModel extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'ai_training_models';

    protected $fillable = [
        'name', 'type', 'base_model', 'description', 'learning_rate',
        'epochs', 'batch_size', 'status', 'accuracy', 'loss',
        'last_trained_at', 'created_by',
    ];

    protected $casts = [
        'learning_rate' => 'float',
        'accuracy' => 'float',
        'loss' => 'float',
        'epochs' => 'integer',
        'batch_size' => 'integer',
        'last_trained_at' => 'datetime',
    ];

    public function datasets()
    {
        return $this->hasMany(AiTrainingDataset::class, 'model_id');
    }

    public function sessions()
    {
        return $this->hasMany(AiTrainingSession::class, 'model_id');
    }

    public function agents()
    {
        return $this->hasMany(AiTrainingAgent::class, 'model_id');
    }
}
