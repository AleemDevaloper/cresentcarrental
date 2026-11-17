<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatFile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'channel_id', 'file_name', 'file_path', 'file_size', 'file_type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(ChatChannel::class, 'channel_id');
    }
}
