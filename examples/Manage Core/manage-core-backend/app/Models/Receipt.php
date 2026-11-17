<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'receipts';

    protected $fillable = [
        'client_id', 'number', 'date', 'method', 'bank', 'amount', 'allocated', 'reference_no', 'invoice_ref', 'received_by', 'notes', 'status', 'created_by'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'allocated' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
