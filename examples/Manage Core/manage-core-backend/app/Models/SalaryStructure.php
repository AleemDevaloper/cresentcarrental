<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalaryStructure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    public function components(): BelongsToMany
    {
        return $this->belongsToMany(SalaryComponent::class, 'salary_structure_component')
                    ->withPivot('override_value')
                    ->withTimestamps();
    }

    public function employeeSalaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class);
    }
}
