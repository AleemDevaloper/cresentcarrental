<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmDocument extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_documents';

    protected $fillable = [
        'name', 'original_name', 'mime_type', 'size', 'path', 'disk',
        'related_type', 'related_id', 'visibility', 'version', 'parent_id',
        'description', 'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function related()
    {
        return $this->morphTo();
    }

    public function versions()
    {
        return $this->hasMany(CrmDocument::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(CrmDocument::class, 'parent_id');
    }
}