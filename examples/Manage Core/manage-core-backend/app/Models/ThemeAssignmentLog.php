<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemeAssignmentLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
