<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmEmail extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_emails';

    protected $fillable = [
        'thread_id', 'email_account_id', 'provider_message_id', 'message_id_header',
        'in_reply_to', 'references', 'direction', 'folder',
        'from_email', 'from_name', 'to_emails', 'cc_emails', 'bcc_emails',
        'subject', 'body_html', 'body_text',
        'is_read', 'is_starred', 'is_draft', 'is_scheduled', 'scheduled_at',
        'status', 'sent_at', 'delivered_at', 'opened_at', 'clicked_at', 'replied_at', 'bounced_at',
        'open_count', 'click_count', 'bounce_reason',
        'track_opens', 'track_clicks',
        'campaign_id', 'sequence_id', 'template_id', 'user_id',
        'entity_type', 'entity_id', 'headers',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_starred' => 'boolean',
        'is_draft' => 'boolean',
        'is_scheduled' => 'boolean',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'replied_at' => 'datetime',
        'bounced_at' => 'datetime',
        'open_count' => 'integer',
        'click_count' => 'integer',
        'track_opens' => 'boolean',
        'track_clicks' => 'boolean',
        'headers' => 'array',
    ];

    public function thread()
    {
        return $this->belongsTo(CrmEmailThread::class, 'thread_id');
    }

    public function account()
    {
        return $this->belongsTo(CrmEmailAccount::class, 'email_account_id');
    }

    public function attachments()
    {
        return $this->hasMany(CrmEmailAttachment::class, 'email_id');
    }

    public function events()
    {
        return $this->hasMany(CrmEmailEvent::class, 'email_id');
    }

    public function template()
    {
        return $this->belongsTo(CrmEmailTemplate::class, 'template_id');
    }

    public function entity()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}