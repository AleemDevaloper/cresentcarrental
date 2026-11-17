<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->timestamp('suspended_at')->nullable();
            $table->unsignedBigInteger('suspended_by')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->text('variance_reason')->nullable();
        });

        Schema::create('pos_cash_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_number')->unique();
            $table->foreignId('from_session_id')->constrained('pos_sessions')->restrictOnDelete();
            $table->foreignId('to_session_id')->constrained('pos_sessions')->restrictOnDelete();
            $table->decimal('amount', 18, 2);
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('requested_by');
            $table->unsignedBigInteger('accepted_by')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->text('reason');
            $table->timestamps();
            $table->index(['from_session_id', 'status']);
            $table->index(['to_session_id', 'status']);
        });

        Schema::create('pos_reconciliations', function (Blueprint $table) {
            $table->id();
            $table->string('reconciliation_number')->unique();
            $table->foreignId('session_id')->constrained('pos_sessions')->restrictOnDelete();
            $table->decimal('expected_cash', 18, 2);
            $table->decimal('actual_cash', 18, 2);
            $table->decimal('variance', 18, 2);
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('variance_reason')->nullable();
            $table->timestamps();
            $table->index(['session_id', 'status']);
        });

        Schema::create('pos_cash_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->nullable()->constrained('pos_sessions')->nullOnDelete();
            $table->foreignId('terminal_id')->nullable()->constrained('pos_terminals')->nullOnDelete();
            $table->string('type');
            $table->string('severity')->default('warning');
            $table->text('message');
            $table->string('status')->default('open');
            $table->timestamps();
            $table->index(['status', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_cash_alerts');
        Schema::dropIfExists('pos_reconciliations');
        Schema::dropIfExists('pos_cash_transfers');
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->dropColumn(['suspended_at', 'suspended_by', 'suspension_reason', 'variance_reason']);
        });
    }
};
