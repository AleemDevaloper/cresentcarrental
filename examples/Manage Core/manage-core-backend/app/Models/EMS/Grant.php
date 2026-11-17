<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Grant extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'title', 'description', 'funding_agency',
        'principal_investigator', 'co_investigators',
        'grant_number', 'amount', 'currency', 'start_date',
        'end_date', 'status', 'reporting_requirements', 'notes',
    ];

    protected $casts = [
        'co_investigators' => 'array',
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
