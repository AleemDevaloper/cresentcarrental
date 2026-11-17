<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // e.g., Financial, Operational, Inventory
            $table->string('frequency'); // e.g., daily, weekly, monthly
            $table->text('recipient_emails');
            $table->timestamp('last_run_at')->nullable();
            $table->timestamp('next_run_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('backup_logs', function (Blueprint $table) {
            $table->id();
            $table->string('status'); // e.g., success, failed
            $table->string('file_path')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->string('type')->default('full'); // e.g., full, incremental
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_logs');
        Schema::dropIfExists('report_schedules');
    }
};
