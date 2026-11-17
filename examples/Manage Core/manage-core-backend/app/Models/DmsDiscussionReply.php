<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDiscussionReply extends Model
{
    protected $table = 'dms_discussion_replies';

    protected $fillable = [
        'discussion_id', 'user_id', 'content',
    ];

    public function discussion(): BelongsTo
    {
        return $this->belongsTo(DmsDiscussion::class, 'discussion_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
