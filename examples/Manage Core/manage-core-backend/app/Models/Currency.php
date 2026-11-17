<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'currencies';

    protected $fillable = [
        'code',
        'name',
        'symbol',
        'is_base',
        'is_active',
        'decimal_places',
        'exchange_rate',
    ];

    protected $casts = [
        'is_base' => 'boolean',
        'is_active' => 'boolean',
        'decimal_places' => 'integer',
        'exchange_rate' => 'decimal:8',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBase($query)
    {
        return $query->where('is_base', true);
    }

    public function fromExchangeRates()
    {
        return $this->hasMany(ExchangeRate::class, 'from_currency_id');
    }

    public function toExchangeRates()
    {
        return $this->hasMany(ExchangeRate::class, 'to_currency_id');
    }

    public static function getBaseCurrency()
    {
        return static::where('is_base', true)->first();
    }
}
