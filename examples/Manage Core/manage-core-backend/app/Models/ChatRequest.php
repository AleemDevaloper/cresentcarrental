<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatRequest extends Model
{
    protected $fillable = ['from_user_id', 'to_user_id', 'status'];
    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function session()
    {
        return $this->hasOne(ChatSession::class, 'chat_request_id');
    }
}
