<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmEmailTemplate extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_email_templates';

    protected $fillable = [
        'name', 'subject', 'body', 'category',
        'is_shared', 'is_active', 'owner_id', 'variables', 'created_by',
    ];

    protected $casts = [
        'is_shared' => 'boolean',
        'is_active' => 'boolean',
        'variables' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}