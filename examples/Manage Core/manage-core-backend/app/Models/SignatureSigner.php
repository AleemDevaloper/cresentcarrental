<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignatureSigner extends Model
{
    protected $fillable = ['signature_request_id', 'user_id', 'email', 'signing_order', 'status', 'signed_at', 'ip_address', 'user_agent'];

    protected $casts = [
        'signed_at' => 'datetime',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(SignatureRequest::class, 'signature_request_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
