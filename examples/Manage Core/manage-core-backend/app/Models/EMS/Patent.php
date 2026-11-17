<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patent extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'title', 'inventors', 'patent_number',
        'filing_date', 'granted_date', 'expiry_date',
        'description', 'category', 'status', 'country',
        'file_path', 'notes',
    ];

    protected $casts = [
        'inventors' => 'array',
        'filing_date' => 'date',
        'granted_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
