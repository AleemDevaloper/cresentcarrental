<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankExport extends Model
{
    protected $fillable = [
        'payroll_batch_id',
        'bank_name',
        'export_code',
        'title',
        'payroll_run',
        'total_amount',
        'employee_count',
        'status',
        'file_path',
        'error_message',
        'generated_by',
        'completed_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function payrollBatch(): BelongsTo
    {
        return $this->belongsTo(HrmsPayrollBatch::class, 'payroll_batch_id');
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
