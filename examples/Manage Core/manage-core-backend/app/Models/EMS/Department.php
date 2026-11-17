<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'campus_id', 'name', 'short_name', 'code',
        'description', 'head_of_department', 'contact_email', 'contact_phone',
        'established_date', 'status',
    ];

    protected $casts = [
        'established_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
