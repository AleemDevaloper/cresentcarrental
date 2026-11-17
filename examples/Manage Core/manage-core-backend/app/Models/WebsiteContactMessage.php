<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteContactMessage extends Model
{
    protected $fillable = [
        'name', 'email', 'company', 'service', 'budget', 'message', 'status', 'notes', 'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
