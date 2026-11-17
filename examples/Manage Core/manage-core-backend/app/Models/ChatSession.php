<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    protected $fillable = ['chat_request_id', 'from_user_cleared_at', 'to_user_cleared_at'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'from_user_cleared_at' => 'datetime',
        'to_user_cleared_at' => 'datetime'
    ];

    public function chatRequest()
    {
        return $this->belongsTo(ChatRequest::class);
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'session_id')->orderBy('created_at', 'asc');
    }

    public function participants()
    {
        return $this->chatRequest()->with(['fromUser', 'toUser']);
    }
}
