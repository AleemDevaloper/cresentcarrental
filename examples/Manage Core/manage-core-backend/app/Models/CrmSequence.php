<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmSequence extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_sequences';

    protected $fillable = [
        'name', 'description', 'status', 'owner_id', 'target_filters',
        'is_active', 'active_enrollments', 'completed_enrollments', 'stopped_enrollments',
        'created_by',
    ];

    protected $casts = [
        'target_filters' => 'array',
        'is_active' => 'boolean',
        'active_enrollments' => 'integer',
        'completed_enrollments' => 'integer',
        'stopped_enrollments' => 'integer',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function steps()
    {
        return $this->hasMany(CrmSequenceStep::class, 'sequence_id')->orderBy('order');
    }

    public function enrollments()
    {
        return $this->hasMany(CrmSequenceEnrollment::class, 'sequence_id');
    }
}