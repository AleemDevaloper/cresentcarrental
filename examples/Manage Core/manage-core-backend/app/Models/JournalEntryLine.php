<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntryLine extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'journal_entry_lines';

    protected $fillable = [
        'journal_entry_id',
        'account_id',
        'debit',
        'credit',
        'description',
        'cost_center_id',
        'analytic_account_id',
    ];

    protected $casts = [
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
    ];

    public function journalEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'journal_entry_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function costCenter()
    {
        return $this->belongsTo(CostCenter::class, 'cost_center_id');
    }

    public function analyticAccount()
    {
        return $this->belongsTo(AnalyticAccount::class, 'analytic_account_id');
    }
}
