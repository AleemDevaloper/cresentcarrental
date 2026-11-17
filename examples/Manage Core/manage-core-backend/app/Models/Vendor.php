<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    protected $fillable = [
        'vendor_code', 'name', 'legal_name', 'vendor_type',
        'tax_no', 'email', 'phone', 'mobile', 'whatsapp',
        'website', 'country', 'city', 'credit_terms', 'credit_days',
        'credit_limit', 'currency', 'gl_expense_account', 'opening_balance', 'status',
    ];

    protected $casts = [
        'credit_days' => 'integer',
        'credit_limit' => 'decimal:2',
        'opening_balance' => 'decimal:2',
    ];

    public function payments(): HasMany
    {
        return $this->hasMany(VendorPayment::class);
    }
}
