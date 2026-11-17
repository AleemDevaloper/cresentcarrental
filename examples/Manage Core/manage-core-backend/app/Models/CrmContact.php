<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmContact extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_contacts';

    protected $fillable = [
        'customer_id', 'first_name', 'last_name', 'email', 'phone',
        'mobile', 'title', 'department', 'is_primary', 'status',
        'notes', 'linkedin', 'twitter', 'facebook', 'address',
        'birthday', 'anniversary', 'tags', 'created_by',
        'last_contacted_at', 'next_follow_up_at', 'unsubscribed_at',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'birthday' => 'date',
        'anniversary' => 'date',
        'tags' => 'array',
        'last_contacted_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(CrmTag::class, 'taggable', 'crm_taggables', 'taggable_id', 'tag_id');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(CrmFollowUp::class, 'contact_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(CrmDeal::class, 'contact_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class, 'contact_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));
    }

    public function getIsUnsubscribedAttribute(): bool
    {
        return $this->unsubscribed_at !== null;
    }
}