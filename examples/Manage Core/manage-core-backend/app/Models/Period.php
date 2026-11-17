<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'periods';

    protected $fillable = ['fiscal_year_id','name','start_date','end_date','is_open','is_draft'];

    protected $casts = ['start_date' => 'date','end_date' => 'date','is_open' => 'boolean','is_draft' => 'boolean'];

    public function fiscalYear() { return $this->belongsTo(FiscalYear::class, 'fiscal_year_id'); }
}
