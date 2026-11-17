<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatChannel extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'type', 'created_by', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->hasMany(ChatChannelMember::class, 'channel_id');
    }

    public function messages()
    {
        return $this->hasMany(ChatChannelMessage::class, 'channel_id')->orderBy('created_at', 'asc');
    }

    public function files()
    {
        return $this->hasMany(ChatFile::class, 'channel_id');
    }
}
