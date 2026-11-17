<?php

namespace App\Models\EMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookIssue extends Model
{
    use SoftDeletes;

    protected $connection = 'ems';

    protected $table = 'book_issues';

    protected $fillable = [
        'institution_id', 'book_id', 'user_id', 'issue_date',
        'due_date', 'return_date', 'status', 'remarks',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
