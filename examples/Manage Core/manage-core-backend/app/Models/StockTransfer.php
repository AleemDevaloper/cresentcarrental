<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTransfer extends Model
{
    protected $fillable = [
        'transfer_no', 'from_warehouse', 'to_warehouse', 'material',
        'quantity', 'carrier', 'tracking_no', 'status', 'request_date',
    ];

    protected $casts = [
        'quantity' => 'decimal:10,2',
        'request_date' => 'date',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'material');
    }
}
