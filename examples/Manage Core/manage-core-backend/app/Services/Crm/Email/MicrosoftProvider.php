<?php

namespace App\Services\Crm\Email;

use App\Models\CrmEmailAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MicrosoftProvider implements EmailProviderInterface
{
    public function provider(): string
    {
        return 'microsoft';
    }

    public function connect(array $credentials): array
    {
        $code = $credentials['code'] ?? null;
        $tenantId = config('services.microsoft.tenant_id', env('MS_TENANT_ID', 'common'));

        $response = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => config('services.microsoft.client_id', env('MS_CLIENT_ID')),
            'client_secret' => config('services.microsoft.client_secret', env('MS_CLIENT_SECRET')),
            'code' => $code,
            'redirect_uri' => config('services.microsoft.redirect', env('MS_REDIRECT_URI')),
            'grant_type' => 'authorization_code',
            'scope' => 'openid profile email Mail.ReadWrite Mail.Send offline_access',
        ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Microsoft OAuth failed: ' . $response->body());
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
        $tenantId = config('services.microsoft.tenant_id', env('MS_TENANT_ID', 'common'));

        $response = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => config('services.microsoft.client_id', env('MS_CLIENT_ID')),
            'client_secret' => config('services.microsoft.client_secret', env('MS_CLIENT_SECRET')),
            'refresh_token' => $refreshToken,
            'grant_type' => 'refresh_token',
            'scope' => 'openid profile email Mail.ReadWrite Mail.Send offline_access',
        ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Microsoft refresh failed: ' . $response->body());
        }

        $data = $response->json();
        $account->update([
            'access_token' => encrypt($data['access_token']),
            'refresh_token' => encrypt($data['refresh_token'] ?? $refreshToken),
            'token_expires_at' => now()->addSeconds($data['expires_in'] ?? 3600),
        ]);
        return $data['access_token'];
    }

    public function fetchMessages(CrmEmailAccount $account, ?string $cursor = null, int $limit = 50): array
    {
        $token = $this->getAccessToken($account);
        $params = [
            '$top' => $limit,
            '$orderby' => 'receivedDateTime DESC',
            '$select' => 'id,conversationId,from,toRecipients,ccRecipients,subject,bodyPreview,receivedDateTime,sentDateTime,isRead,hasAttachments,internetMessageId',
        ];
        if ($cursor) $params['$skip'] = $cursor;

        $response = Http::withToken($token)
            ->get('https://graph.microsoft.com/v1.0/me/messages', $params);

        if (!$response->successful()) {
            Log::warning('MS fetch failed', ['body' => $response->body()]);
            return ['messages' => [], 'cursor' => null];
        }

        $messages = array_map(fn($m) => $this->parseMsMessage($m, $account), $response->json('value', []));
        $next = $response->json('@odata.nextLink');

        return ['messages' => $messages, 'cursor' => $next ? $this->extractSkip($next) : null];
    }

    public function fetchThread(CrmEmailAccount $account, string $threadId): array
    {
        $token = $this->getAccessToken($account);
        $response = Http::withToken($token)
            ->get("https://graph.microsoft.com/v1.0/me/conversations/{$threadId}/messages");
        if (!$response->successful()) return [];
        return array_map(fn($m) => $this->parseMsMessage($m, $account), $response->json('value', []));
    }

    public function sendMessage(CrmEmailAccount $account, array $payload): array
    {
        $token = $this->getAccessToken($account);

        $body = [
            'message' => [
                'subject' => $payload['subject'],
                'body' => [
                    'contentType' => 'HTML',
                    'content' => $payload['body'],
                ],
                'toRecipients' => $this->parseRecipients($payload['to']),
            ],
        ];

        if (!empty($payload['cc'])) $body['message']['ccRecipients'] = $this->parseRecipients($payload['cc']);
        if (!empty($payload['bcc'])) $body['message']['bccRecipients'] = $this->parseRecipients($payload['bcc']);
        if (!empty($payload['attachments'])) {
            $body['message']['attachments'] = array_map(fn($a) => [
                '@odata.type' => '#microsoft.graph.fileAttachment',
                'name' => $a['name'],
                'contentBytes' => base64_encode($a['content']),
                'contentType' => $a['mime_type'] ?? 'application/octet-stream',
            ], $payload['attachments']);
        }

        $response = Http::withToken($token)
            ->post('https://graph.microsoft.com/v1.0/me/sendMail', $body);

        if (!$response->successful()) {
            throw new \RuntimeException('Microsoft send failed: ' . $response->body());
        }

        return ['provider_id' => 'sent-' . md5($payload['to'] . $payload['subject'])];
    }

    public function registerWebhook(CrmEmailAccount $account, string $url): array
    {
        $token = $this->getAccessToken($account);
        $response = Http::withToken($token)
            ->post('https://graph.microsoft.com/v1.0/subscriptions', [
                'changeType' => 'created,updated',
                'notificationUrl' => $url,
                'resource' => '/me/messages',
                'expirationDateTime' => now()->addDays(2)->toIso8601String(),
                'clientState' => 'managecore-' . $account->id,
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

    protected function parseMsMessage(array $m, CrmEmailAccount $account): array
    {
        $from = $m['from']['emailAddress'] ?? [];
        return [
            'provider_message_id' => $m['id'],
            'thread_id' => $m['conversationId'] ?? null,
            'message_id_header' => $m['internetMessageId'] ?? null,
            'from_email' => $from['address'] ?? '',
            'from_name' => $from['name'] ?? '',
            'subject' => $m['subject'] ?? '(no subject)',
            'body_html' => $m['body']['content'] ?? '',
            'body_text' => strip_tags($m['body']['content'] ?? ''),
            'snippet' => $m['bodyPreview'] ?? null,
            'received_at' => $m['receivedDateTime'] ?? null,
            'sent_at' => $m['sentDateTime'] ?? null,
            'is_read' => $m['isRead'] ?? false,
            'has_attachments' => $m['hasAttachments'] ?? false,
            'direction' => strtolower($from['address'] ?? '') === strtolower($account->email_address) ? 'outbound' : 'inbound',
        ];
    }

    protected function parseRecipients(string $recipients): array
    {
        return array_map(fn($r) => [
            'emailAddress' => ['address' => trim($r)],
        ], explode(',', $recipients));
    }

    protected function extractSkip(string $nextLink): ?int
    {
        $query = parse_url($nextLink, PHP_URL_QUERY);
        if (!$query) return null;
        parse_str($query, $params);
        return isset($params['$skip']) ? (int) $params['$skip'] : null;
    }
}