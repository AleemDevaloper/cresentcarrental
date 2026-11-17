<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'transaction_id', 'client', 'amount', 'gateway',
        'status', 'description', 'transaction_date'
    ];
}
