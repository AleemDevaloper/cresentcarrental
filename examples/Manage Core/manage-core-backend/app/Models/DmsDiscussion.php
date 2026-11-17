<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDiscussion extends Model
{
    protected $table = 'dms_discussions';

    protected $fillable = [
        'document_id', 'user_id', 'title', 'content',
        'is_resolved', 'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(DmsDiscussionReply::class, 'discussion_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
