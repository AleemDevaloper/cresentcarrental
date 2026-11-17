<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late', 'half_day', 'holiday', 'leave'])->default('present');
            $table->timestamp('check_in_time')->nullable();
            $table->timestamp('check_out_time')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('marked_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['student_id', 'course_id', 'date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance_records');
    }
};
