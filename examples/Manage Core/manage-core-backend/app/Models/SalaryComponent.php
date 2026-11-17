<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SalaryComponent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'is_fixed',
        'calculation_type',
        'percentage_of',
        'value',
        'is_taxable',
        'is_statutory',
        'status',
    ];

    protected $casts = [
        'is_fixed' => 'boolean',
        'is_taxable' => 'boolean',
        'is_statutory' => 'boolean',
        'value' => 'decimal:2',
    ];

    public function parentComponent(): BelongsTo
    {
        return $this->belongsTo(SalaryComponent::class, 'percentage_of');
    }

    public function structures(): BelongsToMany
    {
        return $this->belongsToMany(SalaryStructure::class, 'salary_structure_component')
                    ->withPivot('override_value')
                    ->withTimestamps();
    }
}
