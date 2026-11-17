<?php

namespace App\Services\Crm;

use App\Models\CrmNotification;
use App\Models\User;

class CrmNotificationService
{
    public function send(int $userId, string $type, string $title, ?string $body = null, array $options = []): CrmNotification
    {
        return CrmNotification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'icon' => $options['icon'] ?? null,
            'color' => $options['color'] ?? null,
            'link' => $options['link'] ?? null,
            'entity_type' => $options['entity_type'] ?? null,
            'entity_id' => $options['entity_id'] ?? null,
            'data' => $options['data'] ?? null,
        ]);
    }

    public function notifyAdmins(string $type, string $title, ?string $body = null, array $options = [])
    {
        $admins = User::query()->whereHas('roles', function ($q) {
            $q->whereIn('slug', ['super', 'super_admin', 'admin']);
        })->get();
        foreach ($admins as $admin) {
            $this->send($admin->id, $type, $title, $body, $options);
        }
    }

    public function notifyAssigned($entity, string $type, string $title, ?string $body = null, array $options = [])
    {
        $userId = is_object($entity) ? ($entity->assigned_to ?? null) : null;
        if ($userId) {
            $options = array_merge([
                'entity_type' => is_object($entity) ? get_class($entity) : null,
                'entity_id' => is_object($entity) ? $entity->id : null,
            ], $options);
            $this->send($userId, $type, $title, $body, $options);
        }
    }

    public function notifyFollowers($entity, string $type, string $title, ?string $body = null, array $options = [])
    {
        if (!is_object($entity)) return;
        $options = array_merge([
            'entity_type' => get_class($entity),
            'entity_id' => $entity->id,
        ], $options);
        if (!empty($entity->owner_id)) $this->send($entity->owner_id, $type, $title, $body, $options);
        if (!empty($entity->assigned_to)) $this->send($entity->assigned_to, $type, $title, $body, $options);
        if (!empty($entity->created_by)) $this->send($entity->created_by, $type, $title, $body, $options);
    }

    public function markAllRead(int $userId): int
    {
        return CrmNotification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function unreadCount(int $userId): int
    {
        return CrmNotification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }
}