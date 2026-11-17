<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hrms_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('hrms_applications')->onDelete('cascade');
            $table->foreignId('interviewer_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('interview_date');
            $table->string('type')->default('Technical'); // Technical, HR, Final
            $table->string('status')->default('Scheduled'); // Scheduled, Completed, Cancelled
            $table->text('feedback')->nullable();
            $table->integer('rating')->nullable(); // 1-5
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hrms_interviews');
    }
};
