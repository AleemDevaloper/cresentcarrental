<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HrmsExitClearanceStage extends Model
{
    protected $fillable = [
        'resignation_id',
        'department',
        'status',
        'processed_by',
        'comments',
        'processed_at'
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    public function resignation(): BelongsTo
    {
        return $this->belongsTo(Resignation::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
