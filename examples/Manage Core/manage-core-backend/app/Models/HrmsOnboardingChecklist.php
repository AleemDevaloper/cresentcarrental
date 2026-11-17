<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HrmsOnboardingChecklist extends Model
{
    protected $fillable = ['name', 'items', 'is_active'];

    protected $casts = [
        'items' => 'array',
        'is_active' => 'boolean',
    ];

    public function employeeOnboardings(): HasMany
    {
        return $this->hasMany(HrmsEmployeeOnboarding::class, 'checklist_id');
    }
}
