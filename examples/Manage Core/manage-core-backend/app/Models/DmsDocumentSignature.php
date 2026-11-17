<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DmsDocumentSignature extends Model
{
    protected $fillable = [
        'document_id', 'signer_id', 'signer_email', 'signer_name', 'signature_type',
        'signing_order', 'signature_data', 'certificate_info', 'signed_at', 'status',
        'ip_address', 'user_agent', 'sent_at', 'viewed_at', 'reminder_sent_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(DmsDocument::class, 'document_id');
    }

    public function signer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signer_id');
    }
}
