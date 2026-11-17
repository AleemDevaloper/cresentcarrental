<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FxRevaluationLine extends Model
{
    protected $connection = 'tenant';
    protected $table = 'fx_revaluation_lines';

    protected $fillable = [
        'revaluation_id',
        'account_reference',
        'currency_id',
        'balance_amount',
        'unrealized_rate',
        'realized_rate',
        'gain_amount',
        'loss_amount',
        'notes',
    ];

    protected $casts = [
        'balance_amount' => 'decimal:4',
        'unrealized_rate' => 'decimal:8',
        'realized_rate' => 'decimal:8',
        'gain_amount' => 'decimal:4',
        'loss_amount' => 'decimal:4',
    ];

    public function revaluation(): BelongsTo
    {
        return $this->belongsTo(FxRevaluation::class, 'revaluation_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(FxCurrency::class, 'currency_id');
    }
}
