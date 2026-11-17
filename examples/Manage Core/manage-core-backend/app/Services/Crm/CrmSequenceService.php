<?php

namespace App\Services\Crm;

use App\Models\CrmSequence;
use App\Models\CrmSequenceEnrollment;
use App\Models\CrmSequenceEvent;
use App\Models\CrmSequenceStep;
use App\Models\CrmEmail;
use App\Models\CrmEmailAccount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmSequenceService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmNotificationService $notif
    ) {
    }

    public static function enrollStatic(int $sequenceId, Model $entity, ?int $userId): CrmSequenceEnrollment
    {
        return (new self(app(CrmAuditService::class), app(CrmNotificationService::class)))
            ->enroll($sequenceId, $entity, $userId);
    }

    public static function stopEntity(int $sequenceId, Model $entity, string $reason = 'manual_stop'): int
    {
        return (new self(app(CrmAuditService::class), app(CrmNotificationService::class)))
            ->stopEnrollmentsForEntity($sequenceId, $entity, $reason);
    }

    public function enroll(int $sequenceId, Model $entity, ?int $userId): CrmSequenceEnrollment
    {
        $sequence = CrmSequence::findOrFail($sequenceId);
        $firstStep = $sequence->steps()->orderBy('order')->first();

        $enrollment = CrmSequenceEnrollment::firstOrCreate(
            [
                'sequence_id' => $sequenceId,
                'lead_id' => $entity instanceof \App\Models\CrmLead ? $entity->id : null,
                'contact_id' => $entity instanceof \App\Models\CrmContact ? $entity->id : null,
                'customer_id' => $entity instanceof \App\Models\CrmCustomer ? $entity->id : null,
                'deal_id' => $entity instanceof \App\Models\CrmDeal ? $entity->id : null,
            ],
            [
                'status' => 'active',
                'owner_id' => $userId,
                'enrolled_at' => now(),
                'current_step_id' => $firstStep?->id,
                'next_step_at' => $firstStep ? $this->calcNextStepAt($firstStep) : now(),
                'step_count' => $sequence->steps()->count(),
                'created_by' => $userId,
            ]
        );

        if (!$enrollment->wasRecentlyCreated) {
            return $enrollment;
        }

        $sequence->increment('active_enrollments');
        CrmSequenceEvent::create([
            'enrollment_id' => $enrollment->id,
            'step_id' => null,
            'event_type' => 'enrolled',
            'occurred_at' => now(),
        ]);

        $this->notif->send($userId ?? $entity->assigned_to ?? auth()->id() ?? 0,
            'sequence',
            'Enrolled in sequence: ' . $sequence->name,
            null,
            ['entity_type' => get_class($entity), 'entity_id' => $entity->id]
        );

        return $enrollment;
    }

    public function advance(CrmSequenceEnrollment $enrollment): CrmSequenceEnrollment
    {
        if ($enrollment->status !== 'active') return $enrollment;

        $currentStep = $enrollment->currentStep;
        if (!$currentStep) {
            $enrollment->complete();
            $enrollment->sequence->increment('completed_enrollments');
            $enrollment->sequence->decrement('active_enrollments');
            CrmSequenceEvent::create([
                'enrollment_id' => $enrollment->id,
                'event_type' => 'completed',
                'occurred_at' => now(),
            ]);
            return $enrollment;
        }

        $nextStep = $enrollment->sequence->steps()
            ->where('order', '>', $currentStep->order)
            ->orderBy('order')
            ->first();

        CrmSequenceEvent::create([
            'enrollment_id' => $enrollment->id,
            'step_id' => $currentStep->id,
            'event_type' => 'step_completed',
            'occurred_at' => now(),
        ]);

        if (!$nextStep) {
            $enrollment->complete();
            $enrollment->sequence->increment('completed_enrollments');
            $enrollment->sequence->decrement('active_enrollments');
            CrmSequenceEvent::create([
                'enrollment_id' => $enrollment->id,
                'event_type' => 'completed',
                'occurred_at' => now(),
            ]);
            return $enrollment;
        }

        $enrollment->update([
            'current_step_id' => $nextStep->id,
            'next_step_at' => $this->calcNextStepAt($nextStep),
        ]);

        // Execute step now
        $this->executeStep($enrollment, $nextStep);

        return $enrollment->fresh();
    }

    public function executeStep(CrmSequenceEnrollment $enrollment, CrmSequenceStep $step): void
    {
        $entity = $enrollment->lead
            ?? $enrollment->contact
            ?? $enrollment->customer
            ?? $enrollment->deal;

        if (!$entity) return;

        CrmSequenceEvent::create([
            'enrollment_id' => $enrollment->id,
            'step_id' => $step->id,
            'event_type' => 'step_started',
            'occurred_at' => now(),
        ]);

        switch ($step->type) {
            case 'email':
                $this->sendSequenceEmail($enrollment, $step, $entity);
                break;
            case 'call':
                \App\Models\CrmTask::create([
                    'title' => $step->name ?: 'Follow-up call',
                    'description' => 'Auto-created from sequence: ' . ($enrollment->sequence->name ?? ''),
                    'due_date' => $enrollment->next_step_at,
                    'status' => 'todo',
                    'priority' => 'medium',
                    'assigned_to' => $enrollment->owner_id,
                    'created_by' => $enrollment->owner_id,
                    'customer_id' => $enrollment->customer_id,
                    'lead_id' => $enrollment->lead_id,
                    'deal_id' => $enrollment->deal_id,
                    'contact_id' => $enrollment->contact_id,
                ]);
                break;
            case 'task':
                \App\Models\CrmTask::create([
                    'title' => $step->name ?: 'Sequence task',
                    'due_date' => $enrollment->next_step_at,
                    'status' => 'todo',
                    'priority' => 'medium',
                    'assigned_to' => $enrollment->owner_id,
                    'created_by' => $enrollment->owner_id,
                    'customer_id' => $enrollment->customer_id,
                    'lead_id' => $enrollment->lead_id,
                    'deal_id' => $enrollment->deal_id,
                    'contact_id' => $enrollment->contact_id,
                ]);
                break;
        }
    }

    protected function sendSequenceEmail(CrmSequenceEnrollment $enrollment, CrmSequenceStep $step, Model $entity): void
    {
        $email = $entity->email ?? null;
        if (!$email) return;

        $template = $step->template;
        $account = CrmEmailAccount::where('status', 'active')->where('is_default', true)->first()
            ?? CrmEmailAccount::where('status', 'active')->first();
        if (!$account) return;

        $subject = $template?->subject ?? 'Follow-up';
        $body = $template?->body ?? '';

        $emailRow = CrmEmail::create([
            'email_account_id' => $account->id,
            'sequence_id' => $enrollment->sequence_id,
            'template_id' => $template?->id,
            'direction' => 'outbound',
            'folder' => 'sent',
            'from_email' => $account->email_address,
            'from_name' => $account->display_name,
            'to_emails' => $email,
            'subject' => $this->replaceVariables($subject, $entity, $enrollment),
            'body_html' => $this->replaceVariables($body, $entity, $enrollment),
            'body_text' => strip_tags($body),
            'status' => 'queued',
            'user_id' => $enrollment->owner_id,
            'entity_type' => get_class($entity),
            'entity_id' => $entity->id,
        ]);

        \App\Jobs\Crm\SendEmailJob::dispatch($emailRow->id);
    }

    public function stopEnrollmentsForEntity(int $sequenceId, Model $entity, string $reason): int
    {
        $fieldMap = [
            \App\Models\CrmLead::class => 'lead_id',
            \App\Models\CrmContact::class => 'contact_id',
            \App\Models\CrmCustomer::class => 'customer_id',
            \App\Models\CrmDeal::class => 'deal_id',
        ];
        $field = $fieldMap[get_class($entity)] ?? null;
        if (!$field) return 0;

        $count = CrmSequenceEnrollment::where('sequence_id', $sequenceId)
            ->where($field, $entity->id)
            ->where('status', 'active')
            ->update([
                'status' => 'stopped',
                    'stopped_at' => now(),
                    'stop_reason' => $reason,
                ]);

        if ($count) {
            $sequence = CrmSequence::find($sequenceId);
            if ($sequence) {
                $sequence->increment('stopped_enrollments', $count);
                $sequence->decrement('active_enrollments', $count);
            }
        }

        return $count;
    }

    public function stopOnReply(Model $entity): int
    {
        $fieldMap = [
            \App\Models\CrmLead::class => 'lead_id',
            \App\Models\CrmContact::class => 'contact_id',
            \App\Models\CrmCustomer::class => 'customer_id',
            \App\Models\CrmDeal::class => 'deal_id',
        ];
        $field = $fieldMap[get_class($entity)] ?? null;
        if (!$field) return 0;

        return CrmSequenceEnrollment::where($field, $entity->id)
            ->where('status', 'active')
            ->update([
                'status' => 'stopped',
                'stopped_at' => now(),
                'stop_reason' => 'reply_received',
            ]);
    }

    protected function calcNextStepAt(CrmSequenceStep $step): \Carbon\Carbon
    {
        $base = now();
        if ($step->send_time) {
            $parts = explode(':', $step->send_time);
            $base = $base->setTime((int) ($parts[0] ?? 9), (int) ($parts[1] ?? 0));
        }
        return $base->addDays($step->delay_days)->addHours($step->delay_hours);
    }

    protected function replaceVariables(string $text, Model $entity, CrmSequenceEnrollment $enrollment): string
    {
        $vars = [
            '{{first_name}}' => $entity->first_name ?? '',
            '{{last_name}}' => $entity->last_name ?? '',
            '{{full_name}}' => trim(($entity->first_name ?? '') . ' ' . ($entity->last_name ?? '')),
            '{{company}}' => $entity->company ?? '',
            '{{email}}' => $entity->email ?? '',
            '{{owner_name}}' => optional($enrollment->owner)->name ?? '',
            '{{follow_up_date}}' => optional($enrollment->next_step_at)->format('Y-m-d') ?? '',
        ];
        foreach ($vars as $k => $v) {
            $text = str_replace($k, $v, $text);
        }
        return $text;
    }
}