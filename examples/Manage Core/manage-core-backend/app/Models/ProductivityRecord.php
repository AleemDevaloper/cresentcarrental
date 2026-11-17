<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductivityRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'owner',
        'status',
        'priority',
        'amount',
        'due_date',
        'progress',
        'notes',
        'attachment_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
