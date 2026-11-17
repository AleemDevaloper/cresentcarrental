<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmiSchedule extends Model
{
    protected $fillable = [
        'loan_id', 'emi_number', 'due_date', 
        'principal_component', 'interest_component', 
        'total_amount', 'status', 'paid_at'
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'date',
        'principal_component' => 'decimal:2',
        'interest_component' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
