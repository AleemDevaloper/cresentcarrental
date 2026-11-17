<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_corrections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->date('correction_date');
            $table->time('scheduled_time')->nullable();
            $table->time('actual_time')->nullable();
            $table->text('reason')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('hr_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rehire_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('previous_employee_id')->constrained('users')->cascadeOnDelete();
            $table->string('previous_emp_code')->nullable();
            $table->date('rehire_date');
            $table->string('status')->default('active');
            $table->boolean('service_continuity')->default(false);
            $table->boolean('previous_benefits_restored')->default(false);
            $table->timestamps();
        });

        Schema::create('employee_code_configs', function (Blueprint $table) {
            $table->id();
            $table->string('prefix')->nullable();
            $table->string('format')->default('{prefix}{sequence}');
            $table->integer('sequence_start')->default(1);
            $table->integer('sequence_current')->default(0);
            $table->string('separator')->default('-');
            $table->boolean('auto_generate')->default(true);
            $table->boolean('use_department_prefix')->default(false);
            $table->boolean('use_location_prefix')->default(false);
            $table->integer('padding')->default(4);
            $table->timestamps();
        });

        Schema::create('employee_code_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('employee_code');
            $table->string('action');
            $table->string('previous_code')->nullable();
            $table->foreignId('changed_by')->constrained('users')->cascadeOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('portals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('domain')->unique()->nullable();
            $table->string('status')->default('active');
            $table->json('theme_settings')->nullable();
            $table->string('language')->default('en');
            $table->string('timezone')->default('UTC');
            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('portal_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portal_id')->constrained('portals')->cascadeOnDelete();
            $table->string('module_key');
            $table->boolean('enabled')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('employee_documents_hr', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('document_path');
            $table->boolean('verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents_hr');
        Schema::dropIfExists('portal_modules');
        Schema::dropIfExists('portals');
        Schema::dropIfExists('employee_code_histories');
        Schema::dropIfExists('employee_code_configs');
        Schema::dropIfExists('rehire_records');
        Schema::dropIfExists('attendance_corrections');
    }
};
