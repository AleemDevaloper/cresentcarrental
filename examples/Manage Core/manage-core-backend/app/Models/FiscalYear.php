<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FiscalYear extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'fiscal_years';

    protected $fillable = ['name','start_date','end_date','status','is_draft','created_by','closed_at','closed_by'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_draft' => 'boolean',
        'closed_at' => 'datetime',
    ];

    public function periods() { return $this->hasMany(Period::class, 'fiscal_year_id'); }
    public function fiscalPeriods() { return $this->hasMany(FiscalPeriod::class, 'fiscal_year_id'); }
    public function creator() { return $this->belongsTo(\App\Models\User::class, 'created_by'); }
    public function closer() { return $this->belongsTo(\App\Models\User::class, 'closed_by'); }
}
