<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmNote extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_notes';

    protected $fillable = [
        'content', 'customer_id', 'lead_id', 'deal_id', 'contact_id',
        'activity_id', 'is_pinned', 'created_by',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CrmCustomer::class, 'customer_id');
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(CrmLead::class, 'lead_id');
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(CrmDeal::class, 'deal_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(CrmActivity::class, 'activity_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}