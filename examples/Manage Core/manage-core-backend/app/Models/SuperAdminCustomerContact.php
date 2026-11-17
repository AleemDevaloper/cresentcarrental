<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuperAdminCustomerContact extends Model
{
    protected $table = 'superadmin_customer_contacts';

    protected $fillable = [
        'superadmin_customer_id',
        'name',
        'email',
        'phone',
        'designation',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function superAdminCustomer(): BelongsTo
    {
        return $this->belongsTo(SuperAdminCustomer::class, 'superadmin_customer_id');
    }
}
