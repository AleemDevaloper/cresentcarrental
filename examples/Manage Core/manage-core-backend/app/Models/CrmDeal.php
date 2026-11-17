<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmDeal extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_deals';

    protected $fillable = [
        'code', 'name', 'customer_id', 'lead_id', 'contact_id',
        'pipeline_id', 'stage', 'amount', 'currency', 'probability',
        'expected_close_date', 'actual_close_date',
        'assigned_to', 'source', 'status', 'priority',
        'description', 'next_step', 'lost_reason',
        'won_at', 'lost_at',
        'products', 'discount', 'tax', 'forecast_category',
        'tags', 'custom_fields', 'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_date' => 'date',
        'actual_close_date' => 'date',
        'won_at' => 'datetime',
        'lost_at' => 'datetime',
        'tags' => 'array',
        'custom_fields' => 'array',
        'products' => 'array',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(CrmLead::class, 'lead_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(CrmPipeline::class, 'pipeline_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class, 'deal_id');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(CrmFollowUp::class, 'deal_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(CrmTag::class, 'taggable', 'crm_taggables', 'taggable_id', 'tag_id');
    }

    public function getWeightedAmountAttribute(): float
    {
        return round(((float) $this->amount) * ((int) $this->probability / 100), 2);
    }

    public function stageHistory(): HasMany
    {
        return $this->hasMany(CrmDealStageHistory::class, 'deal_id');
    }
}