<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmEmailAttachment extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_email_attachments';

    protected $fillable = [
        'email_id', 'name', 'original_name', 'mime_type', 'size',
        'path', 'disk', 'content_id', 'is_inline',
    ];

    protected $casts = [
        'size' => 'integer',
        'is_inline' => 'boolean',
    ];

    public function email()
    {
        return $this->belongsTo(CrmEmail::class, 'email_id');
    }
}