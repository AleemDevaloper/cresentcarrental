<?php

namespace App\Services\Crm;

use App\Models\CrmFollowUp;
use App\Models\CrmEmail;
use App\Models\CrmEmailAccount;
use App\Models\CrmActivity;
use Illuminate\Database\Eloquent\Model;

class CrmFollowUpService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmNotificationService $notif,
        private CrmAutomationService $automation
    ) {
    }

    public function schedule(array $data): CrmFollowUp
    {
        $followUp = CrmFollowUp::create(array_merge($data, [
            'status' => $data['status'] ?? 'pending',
            'owner_id' => $data['owner_id'] ?? auth()->id(),
            'created_by' => auth()->id(),
        ]));

        if ($followUp->assigned_to) {
            $this->notif->send($followUp->assigned_to, 'followup',
                'New follow-up scheduled: ' . $followUp->subject,
                null,
                ['entity_type' => CrmFollowUp::class, 'entity_id' => $followUp->id]
            );
        }

        $this->audit->logCreate($followUp, 'follow-up');
        return $followUp;
    }

    public function complete(CrmFollowUp $followUp, ?string $result = null): CrmFollowUp
    {
        $followUp->update([
            'status' => 'completed',
            'completed_at' => now(),
            'result' => $result,
        ]);
        $this->audit->logAction('completed', 'follow-up', "Follow-up completed: {$followUp->subject}", $followUp);
        $this->automation->trigger('followup.completed', $followUp);
        return $followUp;
    }

    public function snooze(CrmFollowUp $followUp, \DateTimeInterface $newDueAt): CrmFollowUp
    {
        $followUp->update([
            'status' => 'snoozed',
            'due_at' => $newDueAt,
        ]);
        $this->audit->logAction('snoozed', 'follow-up', "Snoozed to {$newDueAt->format('Y-m-d H:i')}", $followUp);
        return $followUp;
    }

    public function cancel(CrmFollowUp $followUp, string $reason = null): CrmFollowUp
    {
        $followUp->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'result' => $reason,
        ]);
        $this->audit->logAction('cancelled', 'follow-up', "Cancelled: {$followUp->subject}", $followUp);
        return $followUp;
    }

    public function dispatchDueFollowUps(): int
    {
        $count = 0;
        $due = CrmFollowUp::whereIn('status', ['pending', 'due'])
            ->where('due_at', '<=', now())
            ->where('due_at', '>=', now()->subDay())
            ->get();

        foreach ($due as $f) {
            try {
                $this->execute($f);
                $count++;
            } catch (\Throwable $e) {
                $f->update([
                    'status' => 'failed',
                    'result' => 'Error: ' . $e->getMessage(),
                ]);
                $this->audit->logAction('failed', 'follow-up', $e->getMessage(), $f);
            }
        }
        return $count;
    }

    public function execute(CrmFollowUp $followUp): CrmFollowUp
    {
        $followUp->increment('attempt_count');

        switch ($followUp->type) {
            case 'email':
                $this->sendEmail($followUp);
                break;
            case 'call':
                $this->createCallTask($followUp);
                break;
            case 'task':
                $this->createTask($followUp);
                break;
            case 'meeting':
                $this->createMeeting($followUp);
                break;
            case 'reminder':
                $this->sendReminder($followUp);
                break;
        }

        $followUp->update(['status' => 'completed', 'completed_at' => now()]);
        $this->automation->trigger('followup.completed', $followUp);

        return $followUp->fresh();
    }

    protected function sendEmail(CrmFollowUp $followUp): void
    {
        $entity = $followUp->lead ?? $followUp->contact ?? $followUp->customer ?? $followUp->deal;
        if (!$entity || empty($entity->email)) return;

        $account = CrmEmailAccount::where('status', 'active')->where('is_default', true)->first()
            ?? CrmEmailAccount::where('status', 'active')->first();
        if (!$account) return;

        $template = $followUp->template;
        $subject = $followUp->subject;
        $body = $followUp->description ?? '';

        if ($template) {
            $subject = $template->subject;
            $body = $template->body;
        }

        $email = CrmEmail::create([
            'email_account_id' => $account->id,
            'template_id' => $template?->id,
            'direction' => 'outbound',
            'folder' => 'sent',
            'from_email' => $account->email_address,
            'from_name' => $account->display_name,
            'to_emails' => $entity->email,
            'subject' => $subject,
            'body_html' => $body,
            'body_text' => strip_tags($body),
            'status' => 'queued',
            'user_id' => $followUp->assigned_to,
            'entity_type' => $entity ? get_class($entity) : null,
            'entity_id' => $entity?->id,
        ]);

        \App\Jobs\Crm\SendEmailJob::dispatch($email->id);
    }

    protected function createCallTask(CrmFollowUp $followUp): void
    {
        CrmActivity::create([
            'type' => 'call',
            'subject' => $followUp->subject,
            'description' => $followUp->description,
            'due_date' => $followUp->due_at,
            'status' => 'planned',
            'priority' => $followUp->priority,
            'lead_id' => $followUp->lead_id,
            'contact_id' => $followUp->contact_id,
            'customer_id' => $followUp->customer_id,
            'deal_id' => $followUp->deal_id,
            'assigned_to' => $followUp->assigned_to,
            'created_by' => auth()->id(),
        ]);
    }

    protected function createTask(CrmFollowUp $followUp): void
    {
        \App\Models\CrmTask::create([
            'title' => $followUp->subject,
            'description' => $followUp->description,
            'due_date' => $followUp->due_at,
            'status' => 'todo',
            'priority' => $followUp->priority,
            'lead_id' => $followUp->lead_id,
            'contact_id' => $followUp->contact_id,
            'customer_id' => $followUp->customer_id,
            'deal_id' => $followUp->deal_id,
            'assigned_to' => $followUp->assigned_to,
            'created_by' => auth()->id(),
        ]);
    }

    protected function createMeeting(CrmFollowUp $followUp): void
    {
        CrmActivity::create([
            'type' => 'meeting',
            'subject' => $followUp->subject,
            'description' => $followUp->description,
            'due_date' => $followUp->due_at,
            'status' => 'planned',
            'priority' => $followUp->priority,
            'lead_id' => $followUp->lead_id,
            'contact_id' => $followUp->contact_id,
            'customer_id' => $followUp->customer_id,
            'deal_id' => $followUp->deal_id,
            'assigned_to' => $followUp->assigned_to,
            'created_by' => auth()->id(),
        ]);
    }

    protected function sendReminder(CrmFollowUp $followUp): void
    {
        if ($followUp->assigned_to) {
            $this->notif->send($followUp->assigned_to, 'followup',
                'Reminder: ' . $followUp->subject,
                $followUp->description,
                ['entity_type' => CrmFollowUp::class, 'entity_id' => $followUp->id]
            );
        }
    }
}