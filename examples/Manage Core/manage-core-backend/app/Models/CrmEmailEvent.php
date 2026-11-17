<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmEmailEvent extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_email_events';

    protected $fillable = [
        'email_id', 'event_type', 'ip_address', 'user_agent', 'link_url', 'metadata', 'occurred_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'occurred_at' => 'datetime',
    ];

    public function email()
    {
        return $this->belongsTo(CrmEmail::class, 'email_id');
    }
}