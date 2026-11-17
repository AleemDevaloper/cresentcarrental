<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User Management
            ['name' => 'View Users', 'slug' => 'view_users', 'module' => 'Users'],
            ['name' => 'Create Users', 'slug' => 'create_users', 'module' => 'Users'],
            ['name' => 'Update Users', 'slug' => 'update_users', 'module' => 'Users'],
            ['name' => 'Delete Users', 'slug' => 'delete_users', 'module' => 'Users'],
            ['name' => 'Import Users', 'slug' => 'import_users', 'module' => 'Users'],
            ['name' => 'Export Users', 'slug' => 'export_users', 'module' => 'Users'],

            // Role Management
            ['name' => 'View Roles', 'slug' => 'view_roles', 'module' => 'RBAC'],
            ['name' => 'Create Roles', 'slug' => 'create_roles', 'module' => 'RBAC'],
            ['name' => 'Update Roles', 'slug' => 'update_roles', 'module' => 'RBAC'],
            ['name' => 'Delete Roles', 'slug' => 'delete_roles', 'module' => 'RBAC'],

            // Project Management
            ['name' => 'View Projects', 'slug' => 'view_projects', 'module' => 'Projects'],
            ['name' => 'Create Projects', 'slug' => 'create_projects', 'module' => 'Projects'],
            ['name' => 'Update Projects', 'slug' => 'update_projects', 'module' => 'Projects'],
            ['name' => 'Delete Projects', 'slug' => 'delete_projects', 'module' => 'Projects'],

            // HRMS - Leaves
            ['name' => 'View Leaves', 'slug' => 'view_leaves', 'module' => 'HRMS'],
            ['name' => 'Apply Leaves', 'slug' => 'apply_leaves', 'module' => 'HRMS'],
            ['name' => 'Approve Leaves', 'slug' => 'approve_leaves', 'module' => 'HRMS'],
            ['name' => 'Reject Leaves', 'slug' => 'reject_leaves', 'module' => 'HRMS'],

            // HRMS - Attendance
            ['name' => 'View Attendance', 'slug' => 'view_attendance', 'module' => 'HRMS'],
            ['name' => 'Mark Attendance', 'slug' => 'mark_attendance', 'module' => 'HRMS'],
            ['name' => 'Correct Attendance', 'slug' => 'correct_attendance', 'module' => 'HRMS'],

            // HRMS - Departments
            ['name' => 'Manage Departments', 'slug' => 'manage_departments', 'module' => 'HRMS'],

            // Sidebar Tabs Permissions
            ['name' => 'Sidebar Dashboard', 'slug' => 'sidebar_dashboard', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Systems Hub', 'slug' => 'sidebar_systems_hub', 'module' => 'Sidebar'],
            ['name' => 'Sidebar HR Analytics', 'slug' => 'sidebar_hrms_dashboard', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Project Stats', 'slug' => 'sidebar_pms_dashboard', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Team Chat', 'slug' => 'sidebar_chat', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Notifications', 'slug' => 'sidebar_notifications', 'module' => 'Sidebar'],
            ['name' => 'Sidebar FAQ', 'slug' => 'sidebar_faq', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Products & Services', 'slug' => 'sidebar_product_services', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Data Backup', 'slug' => 'sidebar_data_backup', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Users', 'slug' => 'sidebar_users', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Roles', 'slug' => 'sidebar_roles', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Modules', 'slug' => 'sidebar_modules', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Permissions', 'slug' => 'sidebar_permissions', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Theme Settings', 'slug' => 'sidebar_theme', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Sidebar Theme', 'slug' => 'sidebar_sidebartheme', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Theme Assignment', 'slug' => 'sidebar_theme_assignment', 'module' => 'Sidebar'],
            ['name' => 'Sidebar System Settings', 'slug' => 'sidebar_admin_settings', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Attendance', 'slug' => 'sidebar_hrms_attendance', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Leaves', 'slug' => 'sidebar_hrms_leaves', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Workforce Activity Logs', 'slug' => 'sidebar_workforce_activity_logs', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Teams', 'slug' => 'sidebar_teams', 'module' => 'Sidebar'],
            ['name' => 'Sidebar Clients', 'slug' => 'sidebar_workforce_clients', 'module' => 'Sidebar'],

            // System Access Permissions
            ['name' => 'Access PMS', 'slug' => 'system_pms', 'module' => 'Systems'],
            ['name' => 'Access HRMS', 'slug' => 'system_hrms', 'module' => 'Systems'],
            ['name' => 'Access FMS', 'slug' => 'system_fms', 'module' => 'Systems'],
            ['name' => 'Access TMS', 'slug' => 'system_tms', 'module' => 'Systems'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['slug' => $perm['slug']], $perm);
        }

        // Link all permissions to Admin role if it exists
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->permissions()->sync(Permission::all());
        }
    }
}
