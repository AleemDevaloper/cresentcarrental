<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteAnalyticsEvent extends Model
{
    protected $fillable = [
        'event_name', 'session_id', 'page_path', 'page_title', 'target_label',
        'target_href', 'content_type', 'content_id', 'metadata', 'referrer',
        'user_agent', 'ip_address', 'occurred_at',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array', 'occurred_at' => 'datetime'];
    }
}
