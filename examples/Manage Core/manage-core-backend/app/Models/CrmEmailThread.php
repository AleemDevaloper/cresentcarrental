<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmEmailThread extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_email_threads';

    protected $fillable = [
        'thread_key', 'email_account_id', 'subject', 'participants',
        'message_count', 'unread_count', 'last_message_at',
        'entity_type', 'entity_id', 'snippet',
        'is_starred', 'is_archived', 'is_trash', 'is_spam',
    ];

    protected $casts = [
        'message_count' => 'integer',
        'unread_count' => 'integer',
        'last_message_at' => 'datetime',
        'is_starred' => 'boolean',
        'is_archived' => 'boolean',
        'is_trash' => 'boolean',
        'is_spam' => 'boolean',
    ];

    public function account()
    {
        return $this->belongsTo(CrmEmailAccount::class, 'email_account_id');
    }

    public function emails()
    {
        return $this->hasMany(CrmEmail::class, 'thread_id')->orderBy('sent_at');
    }

    public function entity()
    {
        return $this->morphTo();
    }
}