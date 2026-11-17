<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSalary extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'salary_structure_id',
        'base_amount',
        'effective_date',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'effective_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function structure(): BelongsTo
    {
        return $this->belongsTo(SalaryStructure::class, 'salary_structure_id');
    }
}
