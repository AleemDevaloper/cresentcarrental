<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportRoute extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'transport_routes';

    protected $fillable = [
        'institution_id', 'name', 'description', 'start_point',
        'end_point', 'distance_km', 'duration_minutes', 'stops',
        'status', 'notes',
    ];

    protected $casts = [
        'stops' => 'array',
        'distance_km' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
