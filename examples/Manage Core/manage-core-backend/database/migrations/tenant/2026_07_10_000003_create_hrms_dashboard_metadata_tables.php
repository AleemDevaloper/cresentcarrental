<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // For storing user drag-and-drop layouts (HR Dashboard and Health Dashboard)
        Schema::create('dashboard_layouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('view_type')->default('hr_dashboard'); // hr_dashboard, health_dashboard
            $table->json('layout_data')->nullable(); // drag-and-drop order and sizes
            $table->timestamps();
        });

        // For storing user preferences
        Schema::create('dashboard_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->integer('refresh_interval')->default(30); // in seconds
            $table->string('default_date_range')->default('this_month');
            $table->unsignedBigInteger('default_company_id')->nullable();
            $table->unsignedBigInteger('default_branch_id')->nullable();
            $table->string('default_theme')->default('light');
            $table->json('notification_preferences')->nullable();
            $table->timestamps();
        });

        // For storing saved views
        Schema::create('dashboard_saved_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('hr_dashboard'); // hr_dashboard, health_dashboard
            $table->json('layout_data')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // For storing customized widgets setup
        Schema::create('dashboard_widgets', function (Blueprint $table) {
            $table->id();
            $table->string('widget_key')->unique();
            $table->string('name');
            $table->string('category')->default('hr'); // hr, health, general
            $table->boolean('is_active')->default(true);
            $table->string('permission_required')->nullable();
            $table->timestamps();
        });

        // For storing activity/audit logs specific to dashboards
        Schema::create('dashboard_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('action'); // view_widget, export_report, filter_applied, etc.
            $table->string('view_type')->default('hr_dashboard');
            $table->json('details')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('browser')->nullable();
            $table->string('operating_system')->nullable();
            $table->timestamps();
        });

        // For storing HRMS health scores over time
        Schema::create('hr_health_scores', function (Blueprint $table) {
            $table->id();
            $table->decimal('overall_score', 5, 2)->default(100.00);
            $table->decimal('attendance_score', 5, 2)->default(100.00);
            $table->decimal('payroll_score', 5, 2)->default(100.00);
            $table->decimal('compliance_score', 5, 2)->default(100.00);
            $table->decimal('employee_data_score', 5, 2)->default(100.00);
            $table->decimal('approval_score', 5, 2)->default(100.00);
            $table->decimal('recruitment_score', 5, 2)->default(100.00);
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hr_health_scores');
        Schema::dropIfExists('dashboard_activity_logs');
        Schema::dropIfExists('dashboard_widgets');
        Schema::dropIfExists('dashboard_saved_views');
        Schema::dropIfExists('dashboard_preferences');
        Schema::dropIfExists('dashboard_layouts');
    }
};
