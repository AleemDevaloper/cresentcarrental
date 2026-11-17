<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $fillable = [
        'institution_id', 'title', 'author', 'publisher', 'isbn',
        'edition', 'publication_year', 'category', 'language',
        'description', 'shelf_location', 'quantity', 'available_quantity',
        'cover_image', 'status',
    ];

    protected $casts = [
        'publication_year' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(BookIssue::class);
    }
}
