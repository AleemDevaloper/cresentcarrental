<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JournalEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'journal_entries';

    protected $fillable = [
        'entry_number',
        'entry_date',
        'reference_type',
        'reference_id',
        'description',
        'total_debit',
        'total_credit',
        'status',
        'fiscal_year_id',
        'period_id',
        'reversal_of',
        'posted_by',
        'posted_at',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'total_debit' => 'decimal:2',
        'total_credit' => 'decimal:2',
        'posted_at' => 'datetime',
    ];

    public function lines()
    {
        return $this->hasMany(JournalEntryLine::class, 'journal_entry_id');
    }

    public function poster()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function reversals()
    {
        return $this->hasMany(JournalEntry::class, 'reversal_of');
    }

    public function reversedEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'reversal_of');
    }

    public function fiscalYear()
    {
        return $this->belongsTo(FiscalYear::class, 'fiscal_year_id');
    }

    public function period()
    {
        return $this->belongsTo(Period::class, 'period_id');
    }

    public static function generateEntryNumber(): string
    {
        $today = now()->format('Ymd');
        $prefix = 'JE-' . $today . '-';
        $lastEntry = static::withoutTrashed()
            ->where('entry_number', 'like', $prefix . '%')
            ->orderByRaw("CAST(SUBSTRING(entry_number, " . (strlen($prefix) + 1) . ") AS UNSIGNED) DESC")
            ->first();

        if ($lastEntry) {
            $lastNumber = (int) substr($lastEntry->entry_number, strlen($prefix));
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
