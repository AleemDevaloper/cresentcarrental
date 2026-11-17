<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_bank_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('bank_name');
            $table->string('account_title');
            $table->string('account_number');
            $table->string('iban')->nullable();
            $table->string('branch_code')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('swift_code')->nullable();
            $table->string('salary_transfer_method')->default('direct_deposit');
            $table->boolean('is_primary')->default(false);
            $table->string('verification_status')->default('pending');
            $table->text('verification_notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('added_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('contact_name');
            $table->string('relationship');
            $table->string('phone_number');
            $table->string('mobile_number')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->enum('priority', ['primary', 'secondary']);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        Schema::create('reporting_hierarchy', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reporting_manager_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('secondary_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('dotted_line_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('hierarchy_level')->nullable();
            $table->boolean('is_primary')->default(true);
            $table->timestamps();
        });

        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');
            $table->string('document_name');
            $table->string('file_path');
            $table->bigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->integer('version')->default(1);
            $table->string('verification_status')->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_locked')->default(false);
            $table->json('access_permissions')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('employee_document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_document_id')->constrained('employee_documents')->cascadeOnDelete();
            $table->integer('version_number');
            $table->string('file_path');
            $table->bigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('rotational_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('shift_ids');
            $table->enum('rotation_type', ['weekly', 'monthly', 'custom']);
            $table->integer('rotation_days')->default(7);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('weekly_offs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('day_of_week');
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('designation_id')->nullable()->constrained('designations')->nullOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete();
            $table->boolean('is_rotational')->default(false);
            $table->integer('rotation_interval')->nullable();
            $table->timestamps();
        });

        Schema::create('break_times', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_paid')->default(true);
            $table->string('type')->default('break');
            $table->timestamps();
        });

        Schema::create('geo_fences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('circle');
            $table->json('coordinates');
            $table->decimal('radius', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('site_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->enum('assignment_type', ['permanent', 'temporary']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('assigned_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('leave_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('leave_type');
            $table->integer('year');
            $table->decimal('allocated', 8, 2);
            $table->decimal('used', 8, 2)->default(0);
            $table->decimal('pending', 8, 2)->default(0);
            $table->decimal('remaining', 8, 2)->virtualAs('allocated - used - pending');
            $table->timestamps();
        });

        Schema::create('leave_accrual_rules', function (Blueprint $table) {
            $table->id();
            $table->string('leave_type');
            $table->enum('accrual_frequency', ['monthly', 'quarterly', 'yearly']);
            $table->decimal('accrual_amount', 8, 2);
            $table->decimal('max_balance', 8, 2)->nullable();
            $table->boolean('carry_forward')->default(false);
            $table->decimal('carry_forward_limit', 8, 2)->nullable();
            $table->integer('service_months_required')->default(0);
            $table->timestamps();
        });

        Schema::create('overtime_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['daily', 'weekly', 'holiday', 'weekend', 'night', 'double']);
            $table->decimal('rate_multiplier', 5, 2);
            $table->decimal('max_hours_per_day', 5, 2)->nullable();
            $table->decimal('max_hours_per_week', 5, 2)->nullable();
            $table->boolean('requires_approval')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('attendance_reports_red_zone', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('risk_score', 5, 2)->default(0);
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical']);
            $table->json('conditions_met');
            $table->timestamp('last_evaluated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('shift_grace_times', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete();
            $table->enum('type', ['check_in', 'check_out']);
            $table->integer('grace_minutes')->default(0);
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_grace_times');
        Schema::dropIfExists('attendance_reports_red_zone');
        Schema::dropIfExists('overtime_rules');
        Schema::dropIfExists('leave_accrual_rules');
        Schema::dropIfExists('leave_quotas');
        Schema::dropIfExists('site_assignments');
        Schema::dropIfExists('geo_fences');
        Schema::dropIfExists('break_times');
        Schema::dropIfExists('weekly_offs');
        Schema::dropIfExists('rotational_shifts');
        Schema::dropIfExists('employee_document_versions');
        Schema::dropIfExists('employee_documents');
        Schema::dropIfExists('reporting_hierarchy');
        Schema::dropIfExists('emergency_contacts');
        Schema::dropIfExists('employee_bank_details');
    }
};
