<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // AI Training Models
        Schema::create('ai_training_models', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('classification');
            $table->string('base_model')->default('gpt-4o');
            $table->text('description')->nullable();
            $table->float('learning_rate')->default(0.0001);
            $table->integer('epochs')->default(10);
            $table->integer('batch_size')->default(32);
            $table->string('status')->default('idle'); // idle, training, active, error
            $table->float('accuracy')->default(0);
            $table->float('loss')->nullable();
            $table->timestamp('last_trained_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // AI Training Datasets
        Schema::create('ai_training_datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('ai_training_models')->cascadeOnDelete();
            $table->string('name');
            $table->string('file_path')->nullable();
            $table->string('file_type')->default('jsonl');
            $table->bigInteger('row_count')->default(0);
            $table->string('file_size')->nullable();
            $table->string('status')->default('ready'); // processing, ready, error
            $table->timestamps();
        });

        // AI Training Sessions
        Schema::create('ai_training_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('ai_training_models')->cascadeOnDelete();
            $table->string('status')->default('pending'); // pending, running, completed, failed, stopped
            $table->integer('progress')->default(0);
            $table->string('current_epoch')->nullable();
            $table->float('loss')->nullable();
            $table->float('accuracy')->default(0);
            $table->integer('duration_ms')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // AI Training Agents
        Schema::create('ai_training_agents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('model_id')->constrained('ai_training_models')->cascadeOnDelete();
            $table->string('department')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('draft'); // draft, deployed
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_training_agents');
        Schema::dropIfExists('ai_training_sessions');
        Schema::dropIfExists('ai_training_datasets');
        Schema::dropIfExists('ai_training_models');
    }
};
