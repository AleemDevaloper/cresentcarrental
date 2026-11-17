<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTrainingDataset extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'ai_training_datasets';

    protected $fillable = [
        'model_id', 'name', 'file_path', 'file_type', 'row_count', 'file_size', 'status',
    ];

    protected $casts = [
        'row_count' => 'integer',
    ];

    public function model()
    {
        return $this->belongsTo(AiTrainingModel::class, 'model_id');
    }
}
