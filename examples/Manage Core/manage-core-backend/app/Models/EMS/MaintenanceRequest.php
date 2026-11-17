<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MaintenanceRequest extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'maintenance_requests';

    protected $fillable = [
        'facility_id', 'reported_by', 'title', 'description',
        'priority', 'category', 'requested_date', 'scheduled_date',
        'completed_date', 'assigned_to', 'cost', 'status', 'remarks',
    ];

    protected $casts = [
        'requested_date' => 'date',
        'scheduled_date' => 'date',
        'completed_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
