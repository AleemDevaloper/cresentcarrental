<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_returns', function (Blueprint $table) {
            $table->string('return_type')->default('partial');
            $table->string('approval_status')->default('not_required');
            $table->string('idempotency_key')->nullable()->unique();
            $table->string('receipt_number')->nullable();
            $table->timestamp('completed_at')->nullable();
        });

        Schema::create('pos_return_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_id')->constrained('pos_returns')->cascadeOnDelete();
            $table->foreignId('order_line_id')->constrained('pos_order_lines')->restrictOnDelete();
            $table->decimal('quantity', 18, 4);
            $table->decimal('unit_price', 18, 4);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->decimal('tax_amount', 18, 2)->default(0);
            $table->decimal('refund_amount', 18, 2);
            $table->string('reason');
            $table->string('condition')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_refunds', function (Blueprint $table) {
            $table->id();
            $table->string('refund_number')->unique();
            $table->foreignId('return_id')->constrained('pos_returns')->restrictOnDelete();
            $table->foreignId('order_id')->constrained('pos_orders')->restrictOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('pos_sessions')->nullOnDelete();
            $table->string('method');
            $table->decimal('amount', 18, 2);
            $table->string('status')->default('completed');
            $table->string('idempotency_key')->unique();
            $table->string('provider_reference')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_store_credits', function (Blueprint $table) {
            $table->id();
            $table->string('credit_number')->unique();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->foreignId('return_id')->constrained('pos_returns')->restrictOnDelete();
            $table->decimal('amount', 18, 2);
            $table->decimal('remaining_amount', 18, 2);
            $table->string('status')->default('active');
            $table->date('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_store_credits');
        Schema::dropIfExists('pos_refunds');
        Schema::dropIfExists('pos_return_lines');
        Schema::table('pos_returns', function (Blueprint $table) {
            $table->dropColumn(['return_type', 'approval_status', 'idempotency_key', 'receipt_number', 'completed_at']);
        });
    }
};
