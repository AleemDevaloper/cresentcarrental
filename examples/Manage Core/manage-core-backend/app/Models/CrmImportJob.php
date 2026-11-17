<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmImportJob extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_import_jobs';

    protected $fillable = [
        'entity_type', 'file_name', 'disk', 'path', 'column_mapping',
        'total_rows', 'processed_rows', 'success_count', 'skipped_count',
        'failed_count', 'duplicate_count', 'status', 'error_report',
        'error', 'user_id', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'column_mapping' => 'array',
        'error_report' => 'array',
        'total_rows' => 'integer',
        'processed_rows' => 'integer',
        'success_count' => 'integer',
        'skipped_count' => 'integer',
        'failed_count' => 'integer',
        'duplicate_count' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function rows()
    {
        return $this->hasMany(CrmImportRow::class, 'job_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getProgressPercentAttribute(): int
    {
        if ($this->total_rows == 0) return 0;
        return (int) round(($this->processed_rows / $this->total_rows) * 100);
    }
}