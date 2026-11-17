<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementAuditLog extends Model
{
    protected $connection = 'mysql';

    protected $fillable = [
        'announcement_id',
        'actor_id',
        'action',
        'message',
        'before',
        'after',
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array',
    ];
}
