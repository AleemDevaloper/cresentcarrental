<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'registration_number', 'model', 'make',
        'year', 'color', 'capacity', 'fuel_type', 'insurance_number',
        'insurance_expiry', 'tax_token_number', 'tax_token_expiry',
        'fitness_certificate', 'fitness_expiry', 'status', 'notes',
    ];

    protected $casts = [
        'year' => 'integer',
        'insurance_expiry' => 'date',
        'tax_token_expiry' => 'date',
        'fitness_expiry' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
