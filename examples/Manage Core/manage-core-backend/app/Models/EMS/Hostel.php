<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hostel extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'name', 'code', 'type', 'gender',
        'total_rooms', 'total_beds', 'available_beds', 'address',
        'contact_number', 'warden_name', 'warden_contact',
        'amenities', 'rules', 'status', 'description',
    ];

    protected $casts = [
        'amenities' => 'array',
        'rules' => 'array',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(HostelAllocation::class);
    }
}
