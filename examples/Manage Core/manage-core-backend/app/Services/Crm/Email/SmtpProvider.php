<?php

namespace App\Services\Crm\Email;

use App\Models\CrmEmailAccount;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SmtpProvider implements EmailProviderInterface
{
    public function provider(): string
    {
        return 'smtp';
    }

    public function connect(array $credentials): array
    {
        return [
            'access_token' => null,
            'refresh_token' => null,
            'token_type' => 'smtp',
            'token_expires_at' => null,
            'smtp_host' => $credentials['smtp_host'] ?? null,
            'smtp_port' => $credentials['smtp_port'] ?? 587,
            'smtp_username' => $credentials['smtp_username'] ?? null,
            'smtp_password' => encrypt($credentials['smtp_password'] ?? ''),
            'smtp_encryption' => $credentials['smtp_encryption'] ?? 'tls',
        ];
    }

    public function refreshToken(CrmEmailAccount $account): string
    {
        return ''; // SMTP doesn't use tokens
    }

    public function fetchMessages(CrmEmailAccount $account, ?string $cursor = null, int $limit = 50): array
    {
        return ['messages' => [], 'cursor' => null];
    }

    public function fetchThread(CrmEmailAccount $account, string $threadId): array
    {
        return [];
    }

    public function sendMessage(CrmEmailAccount $account, array $payload): array
    {
        try {
            config([
                'mail.mailers.dynamic_smtp' => [
                    'transport' => 'smtp',
                    'host' => $account->smtp_host,
                    'port' => $account->smtp_port,
                    'encryption' => $account->smtp_encryption,
                    'username' => $account->smtp_username,
                    'password' => $account->getDecryptedRefreshToken() ?: $account->smtp_password,
                    'timeout' => 30,
                ],
            ]);
            $fromEmail = $account->email_address;
            $fromName = $account->display_name;
            $bodyHtml = $payload['body'] ?? '';

            Mail::mailer('dynamic_smtp')->send([], [], function ($message) use ($payload, $fromEmail, $fromName, $bodyHtml) {
                $message->from($fromEmail, $fromName)
                    ->subject($payload['subject'])
                    ->html($bodyHtml);

                foreach (explode(',', $payload['to']) as $to) {
                    if (trim($to)) $message->to(trim($to));
                }
                if (!empty($payload['cc'])) {
                    foreach (explode(',', $payload['cc']) as $cc) {
                        if (trim($cc)) $message->cc(trim($cc));
                    }
                }
                if (!empty($payload['bcc'])) {
                    foreach (explode(',', $payload['bcc']) as $bcc) {
                        if (trim($bcc)) $message->bcc(trim($bcc));
                    }
                }
                if (!empty($payload['attachments'])) {
                    foreach ($payload['attachments'] as $a) {
                        $message->attach($a['path'], [
                            'as' => $a['name'],
                            'mime' => $a['mime_type'] ?? null,
                        ]);
                    }
                }
            });
            return ['provider_id' => 'smtp-' . md5($payload['to'] . $payload['subject'])];
        } catch (\Throwable $e) {
            Log::error('SMTP send failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function registerWebhook(CrmEmailAccount $account, string $url): array
    {
        return ['ok' => true];
    }
}