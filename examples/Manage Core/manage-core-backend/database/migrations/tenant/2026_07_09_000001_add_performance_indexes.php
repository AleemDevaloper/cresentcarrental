<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected function addIndexIfColumnExists(string $table, string $index, string $columns, string $column): void
    {
        if (Schema::hasColumn($table, $column)) {
            $this->addIndex($table, $index, $columns);
        }
    }

    protected function addIndex(string $table, string $index, string $columns): void
    {
        if (!Schema::hasTable($table)) {
            return;
        }
        $cols = array_map('trim', explode(',', $columns));
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
        $this->addIndex('attendance', 'idx_attendance_user_date', 'user_id, date');
        $this->addIndex('attendance', 'idx_attendance_date_status', 'date, status');
        $this->addIndexIfColumnExists('attendance', 'idx_attendance_deleted_at', 'deleted_at', 'deleted_at');

        $this->addIndex('tasks', 'idx_tasks_project_status', 'project_id, status');
        $this->addIndex('tasks', 'idx_tasks_assigned_to', 'assigned_to');
        $this->addIndexIfColumnExists('tasks', 'idx_tasks_deleted_at', 'deleted_at', 'deleted_at');

        $this->addIndex('leaves', 'idx_leaves_user_status', 'user_id, status');
        $this->addIndex('leaves', 'idx_leaves_dates', 'start_date, end_date');

        $this->addIndex('expenses', 'idx_expenses_user_status', 'user_id, status');
        $this->addIndex('expenses', 'idx_expenses_date', 'expense_date');

        $this->addIndex('projects', 'idx_projects_status', 'status');

        $this->addIndex('overtime', 'idx_overtime_user_status', 'user_id, status');
        $this->addIndex('overtime', 'idx_overtime_date', 'date');

        $this->addIndex('payslips', 'idx_payslips_user_month_year', 'user_id, month, year');
        $this->addIndex('payslips', 'idx_payslips_batch_id', 'batch_id');
        $this->addIndexIfColumnExists('payslips', 'idx_payslips_deleted_at', 'deleted_at', 'deleted_at');

        $this->addIndex('hrms_payroll_batches', 'idx_batches_month_year', 'month, year');

        $this->addIndexIfColumnExists('salary_structures', 'idx_salary_structures_deleted_at', 'deleted_at', 'deleted_at');
        $this->addIndexIfColumnExists('employee_salaries', 'idx_employee_salaries_deleted_at', 'deleted_at', 'deleted_at');

        $this->addIndex('hrms_goals', 'idx_goals_user_id', 'user_id');
        $this->addIndex('hrms_performance_reviews', 'idx_reviews_user_reviewer', 'user_id, reviewer_id');

        $this->addIndex('approval_requests', 'idx_approval_requests_status', 'status');
        $this->addIndex('approval_requests', 'idx_approval_requests_approvable', 'approvable_type, approvable_id');

        $this->addIndex('audit_logs', 'idx_audit_logs_auditable', 'auditable_type, auditable_id');
        $this->addIndex('audit_logs', 'idx_audit_logs_created_at', 'created_at');

        $this->addIndexIfColumnExists('dms_folders', 'idx_dms_folders_deleted_at', 'deleted_at', 'deleted_at');
        $this->addIndexIfColumnExists('dms_documents', 'idx_dms_documents_deleted_at', 'deleted_at', 'deleted_at');

        $this->addIndex('notifications', 'idx_notifications_type', 'type');
        $this->addIndex('notifications', 'idx_notifications_read_at', 'read_at');
    }

    public function down(): void
    {
        $indexes = [
            'attendance' => ['idx_attendance_user_date', 'idx_attendance_date_status', 'idx_attendance_deleted_at'],
            'tasks' => ['idx_tasks_project_status', 'idx_tasks_assigned_to', 'idx_tasks_deleted_at'],
            'leaves' => ['idx_leaves_user_status', 'idx_leaves_dates'],
            'expenses' => ['idx_expenses_user_status', 'idx_expenses_date'],
            'projects' => ['idx_projects_status'],
            'overtime' => ['idx_overtime_user_status', 'idx_overtime_date'],
            'payslips' => ['idx_payslips_user_month_year', 'idx_payslips_batch_id', 'idx_payslips_deleted_at'],
            'hrms_payroll_batches' => ['idx_batches_month_year'],
            'salary_structures' => ['idx_salary_structures_deleted_at'],
            'employee_salaries' => ['idx_employee_salaries_deleted_at'],
            'hrms_goals' => ['idx_goals_user_id'],
            'hrms_performance_reviews' => ['idx_reviews_user_reviewer'],
            'approval_requests' => ['idx_approval_requests_status', 'idx_approval_requests_approvable'],
            'audit_logs' => ['idx_audit_logs_auditable', 'idx_audit_logs_created_at'],
            'dms_folders' => ['idx_dms_folders_deleted_at'],
            'dms_documents' => ['idx_dms_documents_deleted_at'],
            'notifications' => ['idx_notifications_type', 'idx_notifications_read_at'],
        ];
        foreach ($indexes as $table => $list) {
            foreach ($list as $index) {
                if (Schema::hasTable($table) && Schema::hasIndex($table, $index)) {
                    Schema::table($table, function (Blueprint $table) use ($index) {
                        $table->dropIndex($index);
                    });
                }
            }
        }
    }
};
