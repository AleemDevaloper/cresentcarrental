<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_backlogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('sprint_id')->nullable()->constrained('project_sprints')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('Feature'); // Feature, Bug, Task, Spike, Chore
            $table->string('priority')->default('Medium'); // Low, Medium, High, Critical
            $table->string('status')->default('To Do'); // To Do, In Progress, In Review, Done
            $table->integer('story_points')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_backlogs');
    }
};
