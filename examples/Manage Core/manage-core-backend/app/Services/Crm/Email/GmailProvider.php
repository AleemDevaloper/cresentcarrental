<?php

namespace App\Services\Crm\Email;

use App\Models\CrmEmailAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GmailProvider implements EmailProviderInterface
{
    public function provider(): string
    {
        return 'gmail';
    }

    public function connect(array $credentials): array
    {
        $code = $credentials['code'] ?? null;
        $clientId = config('services.gmail.client_id', env('GMAIL_CLIENT_ID'));
        $clientSecret = config('services.gmail.client_secret', env('GMAIL_CLIENT_SECRET'));
        $redirect = config('services.gmail.redirect', env('GMAIL_REDIRECT_URI'));

        if (!$code || !$clientId || !$clientSecret) {
            throw new \RuntimeException('Missing Gmail OAuth credentials');
        }

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirect,
            'grant_type' => 'authorization_code',
        ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Gmail OAuth failed: ' . $response->body());
        }

        $data = $response->json();

        return [
            'access_token' => encrypt($data['access_token']),
            'refresh_token' => encrypt($data['refresh_token'] ?? null),
            'token_type' => $data['token_type'] ?? 'Bearer',
            'token_expires_at' => now()->addSeconds($data['expires_in'] ?? 3600),
        ];
    }

    public function refreshToken(CrmEmailAccount $account): string
    {
        $refreshToken = $account->getDecryptedRefreshToken();
        if (!$refreshToken) throw new \RuntimeException('No refresh token');

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'refresh_token' => $refreshToken,
            'client_id' => config('services.gmail.client_id', env('GMAIL_CLIENT_ID')),
            'client_secret' => config('services.gmail.client_secret', env('GMAIL_CLIENT_SECRET')),
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Gmail refresh failed: ' . $response->body());
        }

        $data = $response->json();
        $accessToken = $data['access_token'];

        $account->update([
            'access_token' => encrypt($accessToken),
            'token_expires_at' => now()->addSeconds($data['expires_in'] ?? 3600),
        ]);

        return $accessToken;
    }

    public function fetchMessages(CrmEmailAccount $account, ?string $cursor = null, int $limit = 50): array
    {
        $token = $this->getAccessToken($account);

        $params = ['maxResults' => $limit, 'q' => 'in:inbox OR in:sent'];
        if ($cursor) $params['pageToken'] = $cursor;

        $list = Http::withToken($token)
            ->get('https://gmail.googleapis.com/gmail/v1/users/me/messages', $params);

        if (!$list->successful()) {
            Log::warning('Gmail fetchMessages list failed', ['body' => $list->body()]);
            return ['messages' => [], 'cursor' => null];
        }

        $messages = [];
        foreach ($list->json('messages', []) as $m) {
            $detail = Http::withToken($token)
                ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$m['id']}?format=full");
            if ($detail->successful()) {
                $messages[] = $this->parseGmailMessage($detail->json(), $account);
            }
        }

        return ['messages' => $messages, 'cursor' => $list->json('nextPageToken')];
    }

    public function fetchThread(CrmEmailAccount $account, string $threadId): array
    {
        $token = $this->getAccessToken($account);
        $response = Http::withToken($token)
            ->get("https://gmail.googleapis.com/gmail/v1/users/me/threads/{$threadId}?format=full");

        if (!$response->successful()) return [];

        $messages = [];
        foreach ($response->json('messages', []) as $msg) {
            $messages[] = $this->parseGmailMessage($msg, $account);
        }
        return $messages;
    }

    public function sendMessage(CrmEmailAccount $account, array $payload): array
    {
        $token = $this->getAccessToken($account);

        $mime = $this->buildMime($payload);
        $raw = rtrim(strtr(base64_encode($mime), '+/', '-_'), '=');

        $response = Http::withToken($token)
            ->post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', ['raw' => $raw]);

        if (!$response->successful()) {
            throw new \RuntimeException('Gmail send failed: ' . $response->body());
        }

        return $response->json();
    }

    public function registerWebhook(CrmEmailAccount $account, string $url): array
    {
        $token = $this->getAccessToken($account);
        $response = Http::withToken($token)
            ->post('https://gmail.googleapis.com/gmail/v1/users/me/watch', [
                'topicName' => 'projects/' . config('services.gmail.project_id') . '/topics/' . config('services.gmail.topic'),
                'labelIds' => ['INBOX', 'SENT'],
            ]);
        return $response->json();
    }

    protected function getAccessToken(CrmEmailAccount $account): string
    {
        if ($account->token_expires_at && $account->token_expires_at->isPast()) {
            return $this->refreshToken($account);
        }
        return $account->getDecryptedAccessToken();
    }

    protected function parseGmailMessage(array $msg, CrmEmailAccount $account): array
    {
        $headers = [];
        foreach ($msg['payload']['headers'] ?? [] as $h) {
            $headers[strtolower($h['name'])] = $h['value'];
        }
        $body = $this->extractGmailBody($msg['payload'] ?? []);

        return [
            'provider_message_id' => $msg['id'],
            'thread_id' => $msg['threadId'] ?? null,
            'message_id_header' => $headers['message-id'] ?? null,
            'in_reply_to' => $headers['in-reply-to'] ?? null,
            'references' => $headers['references'] ?? null,
            'from_email' => $this->extractEmail($headers['from'] ?? ''),
            'from_name' => $this->extractName($headers['from'] ?? ''),
            'subject' => $headers['subject'] ?? '(no subject)',
            'body_html' => $body['html'] ?? '',
            'body_text' => $body['text'] ?? '',
            'snippet' => $msg['snippet'] ?? null,
            'received_at' => isset($msg['internalDate']) ? date('c', (int) ($msg['internalDate'] / 1000)) : null,
            'direction' => str_contains(strtolower($headers['from'] ?? ''), strtolower($account->email_address)) ? 'outbound' : 'inbound',
            'label_ids' => $msg['labelIds'] ?? [],
        ];
    }

    protected function extractGmailBody($payload): array
    {
        $text = '';
        $html = '';
        if (isset($payload['body']['data'])) {
            $decoded = base64_decode(strtr($payload['body']['data'], '-_', '+/'));
            if (str_contains($payload['mimeType'] ?? '', 'html')) $html = $decoded;
            else $text = $decoded;
        }
        if (!empty($payload['parts'])) {
            foreach ($payload['parts'] as $p) {
                $sub = $this->extractGmailBody($p);
                if ($sub['html']) $html = $sub['html'];
                if ($sub['text']) $text = $sub['text'];
            }
        }
        return ['text' => $text, 'html' => $html];
    }

    protected function buildMime(array $payload): string
    {
        $boundary = 'mixed_' . md5(uniqid());
        $headers = [
            'MIME-Version: 1.0',
            'From: ' . ($payload['from_name'] ?? '') . ' <' . $payload['from_email'] . '>',
            'To: ' . $payload['to'],
        ];
        if (!empty($payload['cc'])) $headers[] = 'Cc: ' . $payload['cc'];
        if (!empty($payload['bcc'])) $headers[] = 'Bcc: ' . $payload['bcc'];
        $headers[] = 'Subject: =?UTF-8?B?' . base64_encode($payload['subject']) . '?=';
        $headers[] = 'Content-Type: text/html; charset=UTF-8';

        $body = "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n"
              . $payload['body'] . "\r\n";

        foreach ($payload['attachments'] ?? [] as $att) {
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: {$att['mime_type']}; name=\"{$att['name']}\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"{$att['name']}\"\r\n\r\n";
            $body .= chunk_split(base64_encode($att['content'])) . "\r\n";
        }
        $body .= "--{$boundary}--";

        return implode("\r\n", $headers) . "\r\n\r\n" . $body;
    }

    protected function extractEmail(string $from): string
    {
        if (preg_match('/<([^>]+)>/', $from, $m)) return trim($m[1]);
        return trim($from);
    }

    protected function extractName(string $from): string
    {
        if (preg_match('/^([^<]+)</', $from, $m)) return trim($m[1]);
        return '';
    }
}