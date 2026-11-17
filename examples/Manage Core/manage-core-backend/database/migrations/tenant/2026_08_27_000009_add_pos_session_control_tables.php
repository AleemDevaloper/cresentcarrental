<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->boolean('is_locked')->default(false);
            $table->timestamp('reopened_at')->nullable();
            $table->unsignedBigInteger('reopened_by')->nullable();
            $table->text('reopen_reason')->nullable();
        });

        Schema::create('pos_session_handovers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('pos_sessions')->cascadeOnDelete();
            $table->unsignedBigInteger('from_user_id');
            $table->unsignedBigInteger('to_user_id');
            $table->decimal('cash_amount', 18, 2)->nullable();
            $table->text('reason')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_terminal_locks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('terminal_id')->constrained('pos_terminals')->cascadeOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('pos_sessions')->nullOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->timestamp('locked_at')->useCurrent();
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamps();
            $table->index(['terminal_id', 'unlocked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_terminal_locks');
        Schema::dropIfExists('pos_session_handovers');
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->dropColumn(['is_locked', 'reopened_at', 'reopened_by', 'reopen_reason']);
        });
    }
};
