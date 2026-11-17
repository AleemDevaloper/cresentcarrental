<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payslip extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'month',
        'year',
        'gross_earning',
        'total_deduction',
        'net_salary',
        'status',
        'earnings_breakdown',
        'deductions_breakdown',
        'attendance_summary',
        'generated_by',
        'paid_at',
    ];

    protected $casts = [
        'earnings_breakdown' => 'array',
        'deductions_breakdown' => 'array',
        'attendance_summary' => 'array',
        'gross_earning' => 'decimal:2',
        'total_deduction' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
