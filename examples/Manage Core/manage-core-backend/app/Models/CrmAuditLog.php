<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmAuditLog extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_audit_logs';

    public $timestamps = false;

    protected $fillable = [
        'user_id', 'user_name', 'ip_address', 'user_agent', 'action', 'module',
        'entity_type', 'entity_id', 'entity_label', 'old_values', 'new_values',
        'metadata', 'description', 'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}