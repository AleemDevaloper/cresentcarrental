<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmLead extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_leads';

    protected $fillable = [
        'code', 'name', 'first_name', 'last_name', 'company',
        'job_title', 'email', 'phone', 'mobile', 'website', 'linkedin',
        'country', 'state', 'city', 'address', 'postal_code',
        'source', 'campaign_id', 'industry', 'company_size', 'revenue',
        'status', 'rating', 'score', 'assigned_to', 'team_id',
        'created_by', 'last_contacted_at', 'next_follow_up_at', 'converted_at',
        'converted_contact_id', 'converted_deal_id', 'lost_reason',
    ];

    protected $casts = [
        'score' => 'integer',
        'estimated_value' => 'decimal:2',
        'expected_close_date' => 'date',
        'converted_at' => 'datetime',
        'last_contacted_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
        'tags' => 'array',
        'custom_fields' => 'array',
    ];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(CrmCampaign::class, 'campaign_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class, 'lead_id');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CrmNote::class, 'lead_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(CrmDeal::class, 'lead_id');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(CrmFollowUp::class, 'lead_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CrmSequenceEnrollment::class, 'lead_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(CrmTag::class, 'taggable', 'crm_taggables', 'taggable_id', 'tag_id');
    }

    public function customFieldValues(): HasMany
    {
        return $this->hasMany(CrmCustomFieldValue::class, 'entity_id')
            ->where('entity_type', static::class);
    }

    public function getFullNameAttribute(): string
    {
        if ($this->first_name || $this->last_name) {
            return trim($this->first_name . ' ' . $this->last_name);
        }
        return $this->name ?? '';
    }
}