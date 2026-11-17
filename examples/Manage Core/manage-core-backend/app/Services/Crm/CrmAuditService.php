<?php

namespace App\Services\Crm;

use App\Models\CrmAuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CrmAuditService
{
    public function log(string $action, string $module, $entity = null, array $oldValues = null, array $newValues = null, ?string $description = null): CrmAuditLog
    {
        $userId = null;
        $userName = null;
        $ip = null;
        $userAgent = null;

        try {
            $request = request();
            $user = $request->user();
            if ($user) {
                $userId = $user->id;
                $userName = $user->name ?? null;
            }
            $ip = $request->ip();
            $userAgent = substr((string) $request->userAgent(), 0, 500);
        } catch (\Throwable $e) {
            // ignore
        }

        return CrmAuditLog::create([
            'user_id' => $userId,
            'user_name' => $userName,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'action' => $action,
            'module' => $module,
            'entity_type' => $entity ? ($entity instanceof Model ? get_class($entity) : $entity) : null,
            'entity_id' => $entity instanceof Model ? $entity->id : null,
            'entity_label' => $entity instanceof Model ? $this->labelOf($entity) : null,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description,
            'created_at' => now(),
        ]);
    }

    public function logCreate(Model $entity, string $module = null): CrmAuditLog
    {
        return $this->log(
            'created',
            $module ?? $this->moduleFromClass($entity),
            $entity,
            null,
            $entity->getAttributes(),
            sprintf('%s created', class_basename($entity))
        );
    }

    public function logUpdate(Model $entity, array $oldValues, string $module = null): CrmAuditLog
    {
        $changes = [];
        foreach ($oldValues as $key => $old) {
            $new = $entity->getAttribute($key);
            if ($old != $new) $changes[$key] = ['old' => $old, 'new' => $new];
        }
        return $this->log(
            'updated',
            $module ?? $this->moduleFromClass($entity),
            $entity,
            $oldValues,
            $entity->getAttributes(),
            sprintf('%s updated (%d changes)', class_basename($entity), count($changes))
        );
    }

    public function logDelete(Model $entity, string $module = null): CrmAuditLog
    {
        return $this->log(
            'deleted',
            $module ?? $this->moduleFromClass($entity),
            $entity,
            $entity->getAttributes(),
            null,
            sprintf('%s deleted', class_basename($entity))
        );
    }

    public function logAction(string $action, string $module, string $description, ?Model $entity = null, array $context = []): CrmAuditLog
    {
        return $this->log($action, $module, $entity, null, $context, $description);
    }

    protected function moduleFromClass(Model $entity): string
    {
        $class = class_basename($entity);
        if (str_starts_with($class, 'Crm')) $class = substr($class, 3);
        return strtolower(preg_replace('/(?<!<)[A-Z]/', '-$0', $class));
    }

    protected function labelOf(Model $entity): ?string
    {
        foreach (['name', 'subject', 'title', 'code', 'email'] as $f) {
            if (!empty($entity->{$f})) return (string) $entity->{$f};
        }
        return '#' . $entity->id;
    }
}