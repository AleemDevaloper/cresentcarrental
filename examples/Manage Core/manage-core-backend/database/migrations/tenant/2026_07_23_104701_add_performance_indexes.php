<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected function addIndex(string $table, string $index, string $columns): void
    {
        if (!Schema::hasTable($table)) {
            return;
        }
        $cols = array_map(function ($col) {
            return preg_replace('/\(\d+\)$/', '', trim($col, "` "));
        }, explode(',', $columns));
        foreach ($cols as $col) {
            if (!Schema::hasColumn($table, $col)) {
                return;
            }
        }
        if (Schema::hasIndex($table, $index)) {
            return;
        }
        Schema::table($table, function (Blueprint $table) use ($index, $cols) {
            $table->index($cols, $index);
        });
    }

    public function up(): void
    {
        $this->addIndex('users', 'idx_users_role_status', 'role, status');
        $this->addIndex('users', 'idx_users_organization', 'organization');
        $this->addIndex('users', 'idx_users_manager_id', 'manager_id');
        $this->addIndex('users', 'idx_users_last_seen_at', 'last_seen_at');

        $this->addIndex('task_attachments', 'idx_task_attachments_user_id', 'user_id');
        $this->addIndex('task_attachments', 'idx_task_attachments_task_id', 'task_id');

        $this->addIndex('user_documents', 'idx_user_documents_user_id', 'user_id');

        $this->addIndex('projects', 'idx_projects_created_by', 'created_by');
        $this->addIndex('projects', 'idx_projects_created_by_file_size', 'created_by, file_size');

        $this->addIndex('permission_user', 'idx_permission_user_user_id', 'user_id');
        $this->addIndex('permission_role', 'idx_permission_role_role_id', 'role_id');

        $this->addIndex('ai_usage_logs', 'idx_ai_usage_logs_user_id', 'user_id');
        $this->addIndex('ai_usage_logs', 'idx_ai_usage_logs_created_at', 'created_at');

        $this->addIndex('sessions', 'idx_sessions_user_id', 'user_id');
        $this->addIndex('sessions', 'idx_sessions_last_activity', 'last_activity');

        $this->addIndex('cache', 'idx_cache_key', '`key`(191)');

        $this->addIndex('jobs', 'idx_jobs_queue', 'queue');

        $this->addIndex('team_user', 'idx_team_user_user_id', 'user_id');
        $this->addIndex('team_user', 'idx_team_user_team_id', 'team_id');

        $this->addIndex('role_user', 'idx_role_user_user_id', 'user_id');
        $this->addIndex('role_user', 'idx_role_user_role_id', 'role_id');
    }

    public function down(): void
    {
        $tables = [
            'users' => ['idx_users_role_status', 'idx_users_organization', 'idx_users_manager_id', 'idx_users_last_seen_at'],
            'task_attachments' => ['idx_task_attachments_user_id', 'idx_task_attachments_task_id'],
            'user_documents' => ['idx_user_documents_user_id'],
            'projects' => ['idx_projects_created_by', 'idx_projects_created_by_file_size'],
            'permission_user' => ['idx_permission_user_user_id'],
            'permission_role' => ['idx_permission_role_role_id'],
            'ai_usage_logs' => ['idx_ai_usage_logs_user_id', 'idx_ai_usage_logs_created_at'],
            'sessions' => ['idx_sessions_user_id', 'idx_sessions_last_activity'],
            'cache' => ['idx_cache_key'],
            'jobs' => ['idx_jobs_queue'],
            'team_user' => ['idx_team_user_user_id', 'idx_team_user_team_id'],
            'role_user' => ['idx_role_user_user_id', 'idx_role_user_role_id'],
        ];
        foreach ($tables as $table => $indexes) {
            foreach ($indexes as $index) {
                if (Schema::hasTable($table) && Schema::hasIndex($table, $index)) {
                    Schema::table($table, function (Blueprint $table) use ($index) {
                        $table->dropIndex($index);
                    });
                }
            }
        }
    }
};
