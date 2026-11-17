<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('instructions')->nullable();
            $table->decimal('max_score', 8, 2)->default(100);
            $table->decimal('passing_score', 8, 2)->nullable();
            $table->decimal('weightage', 5, 2)->nullable();
            $table->dateTime('due_date')->nullable();
            $table->string('submission_type')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('status', ['active', 'inactive', 'closed'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assignments');
    }
};
