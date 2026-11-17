<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'campus_id', 'name', 'code', 'description', 'floors',
        'total_rooms', 'address', 'latitude', 'longitude', 'status',
        'constructed_year',
    ];

    protected $casts = [
        'constructed_year' => 'integer',
    ];

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
