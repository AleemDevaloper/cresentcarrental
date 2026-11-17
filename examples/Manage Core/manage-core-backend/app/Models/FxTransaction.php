<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FxTransaction extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'fx_transactions';

    protected $fillable = [
        'transaction_number',
        'type',
        'from_currency_id',
        'to_currency_id',
        'amount',
        'exchange_rate',
        'converted_amount',
        'account_reference',
        'counterparty',
        'value_date',
        'settlement_date',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:4',
        'exchange_rate' => 'decimal:8',
        'converted_amount' => 'decimal:4',
        'value_date' => 'date',
        'settlement_date' => 'date',
    ];

    public function fromCurrency(): BelongsTo
    {
        return $this->belongsTo(FxCurrency::class, 'from_currency_id');
    }

    public function toCurrency(): BelongsTo
    {
        return $this->belongsTo(FxCurrency::class, 'to_currency_id');
    }

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public static function generateTransactionNumber(): string
    {
        $prefix = 'FX';
        $date = now()->format('Ymd');
        $lastTransaction = static::where('transaction_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('transaction_number')
            ->first();

        if ($lastTransaction) {
            $sequence = (int) substr($lastTransaction->transaction_number, -4) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf('%s-%s-%04d', $prefix, $date, $sequence);
    }
}
