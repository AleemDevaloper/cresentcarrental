<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('attendance_corrections')) {
            return;
        }

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
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_corrections');
    }
};
