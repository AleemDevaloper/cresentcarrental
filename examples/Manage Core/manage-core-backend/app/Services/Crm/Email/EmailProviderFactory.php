<?php

namespace App\Services\Crm\Email;

use App\Models\CrmEmailAccount;

class EmailProviderFactory
{
    public static function make(string $provider): EmailProviderInterface
    {
        return match (strtolower($provider)) {
            'gmail', 'google' => new GmailProvider(),
            'microsoft', 'outlook', 'office365' => new MicrosoftProvider(),
            'smtp' => new SmtpProvider(),
            'imap' => new ImapProvider(),
            default => throw new \InvalidArgumentException("Unknown email provider: $provider"),
        };
    }

    public static function for(CrmEmailAccount $account): EmailProviderInterface
    {
        return static::make($account->provider);
    }
}