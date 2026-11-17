<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HrmsPayrollBatch extends Model
{
    protected $fillable = [
        'month',
        'year',
        'status',
        'total_gross',
        'total_deduction',
        'total_net',
        'employee_count',
        'processed_by',
    ];

    protected $casts = [
        'total_gross' => 'decimal:2',
        'total_deduction' => 'decimal:2',
        'total_net' => 'decimal:2',
    ];

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class, 'batch_id');
    }
}
