<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentModel extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'parents';

    protected $fillable = [
        'institution_id', 'student_id', 'user_id', 'first_name',
        'last_name', 'email', 'phone', 'mobile', 'occupation',
        'relationship', 'address', 'city', 'province',
        'is_guardian', 'is_emergency_contact', 'status',
    ];

    protected $casts = [
        'is_guardian' => 'boolean',
        'is_emergency_contact' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
