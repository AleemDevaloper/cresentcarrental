<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HrmsCandidate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'resume_path', 'source', 'skills'
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(HrmsApplication::class, 'candidate_id');
    }
}
