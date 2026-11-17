<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('examination_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assignment_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('score', 8, 2)->nullable();
            $table->decimal('total_score', 8, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->string('letter_grade')->nullable();
            $table->decimal('grade_point', 3, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('graded_by')->nullable();
            $table->boolean('is_pass')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('grades');
    }
};
