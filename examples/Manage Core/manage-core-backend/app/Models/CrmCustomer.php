<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmCustomer extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_customers';

    protected $fillable = [
        'code', 'name', 'company', 'legal_name', 'email', 'phone',
        'website', 'industry', 'size', 'type', 'status', 'rating',
        'annual_revenue', 'employee_count', 'address', 'city', 'state',
        'country', 'postal_code', 'notes', 'assigned_to', 'source',
        'tags', 'custom_fields', 'created_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'annual_revenue' => 'decimal:2',
        'employee_count' => 'integer',
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

    public function leads(): HasMany
    {
        return $this->hasMany(CrmLead::class, 'customer_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(CrmContact::class, 'customer_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(CrmDeal::class, 'customer_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class, 'customer_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(CrmTag::class, 'taggable', 'crm_taggables', 'taggable_id', 'tag_id');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(CrmFollowUp::class, 'customer_id');
    }

    public function documents(): HasMany
    {
        return $this->morphMany(CrmDocument::class, 'related');
    }
}