<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FxCurrency extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'fx_currencies';

    protected $fillable = [
        'code',
        'name',
        'symbol',
        'is_base_currency',
        'is_active',
        'decimal_places',
    ];

    protected $casts = [
        'is_base_currency' => 'boolean',
        'is_active' => 'boolean',
        'decimal_places' => 'integer',
    ];

    public function fromExchangeRates(): HasMany
    {
        return $this->hasMany(FxExchangeRate::class, 'from_currency_id');
    }

    public function toExchangeRates(): HasMany
    {
        return $this->hasMany(FxExchangeRate::class, 'to_currency_id');
    }

    public function fromTransactions(): HasMany
    {
        return $this->hasMany(FxTransaction::class, 'from_currency_id');
    }

    public function toTransactions(): HasMany
    {
        return $this->hasMany(FxTransaction::class, 'to_currency_id');
    }

    public function revaluationLines(): HasMany
    {
        return $this->hasMany(FxRevaluationLine::class, 'currency_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBaseCurrency($query)
    {
        return $query->where('is_base_currency', true);
    }
}
