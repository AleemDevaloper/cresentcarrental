<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmEmailAccount extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_email_accounts';

    protected $fillable = [
        'account_name', 'email_address', 'display_name', 'provider', 'connection_type',
        'access_token', 'refresh_token', 'token_type', 'token_expires_at',
        'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption',
        'imap_host', 'imap_port', 'imap_username', 'imap_password', 'imap_encryption',
        'status', 'sync_status', 'last_sync_at', 'sync_cursor',
        'sent_count', 'received_count', 'user_id', 'is_default',
        'track_opens', 'track_clicks', 'settings',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'last_sync_at' => 'datetime',
        'is_default' => 'boolean',
        'track_opens' => 'boolean',
        'track_clicks' => 'boolean',
        'settings' => 'array',
    ];

    protected $hidden = [
        'access_token', 'refresh_token', 'smtp_password', 'imap_password',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function emails()
    {
        return $this->hasMany(CrmEmail::class, 'email_account_id');
    }

    public function threads()
    {
        return $this->hasMany(CrmEmailThread::class, 'email_account_id');
    }

    public function isOAuth(): bool
    {
        return $this->connection_type === 'oauth';
    }

    public function isSmtp(): bool
    {
        return $this->provider === 'smtp';
    }

    public function getDecryptedAccessToken(): ?string
    {
        if (!$this->access_token) return null;
        try {
            return \Illuminate\Support\Facades\Crypt::decryptString($this->access_token);
        } catch (\Throwable $e) {
            return $this->access_token;
        }
    }

    public function getDecryptedRefreshToken(): ?string
    {
        if (!$this->refresh_token) return null;
        try {
            return \Illuminate\Support\Facades\Crypt::decryptString($this->refresh_token);
        } catch (\Throwable $e) {
            return $this->refresh_token;
        }
    }
}