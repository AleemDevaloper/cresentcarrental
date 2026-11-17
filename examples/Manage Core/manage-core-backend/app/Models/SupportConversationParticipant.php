<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportConversationParticipant extends Model
{
    protected $fillable = ['conversation_id', 'user_id'];
    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];

    public function conversation()
    {
        return $this->belongsTo(SupportConversation::class, 'conversation_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
