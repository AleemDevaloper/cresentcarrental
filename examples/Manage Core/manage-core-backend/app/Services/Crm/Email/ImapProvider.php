<?php

namespace App\Services\Crm\Email;

use App\Models\CrmEmailAccount;
use Illuminate\Support\Facades\Log;

class ImapProvider implements EmailProviderInterface
{
    public function provider(): string
    {
        return 'imap';
    }

    public function connect(array $credentials): array
    {
        return [
            'access_token' => null,
            'refresh_token' => null,
            'token_type' => 'imap',
            'token_expires_at' => null,
            'imap_host' => $credentials['imap_host'] ?? null,
            'imap_port' => $credentials['imap_port'] ?? 993,
            'imap_username' => $credentials['imap_username'] ?? null,
            'imap_password' => encrypt($credentials['imap_password'] ?? ''),
            'imap_encryption' => $credentials['imap_encryption'] ?? 'ssl',
        ];
    }

    public function refreshToken(CrmEmailAccount $account): string
    {
        return '';
    }

    public function fetchMessages(CrmEmailAccount $account, ?string $cursor = null, int $limit = 50): array
    {
        $host = $account->imap_host;
        $port = $account->imap_port ?: 993;
        if (!$host) return ['messages' => [], 'cursor' => null];

        $connection = $this->openConnection($account);
        if (!$connection) return ['messages' => [], 'cursor' => null];

        $messages = [];
        $count = 0;
        $lastUid = $cursor ? (int) $cursor : null;

        try {
            $uids = imap_search($connection, 'ALL', SE_UID);
            if (!$uids) return ['messages' => [], 'cursor' => null];
            rsort($uids);
            $uids = array_slice($uids, 0, $limit);

            foreach ($uids as $uid) {
                $overview = imap_fetch_overview($connection, $uid, FT_UID);
                if (!$overview) continue;
                $h = $overview[0];

                $body = imap_body($connection, $uid, FT_UID | FT_PEEK);
                $structure = imap_fetchstructure($connection, $uid, FT_UID);
                $html = $this->extractHtml($body, $structure);

                $messages[] = [
                    'provider_message_id' => 'imap-' . $account->id . '-' . $uid,
                    'thread_id' => $h->message_id ?? null,
                    'message_id_header' => $h->message_id ?? null,
                    'from_email' => $h->from ?? '',
                    'from_name' => '',
                    'subject' => $h->subject ?? '(no subject)',
                    'body_html' => $html,
                    'body_text' => $body,
                    'received_at' => $h->date ?? null,
                    'is_read' => !($h->seen ?? 0),
                    'direction' => strtolower($h->from ?? '') === strtolower($account->email_address) ? 'outbound' : 'inbound',
                ];
                $lastUid = $uid;
                $count++;
            }
        } catch (\Throwable $e) {
            Log::error('IMAP fetch failed', ['error' => $e->getMessage()]);
        } finally {
            imap_close($connection);
        }

        return ['messages' => $messages, 'cursor' => $lastUid ? (string) $lastUid : null];
    }

    public function fetchThread(CrmEmailAccount $account, string $threadId): array
    {
        return [];
    }

    public function sendMessage(CrmEmailAccount $account, array $payload): array
    {
        throw new \RuntimeException('IMAP does not send mail; configure SMTP for sending');
    }

    public function registerWebhook(CrmEmailAccount $account, string $url): array
    {
        return ['ok' => true];
    }

    protected function openConnection(CrmEmailAccount $account)
    {
        $password = $account->getDecryptedRefreshToken() ?: $account->imap_password;
        $mailbox = sprintf('{%s:%d/imap/%s}INBOX',
            $account->imap_host, $account->imap_port ?: 993, $account->imap_encryption ?: 'ssl');

        $connection = @imap_open($mailbox, $account->imap_username, $password, 0, 1);
        return $connection;
    }

    protected function extractHtml(string $body, $structure): string
    {
        if (!$structure || empty($structure->parts)) {
            if (str_contains(strtolower($structure->subtype ?? ''), 'html')) return $body;
            return nl2br(htmlspecialchars($body));
        }
        $i = 0;
        foreach ($structure->parts as $part) {
            if (isset($part->subtype) && str_contains(strtolower($part->subtype), 'html')) {
                return imap_fetchbody($this->currentConnection ?? null, $this->currentUid ?? 0, (string)($i + 1), FT_UID);
            }
            $i++;
        }
        return $body;
    }
}