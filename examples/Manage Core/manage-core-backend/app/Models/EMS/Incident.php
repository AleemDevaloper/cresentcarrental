<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Incident extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'reported_by', 'incident_type',
        'title', 'description', 'location', 'incident_date',
        'incident_time', 'severity', 'actions_taken',
        'reported_to', 'status', 'resolution', 'resolved_date',
        'notes',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'incident_time' => 'datetime',
        'resolved_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
