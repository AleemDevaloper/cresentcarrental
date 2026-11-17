<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmCampaign extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_campaigns';

    protected $fillable = [
        'name', 'type', 'status', 'start_date', 'end_date',
        'budget', 'actual_cost', 'expected_revenue', 'actual_revenue',
        'target_audience', 'description', 'assigned_to', 'created_by',
        'subject', 'from_name', 'from_email', 'reply_to',
        'scheduled_at', 'sent_at', 'body', 'template_id',
        'recipient_count', 'delivered_count', 'opened_count',
        'clicked_count', 'replied_count', 'bounced_count',
        'unsubscribed_count', 'converted_count', 'revenue',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'expected_revenue' => 'decimal:2',
        'actual_revenue' => 'decimal:2',
        'revenue' => 'decimal:2',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'recipient_count' => 'integer',
        'delivered_count' => 'integer',
        'opened_count' => 'integer',
        'clicked_count' => 'integer',
        'replied_count' => 'integer',
        'bounced_count' => 'integer',
        'unsubscribed_count' => 'integer',
        'converted_count' => 'integer',
    ];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function recipients()
    {
        return $this->hasMany(CrmCampaignRecipient::class, 'campaign_id');
    }

    public function template()
    {
        return $this->belongsTo(CrmEmailTemplate::class, 'template_id');
    }

    public function getOpenRateAttribute(): float
    {
        if ($this->delivered_count == 0) return 0.0;
        return round(($this->opened_count / max(1, $this->delivered_count)) * 100, 1);
    }

    public function getClickRateAttribute(): float
    {
        if ($this->delivered_count == 0) return 0.0;
        return round(($this->clicked_count / max(1, $this->delivered_count)) * 100, 1);
    }
}