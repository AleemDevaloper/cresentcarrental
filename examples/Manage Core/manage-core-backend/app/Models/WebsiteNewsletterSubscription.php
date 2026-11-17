<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteNewsletterSubscription extends Model
{
    protected $fillable = [
        'email', 'source', 'status',
    ];
}
