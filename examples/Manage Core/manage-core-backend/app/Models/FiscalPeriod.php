<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FiscalPeriod extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'fiscal_periods';

    protected $fillable = [
        'fiscal_year_id',
        'name',
        'start_date',
        'end_date',
        'status',
        'locked_at',
        'locked_by',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'locked_at' => 'datetime',
    ];

    public function fiscalYear()
    {
        return $this->belongsTo(FiscalYear::class, 'fiscal_year_id');
    }

    public function locker()
    {
        return $this->belongsTo(\App\Models\User::class, 'locked_by');
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeLocked($query)
    {
        return $query->where('status', 'locked');
    }
}
