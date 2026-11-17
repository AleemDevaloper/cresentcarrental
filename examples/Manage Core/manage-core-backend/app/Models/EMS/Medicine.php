<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medicine extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'name', 'generic_name', 'category',
        'manufacturer', 'dosage_form', 'strength', 'unit',
        'quantity', 'minimum_quantity', 'price', 'expiry_date',
        'batch_number', 'storage_conditions', 'description', 'status',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'price' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
