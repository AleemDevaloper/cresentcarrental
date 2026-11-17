<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FxExchangeRate extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'fx_exchange_rates';

    protected $fillable = [
        'from_currency_id',
        'to_currency_id',
        'rate',
        'source',
        'effective_date',
        'expiry_date',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'rate' => 'decimal:8',
        'effective_date' => 'date',
        'expiry_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function fromCurrency(): BelongsTo
    {
        return $this->belongsTo(FxCurrency::class, 'from_currency_id');
    }

    public function toCurrency(): BelongsTo
    {
        return $this->belongsTo(FxCurrency::class, 'to_currency_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeEffective($query)
    {
        return $query->where('effective_date', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
            });
    }

    public function scopeForCurrencyPair($query, int $fromCurrencyId, int $toCurrencyId)
    {
        return $query->where('from_currency_id', $fromCurrencyId)
            ->where('to_currency_id', $toCurrencyId);
    }
}
