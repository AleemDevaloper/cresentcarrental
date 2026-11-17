<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvestmentReturn extends Model
{
    protected $fillable = ['investment_id', 'amount', 'entry_date', 'type'];

    protected $casts = [
        'amount' => 'decimal:2',
        'entry_date' => 'date',
    ];

    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }
}
