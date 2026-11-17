<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTrainingAgent extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'ai_training_agents';

    protected $fillable = [
        'name', 'model_id', 'department', 'description', 'status',
        'usage_count', 'last_used_at',
    ];

    protected $casts = [
        'usage_count' => 'integer',
        'last_used_at' => 'datetime',
    ];

    public function model()
    {
        return $this->belongsTo(AiTrainingModel::class, 'model_id');
    }
}
