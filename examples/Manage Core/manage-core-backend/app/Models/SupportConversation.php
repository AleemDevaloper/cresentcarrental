<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportConversation extends Model
{
    protected $fillable = ['subject', 'status', 'closed_at'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function participants()
    {
        return $this->hasMany(SupportConversationParticipant::class, 'conversation_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'support_conversation_participants', 'conversation_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(SupportMessage::class, 'conversation_id')->orderBy('created_at', 'asc');
    }

    public function latestMessage()
    {
        return $this->hasOne(SupportMessage::class, 'conversation_id')->latest();
    }
}
