<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_workspaces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('task_workspace_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('task_workspaces')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role')->default('member');
            $table->timestamps();

            $table->unique(['workspace_id', 'user_id']);
        });

        Schema::create('task_workspace_task', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('task_workspaces')->onDelete('cascade');
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['workspace_id', 'task_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_workspace_task');
        Schema::dropIfExists('task_workspace_user');
        Schema::dropIfExists('task_workspaces');
    }
};
