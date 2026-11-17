<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FxRevaluation extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'fx_revaluations';

    protected $fillable = [
        'revaluation_date',
        'period_start',
        'period_end',
        'status',
        'total_gain',
        'total_loss',
        'net_position',
        'notes',
        'approved_by',
        'approved_at',
        'created_by',
    ];

    protected $casts = [
        'revaluation_date' => 'date',
        'period_start' => 'date',
        'period_end' => 'date',
        'total_gain' => 'decimal:4',
        'total_loss' => 'decimal:4',
        'net_position' => 'decimal:4',
        'approved_at' => 'datetime',
    ];

    public function lines(): HasMany
    {
        return $this->hasMany(FxRevaluationLine::class, 'revaluation_id');
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePendingApproval($query)
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
