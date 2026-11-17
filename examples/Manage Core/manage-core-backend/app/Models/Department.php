<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'description',
        'code',
        'head_of_department',
        'budget',
        'location',
        'status',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
    ];

    public function designations(): HasMany
    {
        return $this->hasMany(Designation::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
}
