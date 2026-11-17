<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmEmailSignature extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_email_signatures';

    protected $fillable = [
        'user_id', 'name', 'body', 'is_default', 'is_shared', 'created_by',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_shared' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}