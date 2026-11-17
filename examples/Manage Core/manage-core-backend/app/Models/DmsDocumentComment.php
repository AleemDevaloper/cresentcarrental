<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocumentComment extends Model
{
    protected $fillable = [
        'document_id', 'user_id', 'content', 'mentions', 'parent_id', 'resolved',
        'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'mentions' => 'array',
        'resolved' => 'boolean',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
