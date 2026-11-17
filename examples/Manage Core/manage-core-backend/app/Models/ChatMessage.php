<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ['session_id', 'sender_id', 'text'];
    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];

    public function session()
    {
        return $this->belongsTo(ChatSession::class, 'session_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
