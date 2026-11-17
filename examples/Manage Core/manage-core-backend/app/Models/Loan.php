<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    protected $fillable = [
        'user_id', 'lender_name', 'loan_type', 'amount', 
        'interest_rate', 'repayment_months', 'start_date', 
        'emi_amount', 'outstanding_balance', 'status', 'reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'start_date' => 'date',
        'emi_amount' => 'decimal:2',
        'outstanding_balance' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function emiSchedules(): HasMany
    {
        return $this->hasMany(EmiSchedule::class);
    }
}
