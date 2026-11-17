<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankDetail extends Model
{
    use SoftDeletes;

    protected $table = 'employee_bank_details';

    protected $fillable = [
        'user_id',
        'bank_name',
        'account_title',
        'account_number',
        'iban',
        'branch_code',
        'branch_name',
        'swift_code',
        'salary_transfer_method',
        'is_primary',
        'verification_status',
        'verification_notes',
        'verified_by',
        'verified_at',
        'added_by',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }
}
