<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biometric_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('vendor')->default('ZKTeco');
            $table->string('device_code')->unique();
            $table->string('serial_number')->nullable();
            $table->string('ip_address')->nullable();
            $table->unsignedInteger('port')->default(4370);
            $table->foreignId('site_id')->nullable()->constrained('sites')->nullOnDelete();
            $table->string('timezone')->default('Asia/Karachi');
            $table->string('status')->default('active');
            $table->timestamp('last_sync_at')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('biometric_punch_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('biometric_device_id')->constrained('biometric_devices')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('employee_code');
            $table->timestamp('punch_time');
            $table->string('punch_type')->default('auto');
            $table->string('verify_mode')->nullable();
            $table->string('work_code')->nullable();
            $table->string('source')->default('device');
            $table->string('sync_status')->default('pending');
            $table->text('sync_notes')->nullable();
            $table->foreignId('attendance_id')->nullable()->constrained('attendance')->nullOnDelete();
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->unique(['biometric_device_id', 'employee_code', 'punch_time'], 'bio_punch_unique');
            $table->index(['employee_code', 'punch_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biometric_punch_logs');
        Schema::dropIfExists('biometric_devices');
    }
};
