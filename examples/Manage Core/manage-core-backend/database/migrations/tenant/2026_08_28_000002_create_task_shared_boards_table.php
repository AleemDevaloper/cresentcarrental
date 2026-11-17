<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_shared_boards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('task_shared_board_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained('task_shared_boards')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role')->default('viewer');
            $table->timestamps();

            $table->unique(['board_id', 'user_id']);
        });

        Schema::create('task_shared_board_task', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained('task_shared_boards')->onDelete('cascade');
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['board_id', 'task_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_shared_board_task');
        Schema::dropIfExists('task_shared_board_user');
        Schema::dropIfExists('task_shared_boards');
    }
};
