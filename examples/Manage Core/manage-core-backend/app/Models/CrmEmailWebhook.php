<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmEmailWebhook extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_email_webhooks';

    protected $fillable = [
        'provider', 'email_account_id', 'event_id', 'event_type',
        'payload', 'headers', 'processed', 'error', 'processed_at', 'received_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'headers' => 'array',
        'processed' => 'boolean',
        'processed_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function account()
    {
        return $this->belongsTo(CrmEmailAccount::class, 'email_account_id');
    }
}