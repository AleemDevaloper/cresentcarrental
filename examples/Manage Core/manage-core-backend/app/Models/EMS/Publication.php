<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'research_project_id', 'title', 'abstract',
        'authors', 'journal', 'volume', 'issue', 'pages',
        'doi', 'issn', 'publication_date', 'publisher',
        'keywords', 'file_path', 'url', 'type', 'status',
    ];

    protected $casts = [
        'authors' => 'array',
        'keywords' => 'array',
        'publication_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function researchProject(): BelongsTo
    {
        return $this->belongsTo(ResearchProject::class);
    }
}
