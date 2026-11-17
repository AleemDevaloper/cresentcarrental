<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CrmPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = $this->crmPermissions();
        $table = config('database.connections.tenant.database') . '.permissions';

        foreach ($permissions as $p) {
            DB::connection('tenant')->table('permissions')->updateOrInsert(
                ['slug' => $p['slug']],
                $p
            );
        }
        $this->command->info('CRM permissions seeded (' . count($permissions) . ' permissions)');
    }

    protected function crmPermissions(): array
    {
        $modules = ['CRM', 'Leads', 'Contacts', 'Companies', 'Deals', 'Pipelines', 'Activities', 'Tasks',
            'Email', 'Follow-Ups', 'Sequences', 'Automation', 'Campaigns', 'Calendar',
            'Documents', 'Reports', 'Tags', 'Custom Fields', 'Audit', 'Notifications', 'Settings'];

        $actions = ['view', 'create', 'edit', 'delete'];
        $perms = [];

        // General
        $perms[] = ['name' => 'CRM View', 'slug' => 'crm.view', 'module' => 'CRM'];
        $perms[] = ['name' => 'CRM Create', 'slug' => 'crm.create', 'module' => 'CRM'];
        $perms[] = ['name' => 'CRM Edit', 'slug' => 'crm.edit', 'module' => 'CRM'];
        $perms[] = ['name' => 'CRM Delete', 'slug' => 'crm.delete', 'module' => 'CRM'];
        $perms[] = ['name' => 'CRM Export', 'slug' => 'crm.export', 'module' => 'CRM'];
        $perms[] = ['name' => 'CRM Import', 'slug' => 'crm.import', 'module' => 'CRM'];

        // Lead
        foreach (['view', 'create', 'edit', 'delete', 'assign', 'convert'] as $a) {
            $perms[] = ['name' => "Lead $a", 'slug' => "lead.$a", 'module' => 'Leads'];
        }

        // Contact
        foreach (['view', 'create', 'edit', 'delete'] as $a) {
            $perms[] = ['name' => "Contact $a", 'slug' => "contact.$a", 'module' => 'Contacts'];
        }

        // Customer (company)
        foreach (['view', 'create', 'edit', 'delete'] as $a) {
            $perms[] = ['name' => "Company $a", 'slug' => "customer.$a", 'module' => 'Companies'];
        }

        // Deal
        foreach (['view', 'create', 'edit', 'delete', 'move_stage', 'mark_won', 'mark_lost'] as $a) {
            $perms[] = ['name' => "Deal $a", 'slug' => "deal.$a", 'module' => 'Deals'];
        }

        // Pipeline
        foreach (['view', 'create', 'edit', 'delete'] as $a) {
            $perms[] = ['name' => "Pipeline $a", 'slug' => "pipeline.$a", 'module' => 'Pipelines'];
        }

        // Activity
        foreach (['view', 'create', 'edit', 'delete', 'complete'] as $a) {
            $perms[] = ['name' => "Activity $a", 'slug' => "activity.$a", 'module' => 'Activities'];
        }

        // Task
        foreach (['view', 'create', 'edit', 'delete', 'complete'] as $a) {
            $perms[] = ['name' => "Task $a", 'slug' => "task.$a", 'module' => 'Tasks'];
        }

        // Email
        foreach (['view', 'send', 'delete'] as $a) {
            $perms[] = ['name' => "Email $a", 'slug' => "email.$a", 'module' => 'Email'];
        }
        $perms[] = ['name' => 'Email Account Manage', 'slug' => 'email.account.manage', 'module' => 'Email'];
        $perms[] = ['name' => 'Email Template Manage', 'slug' => 'email.template.manage', 'module' => 'Email'];

        // Follow-up
        foreach (['view', 'create', 'edit', 'complete', 'assign'] as $a) {
            $perms[] = ['name' => "Follow-up $a", 'slug' => "followup.$a", 'module' => 'Follow-Ups'];
        }

        // Sequence
        foreach (['view', 'create', 'edit', 'delete', 'execute'] as $a) {
            $perms[] = ['name' => "Sequence $a", 'slug' => "sequence.$a", 'module' => 'Sequences'];
        };

        // Automation
        foreach (['view', 'create', 'edit', 'delete', 'execute'] as $a) {
            $perms[] = ['name' => "Automation $a", 'slug' => "automation.$a", 'module' => 'Automation'];
        }

        // Campaign
        foreach (['view', 'create', 'edit', 'delete', 'execute'] as $a) {
            $perms[] = ['name' => "Campaign $a", 'slug' => "campaign.$a", 'module' => 'Campaigns'];
        }

        // Reports
        $perms[] = ['name' => 'Reports View', 'slug' => 'reports.view', 'module' => 'Reports'];
        $perms[] = ['name' => 'Reports Export', 'slug' => 'reports.export', 'module' => 'Reports'];

        // Tags
        $perms[] = ['name' => 'Tags Manage', 'slug' => 'tags.manage', 'module' => 'Tags'];

        // Custom Fields
        $perms[] = ['name' => 'Custom Fields Manage', 'slug' => 'custom_fields.manage', 'module' => 'Custom Fields'];

        // Documents
        $perms[] = ['name' => 'Documents Manage', 'slug' => 'documents.manage', 'module' => 'Documents'];

        // Calendar
        $perms[] = ['name' => 'Calendar View', 'slug' => 'calendar.view', 'module' => 'Calendar'];

        // Audit
        $perms[] = ['name' => 'Audit View', 'slug' => 'audit.view', 'module' => 'Audit'];

        // Notifications
        $perms[] = ['name' => 'Notifications View', 'slug' => 'notifications.view', 'module' => 'Notifications'];

        // Settings
        $perms[] = ['name' => 'Settings Manage', 'slug' => 'settings.manage', 'module' => 'Settings'];

        foreach ($perms as &$p) {
            $p['created_at'] = now();
            $p['updated_at'] = now();
        }
        return $perms;
    }
}