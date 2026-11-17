<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'accounts';
    protected $fillable = [
        'account_group_id', 'account_type_id', 'parent_id',
        'code', 'name', 'description',
        'opening_balance', 'current_balance',
        'normal_balance', 'currency',
        'is_contra', 'is_control_account', 'is_cash_account', 'is_bank_account',
        'allow_manual_entries', 'status', 'tax_category', 'sort_order',
        'is_draft',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_contra' => 'boolean',
        'is_control_account' => 'boolean',
        'is_cash_account' => 'boolean',
        'is_bank_account' => 'boolean',
        'allow_manual_entries' => 'boolean',
        'is_draft' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function group() { return $this->belongsTo(AccountGroup::class, 'account_group_id'); }
    public function type() { return $this->belongsTo(AccountType::class, 'account_type_id'); }
    public function parent() { return $this->belongsTo(Account::class, 'parent_id'); }
    public function children() { return $this->hasMany(Account::class, 'parent_id'); }
}
