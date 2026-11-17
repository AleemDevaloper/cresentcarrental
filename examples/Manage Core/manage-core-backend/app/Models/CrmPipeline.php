<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmPipeline extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_pipelines';

    protected $fillable = [
        'name', 'description', 'is_default', 'is_active',
        'sort_order', 'created_by',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function deals(): HasMany
    {
        return $this->hasMany(CrmDeal::class, 'pipeline_id');
    }

    public function stages(): HasMany
    {
        return $this->hasMany(CrmPipelineStage::class, 'pipeline_id')->orderBy('sort_order');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}