<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campus extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'name', 'short_name', 'code', 'address', 'city',
        'province', 'postal_code', 'country', 'phone', 'email', 'website',
        'latitude', 'longitude', 'status', 'established_date',
    ];

    protected $casts = [
        'established_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class);
    }
}
