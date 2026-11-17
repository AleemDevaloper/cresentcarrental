<?php

namespace App\Services\Crm;

use App\Models\CrmEmail;
use App\Models\CrmEmailAccount;
use App\Models\CrmEmailAttachment;
use App\Models\CrmEmailEvent;
use App\Models\CrmEmailThread;
use App\Models\CrmLead;
use App\Models\CrmContact;
use App\Models\CrmCustomer;
use App\Models\CrmDeal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmEmailService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmNotificationService $notif,
        private CrmAutomationService $automation,
        private CrmSequenceService $sequences
    ) {
    }

    public function storeInboundMessage(array $payload, ?CrmEmailAccount $account = null): CrmEmail
    {
        return DB::connection('tenant')->transaction(function () use ($payload, $account) {
            $thread = $this->findOrCreateThread($payload, $account);

            $existing = CrmEmail::where('provider_message_id', $payload['provider_message_id'] ?? '')->first();
            if ($existing) return $existing;

            $entity = $this->resolveEntity($payload['from_email'] ?? null);

            $email = CrmEmail::create([
                'thread_id' => $thread->id,
                'email_account_id' => $account?->id,
                'provider_message_id' => $payload['provider_message_id'] ?? null,
                'message_id_header' => $payload['message_id_header'] ?? null,
                'in_reply_to' => $payload['in_reply_to'] ?? null,
                'references' => $payload['references'] ?? null,
                'direction' => $payload['direction'] ?? 'inbound',
                'folder' => 'inbox',
                'from_email' => $payload['from_email'],
                'from_name' => $payload['from_name'] ?? null,
                'to_emails' => $payload['to_emails'] ?? ($payload['to'] ?? ''),
                'cc_emails' => $payload['cc_emails'] ?? null,
                'bcc_emails' => $payload['bcc_emails'] ?? null,
                'subject' => $payload['subject'] ?? '(no subject)',
                'body_html' => $payload['body_html'] ?? '',
                'body_text' => $payload['body_text'] ?? '',
                'status' => 'received',
                'is_read' => false,
                'sent_at' => $payload['sent_at'] ?? null,
                'delivered_at' => now(),
                'received_at' => $payload['received_at'] ?? now(),
                'entity_type' => $entity ? get_class($entity) : null,
                'entity_id' => $entity?->id,
                'user_id' => $account?->user_id,
            ]);

            $thread->increment('message_count');
            if (!$email->is_read) $thread->increment('unread_count');
            $thread->update(['last_message_at' => $email->received_at, 'snippet' => substr(strip_tags($email->body_html ?: $email->body_text), 0, 200)]);

            if ($account) $account->increment('received_count');

            CrmEmailEvent::create([
                'email_id' => $email->id,
                'event_type' => 'received',
                'occurred_at' => now(),
            ]);

            // Trigger automations
            $this->automation->trigger('email.received', $email);

            // Stop sequences on reply
            if ($entity && $payload['direction'] === 'inbound') {
                $this->sequences->stopOnReply($entity);
            }

            return $email;
        });
    }

    public function findOrCreateThread(array $payload, ?CrmEmailAccount $account): CrmEmailThread
    {
        $threadKey = $payload['thread_id'] ?? null;
        $subject = $payload['subject'] ?? '(no subject)';

        if ($threadKey) {
            $thread = CrmEmailThread::where('thread_key', $threadKey)->first();
            if ($thread) return $thread;
        }

        $entity = $this->resolveEntity($payload['from_email'] ?? null);
        return CrmEmailThread::create([
            'thread_key' => $threadKey,
            'email_account_id' => $account?->id,
            'subject' => $subject,
            'last_message_at' => now(),
            'snippet' => substr(strip_tags($payload['body_html'] ?? $payload['body_text'] ?? ''), 0, 200),
            'entity_type' => $entity ? get_class($entity) : null,
            'entity_id' => $entity?->id,
        ]);
    }

    public function sendQueuedEmail(int $emailId): CrmEmail
    {
        $email = CrmEmail::findOrFail($emailId);
        $account = $email->account ?? CrmEmailAccount::where('status', 'active')->first();
        if (!$account) throw new \RuntimeException('No active email account');

        $provider = \App\Services\Crm\Email\EmailProviderFactory::for($account);
        $recipients = $this->parseRecipients($email->to_emails);

        $payload = [
            'from_email' => $account->email_address,
            'from_name' => $account->display_name,
            'to' => $email->to_emails,
            'cc' => $email->cc_emails,
            'bcc' => $email->bcc_emails,
            'subject' => $email->subject,
            'body' => $email->body_html ?: nl2br($email->body_text),
            'attachments' => $email->attachments->map(fn($a) => [
                'name' => $a->name,
                'path' => $a->path,
                'mime_type' => $a->mime_type,
            ])->toArray(),
        ];

        try {
            $result = $provider->sendMessage($account, $payload);
            $email->update([
                'status' => 'sent',
                'sent_at' => now(),
                'delivered_at' => now(),
                'provider_message_id' => $result['provider_id'] ?? $result['id'] ?? $email->provider_message_id,
            ]);
            CrmEmailEvent::create([
                'email_id' => $email->id,
                'event_type' => 'sent',
                'occurred_at' => now(),
            ]);
            $account->increment('sent_count');
            $this->automation->trigger('email.sent', $email);
            return $email;
        } catch (\Throwable $e) {
            $email->update(['status' => 'failed']);
            CrmEmailEvent::create([
                'email_id' => $email->id,
                'event_type' => 'failed',
                'metadata' => ['error' => $e->getMessage()],
                'occurred_at' => now(),
            ]);
            throw $e;
        }
    }

    public function trackOpen(int $emailId, string $ip = null, string $userAgent = null): void
    {
        $email = CrmEmail::find($emailId);
        if (!$email || !$email->track_opens) return;

        $first = is_null($email->opened_at);
        $email->increment('open_count');
        $email->update([
            'opened_at' => $first ? now() : $email->opened_at,
        ]);
        CrmEmailEvent::create([
            'email_id' => $email->id,
            'event_type' => 'opened',
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'occurred_at' => now(),
        ]);
        if ($first) $this->automation->trigger('email.opened', $email);
    }

    public function trackClick(int $emailId, string $url, string $ip = null, string $userAgent = null): void
    {
        $email = CrmEmail::find($emailId);
        if (!$email || !$email->track_clicks) return;

        $first = is_null($email->clicked_at);
        $email->increment('click_count');
        $email->update(['clicked_at' => $first ? now() : $email->clicked_at]);
        CrmEmailEvent::create([
            'email_id' => $email->id,
            'event_type' => 'clicked',
            'link_url' => $url,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'occurred_at' => now(),
        ]);
        if ($first) $this->automation->trigger('email.clicked', $email);
    }

    public function markRead(CrmEmail $email, bool $read = true): CrmEmail
    {
        $wasUnread = !$email->is_read;
        $email->update(['is_read' => $read]);
        if ($wasUnread && $read) {
            CrmEmailEvent::create([
                'email_id' => $email->id,
                'event_type' => 'read',
                'occurred_at' => now(),
            ]);
            $email->thread?->decrement('unread_count');
        }
        return $email;
    }

    public function moveToFolder(CrmEmail $email, string $folder): CrmEmail
    {
        $email->update(['folder' => $folder]);
        return $email;
    }

    protected function resolveEntity(?string $emailAddress): ?Model
    {
        if (!$emailAddress) return null;
        $email = strtolower(trim($emailAddress));

        $contact = CrmContact::whereRaw('LOWER(email) = ?', [$email])->first();
        if ($contact) return $contact;

        $customer = CrmCustomer::whereRaw('LOWER(email) = ?', [$email])->first();
        if ($customer) return $customer;

        $lead = CrmLead::whereRaw('LOWER(email) = ?', [$email])->first();
        if ($lead) return $lead;

        return null;
    }

    protected function parseRecipients(?string $emails): array
    {
        if (!$emails) return [];
        return array_map('trim', explode(',', $emails));
    }
}