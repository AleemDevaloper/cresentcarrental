<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeProfile extends Model
{
    protected $fillable = [
        'user_id',
        'education',
        'experience',
        'skills',
        'certifications',
        'languages',
        'family_details',
    ];

    protected $casts = [
        'education' => 'array',
        'experience' => 'array',
        'skills' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'family_details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
