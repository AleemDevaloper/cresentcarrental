<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ThemeConfig extends Model
{
    protected $fillable = [
        'name',
        'settings',
        'created_by',
    ];

    protected $casts = [
        'settings' => 'json',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ThemeAssignment::class);
    }
}
