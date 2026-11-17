<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('short_name')->nullable();
            $table->text('description')->nullable();
            $table->integer('credit_hours')->default(0);
            $table->integer('lecture_hours')->nullable();
            $table->integer('lab_hours')->nullable();
            $table->decimal('passing_marks', 8, 2)->nullable();
            $table->decimal('total_marks', 8, 2)->nullable();
            $table->string('type')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('subjects');
    }
};
