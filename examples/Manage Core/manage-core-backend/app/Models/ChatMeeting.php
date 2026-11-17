<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatMeeting extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'organizer_id', 'scheduled_at', 'duration_minutes', 'status', 'meeting_url', 'recording_url'];
    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }
}
