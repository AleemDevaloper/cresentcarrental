<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmPipelineStage extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'crm_pipeline_stages';

    protected $fillable = [
        'pipeline_id', 'name', 'description', 'sort_order',
        'probability', 'color', 'is_won', 'is_lost', 'required_fields',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'probability' => 'integer',
        'is_won' => 'boolean',
        'is_lost' => 'boolean',
        'required_fields' => 'array',
    ];

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(CrmPipeline::class, 'pipeline_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(CrmDeal::class, 'stage', 'name')
            ->where('pipeline_id', $this->pipeline_id);
    }
}