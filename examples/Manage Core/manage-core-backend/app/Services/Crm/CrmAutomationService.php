<?php

namespace App\Services\Crm;

use App\Models\CrmAutomation;
use App\Models\CrmAutomationAction;
use App\Models\CrmAutomationCondition;
use App\Models\CrmAutomationRun;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmAutomationService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmNotificationService $notif,
        private CrmLeadScoreService $leadScore
    ) {
    }

    public function trigger(string $event, Model $entity, array $context = []): int
    {
        $automations = CrmAutomation::where('is_active', true)
            ->where(function ($q) use ($entity) {
                $q->where('entity_type', $this->entityType($entity))
                  ->orWhereNull('entity_type');
            })
            ->whereHas('triggers', function ($q) use ($event) {
                $q->where('event', $event);
            })
            ->get();

        $executions = 0;
        foreach ($automations as $automation) {
            if ($this->shouldRun($automation, $entity, $context)) {
                $this->execute($automation, $entity, $context);
                $executions++;
            }
        }

        return $executions;
    }

    public function execute(CrmAutomation $automation, Model $entity, array $context = []): CrmAutomationRun
    {
        $run = CrmAutomationRun::create([
            'automation_id' => $automation->id,
            'entity_type' => $this->entityType($entity),
            'entity_id' => $entity->id,
            'status' => 'running',
            'context' => $context,
            'triggered_by' => auth()->id(),
            'started_at' => now(),
        ]);

        $actions = $automation->actions()->orderBy('order')->get();
        $executed = 0;

        try {
            foreach ($actions as $action) {
                $this->executeAction($action, $entity, $context);
                $executed++;
            }

            $automation->increment('execution_count');
            $automation->increment('success_count');

            $run->update([
                'status' => 'completed',
                'actions_executed' => $executed,
                'completed_at' => now(),
                'result' => ['ok' => true, 'count' => $executed],
            ]);
        } catch (\Throwable $e) {
            $automation->increment('failure_count');
            $run->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
                'completed_at' => now(),
            ]);
        }

        return $run->fresh();
    }

    protected function shouldRun(CrmAutomation $automation, Model $entity, array $context): bool
    {
        // Loop protection
        $previousRuns = CrmAutomationRun::where('automation_id', $automation->id)
            ->where('entity_type', $this->entityType($entity))
            ->where('entity_id', $entity->id)
            ->count();
        if ($previousRuns >= ($automation->max_executions_per_record ?: 1)) {
            return false;
        }

        // Test mode
        if ($automation->test_mode) {
            return auth()->id() !== null;
        }

        $conditions = $automation->conditions;
        if ($conditions->isEmpty()) return true;

        $prev = null;
        $current = null;
        foreach ($conditions as $c) {
            $value = $this->getValue($entity, $c->field, $context);
            $result = $this->evaluateCondition($value, $c->operator, $c->value);

            if ($c->logic === 'or') {
                $current = $current || $result;
            } else {
                $current = ($current === null) ? $result : ($current && $result);
            }
        }

        return (bool) $current;
    }

    protected function executeAction(CrmAutomationAction $action, Model $entity, array $context): void
    {
        $params = is_array($action->params) ? $action->params : [];

        switch ($action->type) {
            case 'create_task':
                \App\Models\CrmTask::create([
                    'title' => $params['title'] ?? 'Auto Task',
                    'description' => $params['description'] ?? null,
                    'due_date' => $params['due_date'] ?? now()->addDay(),
                    'status' => 'todo',
                    'priority' => $params['priority'] ?? 'medium',
                    'assigned_to' => $params['assigned_to'] ?? $entity->assigned_to ?? null,
                    'created_by' => auth()->id(),
                    'customer_id' => $entity->customer_id ?? null,
                    'lead_id' => $entity->lead_id ?? null,
                    'deal_id' => $entity->deal_id ?? null,
                ]);
                break;
            case 'send_email':
                \App\Jobs\Crm\SendEmailJob::dispatch(
                    null,
                    $params['to'] ?? null,
                    $params['subject'] ?? null,
                    $params['body'] ?? null,
                    [
                        'entity_type' => $this->entityType($entity),
                        'entity_id' => $entity->id,
                        'template_id' => $params['template_id'] ?? null,
                    ]
                );
                break;
            case 'create_followup':
                \App\Models\CrmFollowUp::create([
                    'subject' => $params['subject'] ?? 'Auto follow-up',
                    'description' => $params['description'] ?? null,
                    'type' => $params['type'] ?? 'email',
                    'status' => 'pending',
                    'priority' => $params['priority'] ?? 'medium',
                    'due_at' => $params['due_at'] ?? now()->addDays(2),
                    'lead_id' => $entity->lead_id ?? ($entity instanceof \App\Models\CrmLead ? $entity->id : null),
                    'contact_id' => $entity->contact_id ?? null,
                    'customer_id' => $entity->customer_id ?? null,
                    'deal_id' => $entity->deal_id ?? null,
                    'assigned_to' => $params['assigned_to'] ?? $entity->assigned_to ?? null,
                    'created_by' => auth()->id(),
                ]);
                break;
            case 'assign_user':
                if (isset($params['user_id'])) {
                    $entity->assigned_to = $params['user_id'];
                    $entity->save();
                }
                break;
            case 'change_status':
                if (isset($params['status'])) {
                    $entity->status = $params['status'];
                    $entity->save();
                }
                break;
            case 'add_tag':
                if (!empty($params['tag_name'])) {
                    $tag = \App\Models\CrmTag::findOrCreateByName($params['tag_name']);
                    $entity->tags()->syncWithoutDetaching([$tag->id]);
                }
                break;
            case 'remove_tag':
                if (!empty($params['tag_name'])) {
                    $tag = \App\Models\CrmTag::where('slug', \Illuminate\Support\Str::slug($params['tag_name']))->first();
                    if ($tag) $entity->tags()->detach($tag->id);
                }
                break;
            case 'create_notification':
                if (!empty($params['user_id'])) {
                    $this->notif->send($params['user_id'], 'automation',
                        $params['title'] ?? 'Automation triggered',
                        $params['body'] ?? null,
                        ['entity_type' => $this->entityType($entity), 'entity_id' => $entity->id]
                    );
                }
                break;
            case 'start_sequence':
                if (!empty($params['sequence_id'])) {
                    \App\Services\Crm\CrmSequenceService::enrollStatic(
                        $params['sequence_id'],
                        $entity,
                        auth()->id()
                    );
                }
                break;
            case 'stop_sequence':
                if (!empty($params['sequence_id'])) {
                    \App\Services\Crm\CrmSequenceService::stopEntity(
                        $params['sequence_id'],
                        $entity,
                        $params['reason'] ?? 'manual_stop'
                    );
                }
                break;
            case 'webhook':
                if (!empty($params['url'])) {
                    \Illuminate\Support\Facades\Http::post($params['url'], [
                        'event' => 'automation_triggered',
                        'automation_id' => $action->automation_id,
                        'entity' => $entity->toArray(),
                    ]);
                }
                break;
            case 'update_field':
                if (!empty($params['field']) && array_key_exists('value', $params)) {
                    $entity->{$params['field']} = $params['value'];
                    $entity->save();
                }
                break;
        }
    }

    protected function evaluateCondition($value, string $operator, $expected): bool
    {
        return match ($operator) {
            'equals' => (string) $value === (string) $expected,
            'not_equals' => (string) $value !== (string) $expected,
            'contains' => is_string($value) && str_contains(strtolower($value), strtolower((string) $expected)),
            'not_contains' => is_string($value) && !str_contains(strtolower($value), strtolower((string) $expected)),
            'greater_than' => is_numeric($value) && $value > $expected,
            'less_than' => is_numeric($value) && $value < $expected,
            'starts_with' => is_string($value) && str_starts_with(strtolower($value), strtolower((string) $expected)),
            'ends_with' => is_string($value) && str_ends_with(strtolower($value), strtolower((string) $expected)),
            'is_empty' => empty($value),
            'is_not_empty' => !empty($value),
            default => false,
        };
    }

    protected function getValue(Model $entity, string $field, array $context)
    {
        if (str_starts_with($field, 'context.')) {
            return data_get($context, substr($field, 8));
        }
        return $entity->{$field} ?? null;
    }

    protected function entityType(Model $entity): string
    {
        return get_class($entity);
    }
}