<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmDuplicateGroup extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_duplicate_groups';

    protected $fillable = [
        'entity_type', 'field_signature', 'match_field', 'match_value',
        'member_count', 'status', 'resolved_at', 'primary_record_id',
        'resolved_by', 'notes',
    ];

    protected $casts = [
        'field_signature' => 'array',
        'member_count' => 'integer',
        'resolved_at' => 'datetime',
    ];

    public function members()
    {
        return $this->hasMany(CrmDuplicateMember::class, 'group_id');
    }
}