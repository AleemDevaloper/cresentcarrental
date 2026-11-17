<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatChannelMessage extends Model
{
    use HasFactory;

    protected $fillable = ['channel_id', 'user_id', 'content', 'type', 'parent_id'];

    public function channel()
    {
        return $this->belongsTo(ChatChannel::class, 'channel_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('created_at', 'asc');
    }
}
