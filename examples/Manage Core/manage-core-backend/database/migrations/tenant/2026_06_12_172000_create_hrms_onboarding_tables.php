<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Onboarding Checklists (Templates)
        Schema::create('hrms_onboarding_checklists', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Engineering Onboarding", "Admin Staff"
            $table->json('items'); // JSON array of tasks: [{title, responsible_dept, description}]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Employee Onboarding Status
        Schema::create('hrms_employee_onboarding', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('checklist_id')->constrained('hrms_onboarding_checklists')->onDelete('cascade');
            $table->json('completed_items')->nullable(); // Array of item IDs/indices
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->date('started_at')->nullable();
            $table->date('completed_at')->nullable();
            $table->timestamps();
        });

        // Exit Clearance Stages (Department-wise)
        Schema::create('hrms_exit_clearance_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resignation_id')->constrained('resignations')->onDelete('cascade');
            $table->enum('department', ['IT', 'HR', 'Admin', 'Finance', 'Manager'])->default('IT');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->text('comments')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        // Add notice_period and settlement_status to resignations
        Schema::table('resignations', function (Blueprint $table) {
            $table->integer('notice_period_days')->default(30)->after('last_working_day');
            $table->enum('settlement_status', ['pending', 'processing', 'settled'])->default('pending')->after('status');
            $table->decimal('final_settlement_amount', 15, 2)->nullable()->after('settlement_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resignations', function (Blueprint $table) {
            $table->dropColumn(['notice_period_days', 'settlement_status', 'final_settlement_amount']);
        });
        Schema::dropIfExists('hrms_exit_clearance_stages');
        Schema::dropIfExists('hrms_employee_onboarding');
        Schema::dropIfExists('hrms_onboarding_checklists');
    }
};
