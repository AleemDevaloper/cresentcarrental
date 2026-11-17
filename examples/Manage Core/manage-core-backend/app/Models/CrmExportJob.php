<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmExportJob extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_export_jobs';

    protected $fillable = [
        'entity_type', 'format', 'scope', 'filters', 'columns', 'selected_ids',
        'total_rows', 'status', 'file_path', 'file_size', 'error',
        'user_id', 'started_at', 'completed_at', 'expires_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'columns' => 'array',
        'selected_ids' => 'array',
        'total_rows' => 'integer',
        'file_size' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function isReady(): bool
    {
        return $this->status === 'completed' && $this->file_path !== null;
    }
}