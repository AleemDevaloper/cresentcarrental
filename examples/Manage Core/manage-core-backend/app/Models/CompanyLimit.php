<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyLimit extends Model
{
    protected $fillable = ['organization', 'user_limit'];
    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];
}
