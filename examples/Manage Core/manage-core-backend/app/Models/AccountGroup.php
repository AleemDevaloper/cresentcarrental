<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountGroup extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'account_groups';
    protected $fillable = ['account_type_id','name','code','description'];

    public function type() { return $this->belongsTo(AccountType::class, 'account_type_id'); }
    public function accounts() { return $this->hasMany(Account::class, 'account_group_id'); }
}
