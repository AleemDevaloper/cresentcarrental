<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'exchange_rates';

    protected $fillable = [
        'from_currency_id',
        'to_currency_id',
        'rate',
        'source',
        'effective_date',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'rate' => 'decimal:8',
        'effective_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function fromCurrency()
    {
        return $this->belongsTo(Currency::class, 'from_currency_id');
    }

    public function toCurrency()
    {
        return $this->belongsTo(Currency::class, 'to_currency_id');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeEffective($query)
    {
        return $query->where('effective_date', '<=', now());
    }

    public function scopeForCurrencyPair($query, int $fromCurrencyId, int $toCurrencyId)
    {
        return $query->where('from_currency_id', $fromCurrencyId)
            ->where('to_currency_id', $toCurrencyId);
    }
}
