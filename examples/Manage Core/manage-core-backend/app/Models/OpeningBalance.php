<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpeningBalance extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'opening_balances';
    protected $fillable = ['account_id','period_id','amount','currency','note','created_by','is_draft'];

    public function account() { return $this->belongsTo(Account::class, 'account_id'); }
    public function period() { return $this->belongsTo(Period::class, 'period_id'); }
}
