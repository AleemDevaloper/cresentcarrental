<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteDemoRequest extends Model
{
    protected $fillable = [
        'name', 'email', 'company', 'product', 'status', 'notes', 'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
