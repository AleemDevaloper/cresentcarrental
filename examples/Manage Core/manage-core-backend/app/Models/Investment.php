<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Investment extends Model
{
    protected $fillable = ['portfolio_id', 'name', 'category', 'principal_amount', 'current_value', 'investment_date', 'status'];

    protected $casts = [
        'principal_amount' => 'decimal:2',
        'current_value' => 'decimal:2',
        'investment_date' => 'date',
    ];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(InvestmentPortfolio::class, 'portfolio_id');
    }

    public function returns(): HasMany
    {
        return $this->hasMany(InvestmentReturn::class);
    }
}
