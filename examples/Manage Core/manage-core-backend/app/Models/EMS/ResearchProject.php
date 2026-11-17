<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResearchProject extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'research_projects';

    protected $fillable = [
        'institution_id', 'title', 'description', 'lead_researcher',
        'co_researchers', 'department', 'funding_source',
        'budget', 'start_date', 'end_date', 'status',
        'findings', 'conclusion', 'cover_image',
    ];

    protected $casts = [
        'co_researchers' => 'array',
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class);
    }
}
