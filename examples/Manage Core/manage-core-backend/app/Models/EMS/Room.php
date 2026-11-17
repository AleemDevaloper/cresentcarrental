<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'building_id', 'room_number', 'name', 'floor', 'capacity',
        'type', 'status', 'facilities', 'description',
    ];

    protected $casts = [
        'facilities' => 'array',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }
}
