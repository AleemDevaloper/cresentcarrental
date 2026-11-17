<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CrmRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'CRM Admin', 'description' => 'Full CRM access', 'color' => '#6366f1', 'icon' => 'FiShield', 'level' => 50, 'status' => true],
            ['name' => 'Sales Manager', 'description' => 'Manage sales team CRM', 'color' => '#10b981', 'icon' => 'FiUsers', 'level' => 40, 'status' => true],
            ['name' => 'Sales Rep', 'description' => 'Standard sales access', 'color' => '#0ea5e9', 'icon' => 'FiUser', 'level' => 20, 'status' => true],
            ['name' => 'Support', 'description' => 'Customer support access', 'color' => '#f59e0b', 'icon' => 'FiHeadphones', 'level' => 10, 'status' => true],
        ];

        $roleIds = [];
        foreach ($roles as $role) {
            $existing = DB::connection('tenant')->table('roles')->where('name', $role['name'])->first();
            if (!$existing) {
                $role['created_at'] = now();
                $role['updated_at'] = now();
                $id = DB::connection('tenant')->table('roles')->insertGetId($role);
                $roleIds[$role['name']] = $id;
            } else {
                $roleIds[$role['name']] = $existing->id;
            }
        }

        $this->assignPermissions($roleIds);
        $this->command->info('CRM roles seeded');
    }

    protected function assignPermissions(array $roleIds): void
    {
        $allSlugs = DB::connection('tenant')->table('permissions')
            ->where(function ($q) {
                $q->where('slug', 'like', 'crm.%')
                  ->orWhere('slug', 'like', 'lead.%')
                  ->orWhere('slug', 'like', 'contact.%')
                  ->orWhere('slug', 'like', 'customer.%')
                  ->orWhere('slug', 'like', 'deal.%')
                  ->orWhere('slug', 'like', 'pipeline.%')
                  ->orWhere('slug', 'like', 'activity.%')
                  ->orWhere('slug', 'like', 'task.%')
                  ->orWhere('slug', 'like', 'email.%')
                  ->orWhere('slug', 'like', 'followup.%')
                  ->orWhere('slug', 'like', 'sequence.%')
                  ->orWhere('slug', 'like', 'automation.%')
                  ->orWhere('slug', 'like', 'campaign.%')
                  ->orWhere('slug', 'like', 'reports.%')
                  ->orWhere('slug', 'like', 'tags.%')
                  ->orWhere('slug', 'like', 'documents.%')
                  ->orWhere('slug', 'like', 'calendar.%')
                  ->orWhere('slug', 'like', 'audit.%')
                  ->orWhere('slug', 'like', 'notifications.%')
                  ->orWhere('slug', 'like', 'settings.%')
                  ->orWhere('slug', 'like', 'custom_fields.%');
            })
            ->pluck('id', 'slug')->toArray();

        // CRM Admin - all
        $this->attachPermissions($roleIds['CRM Admin'], array_values($allSlugs));

        // Sales Manager - everything except settings.manage and audit.view
        $mgrSlugs = array_filter(array_keys($allSlugs), fn($s) => !in_array($s, ['settings.manage', 'audit.view']));
        $this->attachPermissions($roleIds['Sales Manager'], array_map(fn($s) => $allSlugs[$s], $mgrSlugs));

        // Sales Rep - basic
        $repSlugs = [
            'crm.view', 'lead.view', 'lead.create', 'lead.edit', 'lead.assign', 'lead.convert',
            'contact.view', 'contact.create', 'contact.edit',
            'customer.view', 'customer.create', 'customer.edit',
            'deal.view', 'deal.create', 'deal.edit', 'deal.move_stage',
            'pipeline.view',
            'activity.view', 'activity.create', 'activity.edit', 'activity.complete',
            'task.view', 'task.create', 'task.edit', 'task.complete',
            'email.view', 'email.send',
            'followup.view', 'followup.create', 'followup.edit', 'followup.complete',
            'reports.view', 'tags.manage', 'documents.manage',
            'calendar.view', 'notifications.view',
        ];
        $repIds = array_intersect_key($allSlugs, array_flip($repSlugs));
        $this->attachPermissions($roleIds['Sales Rep'], array_values($repIds));

        // Support
        $supportSlugs = [
            'crm.view', 'contact.view', 'contact.edit', 'customer.view', 'customer.edit',
            'activity.view', 'activity.create', 'activity.edit', 'activity.complete',
            'task.view', 'task.create', 'task.edit',
            'email.view', 'documents.manage', 'calendar.view', 'notifications.view',
        ];
        $supportIds = array_intersect_key($allSlugs, array_flip($supportSlugs));
        $this->attachPermissions($roleIds['Support'], array_values($supportIds));
    }

    protected function attachPermissions(int $roleId, array $permIds): void
    {
        foreach ($permIds as $pid) {
            DB::connection('tenant')->table('permission_role')->updateOrInsert(
                ['role_id' => $roleId, 'permission_id' => $pid],
                []
            );
        }
    }
}