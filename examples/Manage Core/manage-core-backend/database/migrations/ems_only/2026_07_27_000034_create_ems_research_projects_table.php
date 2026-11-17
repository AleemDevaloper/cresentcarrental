<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('research_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('lead_researcher');
            $table->json('co_researchers')->nullable();
            $table->string('department')->nullable();
            $table->string('funding_source')->nullable();
            $table->decimal('budget', 14, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['proposed', 'active', 'completed', 'on_hold', 'cancelled'])->default('proposed');
            $table->text('findings')->nullable();
            $table->text('conclusion')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('research_projects');
    }
};
