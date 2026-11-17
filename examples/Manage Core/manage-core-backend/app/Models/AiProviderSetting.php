<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiProviderSetting extends Model
{
    protected $connection = 'mysql';

    protected $fillable = [
        'name',
        'provider_type',
        'api_key',
        'base_url',
        'default_model',
        'available_models',
        'settings',
        'is_active',
        'is_default',
        'sort_order',
    ];

    protected $casts = [
        'available_models' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saved(function ($model) {
            if ($model->is_default) {
                static::where('id', '!=', $model->id)->update(['is_default' => false]);
            }
        });
    }
}
