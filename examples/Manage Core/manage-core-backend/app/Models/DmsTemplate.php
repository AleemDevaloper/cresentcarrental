<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsTemplate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'name', 'slug', 'description', 'category', 'file_path',
        'thumbnail_path', 'content', 'fields', 'tags', 'is_public', 'usage_count',
        'created_by',
    ];

    protected $casts = [
        'fields' => 'array',
        'tags' => 'array',
        'is_public' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
