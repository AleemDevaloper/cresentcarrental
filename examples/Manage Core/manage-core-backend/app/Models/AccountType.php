<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountType extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'account_types';
    protected $fillable = ['name','code','description'];

    public function groups() { return $this->hasMany(AccountGroup::class, 'account_type_id'); }
    public function accounts() { return $this->hasMany(Account::class, 'account_type_id'); }
}
