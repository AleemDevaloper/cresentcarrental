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
        Schema::create('approval_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('type'); // leave, attendance_correction, overtime, expense, loan, etc.
            $table->morphs('approvable'); // Link to the specific record (Leave, Attendance, etc.)
            $table->string('status')->default('pending'); // pending, approved, rejected, cancelled
            $table->text('reason')->nullable();
            $table->text('approver_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_requests');
    }
};
