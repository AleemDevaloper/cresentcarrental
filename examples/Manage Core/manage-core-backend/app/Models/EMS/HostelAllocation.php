<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HostelAllocation extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'hostel_allocations';

    protected $fillable = [
        'institution_id', 'hostel_id', 'student_id', 'room_number',
        'bed_number', 'allocation_date', 'end_date', 'status',
        'remarks',
    ];

    protected $casts = [
        'allocation_date' => 'date',
        'end_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function hostel(): BelongsTo
    {
        return $this->belongsTo(Hostel::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
