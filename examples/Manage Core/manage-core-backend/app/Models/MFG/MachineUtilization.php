<?php

namespace App\Models\MFG;

use Illuminate\Database\Eloquent\Model;

class MachineUtilization extends Model
{
    protected $table = 'mfg_machine_utilizations';

    protected $fillable = [
        'machine_name',
        'status',
        'utilization_percent',
        'production_hours',
        'downtime_hours',
        'output_units',
        'efficiency',
        'date',
    ];

    protected $casts = [
        'utilization_percent' => 'decimal:2',
        'production_hours' => 'decimal:2',
        'downtime_hours' => 'decimal:2',
        'efficiency' => 'decimal:2',
        'date' => 'date',
    ];
}
