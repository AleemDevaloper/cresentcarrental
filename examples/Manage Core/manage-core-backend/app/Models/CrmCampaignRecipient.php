<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmCampaignRecipient extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_campaign_recipients';

    protected $fillable = [
        'campaign_id', 'entity_type', 'entity_id', 'email', 'name',
        'status', 'email_id', 'sent_at', 'opened_at', 'clicked_at',
        'replied_at', 'bounced_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'replied_at' => 'datetime',
        'bounced_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(CrmCampaign::class, 'campaign_id');
    }

    public function email()
    {
        return $this->belongsTo(CrmEmail::class, 'email_id');
    }
}