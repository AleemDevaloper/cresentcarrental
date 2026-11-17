<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('feature', 50)->default('chat');
            $table->string('provider', 50)->nullable();
            $table->string('model', 100)->nullable();
            $table->text('prompt')->nullable();
            $table->text('response')->nullable();
            $table->integer('input_tokens')->default(0);
            $table->integer('output_tokens')->default(0);
            $table->decimal('cost', 10, 6)->default(0);
            $table->integer('duration_ms')->default(0);
            $table->string('status', 20)->default('success');
            $table->text('error_message')->nullable();
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
            $table->index(['feature', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
    }
};
