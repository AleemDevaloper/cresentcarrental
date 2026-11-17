<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignatureAuditLog extends Model
{
    protected $fillable = ['signature_request_id', 'action', 'user_id', 'details'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(SignatureRequest::class, 'signature_request_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
