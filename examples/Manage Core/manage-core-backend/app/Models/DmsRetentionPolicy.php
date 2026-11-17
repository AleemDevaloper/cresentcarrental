<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsRetentionPolicy extends Model
{
    use SoftDeletes;

    protected $table = 'dms_retention_policies';

    protected $fillable = [
        'tenant_id', 'name', 'slug', 'description', 'category',
        'retention_days', 'retention_period', 'action', 'conditions',
        'is_active', 'created_by',
    ];

    protected $casts = [
        'conditions' => 'array',
        'is_active' => 'boolean',
        'retention_days' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
