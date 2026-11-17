<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmDuplicateMember extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_duplicate_members';

    protected $fillable = [
        'group_id', 'entity_type', 'entity_id', 'match_score',
        'field_matches', 'is_ignored',
    ];

    protected $casts = [
        'match_score' => 'float',
        'field_matches' => 'array',
        'is_ignored' => 'boolean',
    ];

    public function group()
    {
        return $this->belongsTo(CrmDuplicateGroup::class, 'group_id');
    }
}