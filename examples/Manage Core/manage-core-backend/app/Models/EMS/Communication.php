<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Communication extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'sender_id', 'recipient_type',
        'recipient_ids', 'subject', 'message', 'type',
        'priority', 'attachments', 'sent_at', 'status',
    ];

    protected $casts = [
        'recipient_ids' => 'array',
        'attachments' => 'array',
        'sent_at' => 'datetime',
    ];
}
