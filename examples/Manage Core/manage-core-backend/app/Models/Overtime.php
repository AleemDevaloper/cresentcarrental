<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Overtime extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'date',
        'hours',
        'rate',
        'amount',
        'type',
        'status',
        'description',
        'attendance_id',
        'payslip_id',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'decimal:2',
        'rate' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }

    public function payslip(): BelongsTo
    {
        return $this->belongsTo(Payslip::class);
    }
}
