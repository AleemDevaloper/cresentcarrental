<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'name',
        'company_name',
        'email',
        'phone',
        'country',
        'avatar',
        'status',
        'type',
        'industry',
        'health_score',
        'account_manager_id',
        'since',
        'website',
        'address',
        'total_revenue',
    ];

    protected $casts = [
        'since' => 'date',
        'health_score' => 'integer',
        'total_revenue' => 'decimal:2',
    ];

    public function accountManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'account_manager_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(ClientContact::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
