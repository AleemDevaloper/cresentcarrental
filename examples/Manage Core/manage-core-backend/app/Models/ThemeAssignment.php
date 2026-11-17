<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemeAssignment extends Model
{
    protected $fillable = [
        'theme_config_id',
        'assignable_type',
        'assignable_id',
        'options',
        'lock_settings',
        'priority',
        'created_by',
    ];

    protected $casts = [
        'options' => 'json',
        'lock_settings' => 'json',
    ];

    public function themeConfig(): BelongsTo
    {
        return $this->belongsTo(ThemeConfig::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
