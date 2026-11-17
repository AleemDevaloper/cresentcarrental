<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HrmsEmployeeOnboarding extends Model
{
    protected $fillable = [
        'user_id',
        'checklist_id',
        'completed_items',
        'status',
        'started_at',
        'completed_at'
    ];

    protected $casts = [
        'completed_items' => 'array',
        'started_at' => 'date',
        'completed_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checklist(): BelongsTo
    {
        return $this->belongsTo(HrmsOnboardingChecklist::class, 'checklist_id');
    }
}
