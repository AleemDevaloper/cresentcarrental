<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmImportRow extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_import_rows';

    protected $fillable = [
        'job_id', 'row_number', 'raw_data', 'status',
        'created_entity_id', 'error',
    ];

    protected $casts = [
        'raw_data' => 'array',
    ];

    public function job()
    {
        return $this->belongsTo(CrmImportJob::class, 'job_id');
    }
}