<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lms_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('instructor_id')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('short_description')->nullable();
            $table->string('category')->nullable();
            $table->string('level')->nullable();
            $table->string('language')->default('en');
            $table->string('thumbnail')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('duration_weeks')->nullable();
            $table->integer('total_lessons')->nullable();
            $table->decimal('total_hours', 6, 2)->nullable();
            $table->json('requirements')->nullable();
            $table->json('objectives')->nullable();
            $table->json('curriculum')->nullable();
            $table->boolean('is_published')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lms_courses');
    }
};
