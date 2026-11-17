<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmNotification extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_notifications';

    protected $fillable = [
        'user_id', 'type', 'title', 'body', 'icon', 'color', 'link',
        'entity_type', 'entity_id', 'data', 'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function markRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }

    public function entity()
    {
        return $this->morphTo();
    }
}