<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_terminals', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('branch')->nullable();
            $table->string('store')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('assigned_user_id')->nullable();
            $table->json('configuration')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_product_catalog', function (Blueprint $table) {
            $table->id();
            $table->string('source')->default('local');
            $table->string('source_product_id')->nullable();
            $table->string('source_variant_id')->nullable();
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('image_url')->nullable();
            $table->decimal('price', 18, 2)->default(0);
            $table->decimal('tax_rate', 8, 4)->default(0);
            $table->boolean('discount_eligible')->default(true);
            $table->boolean('available_for_sale')->default(true);
            $table->string('status')->default('active');
            $table->unsignedInteger('version')->default(1);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            $table->index(['barcode', 'status']);
            $table->index(['sku', 'status']);
        });

        Schema::create('pos_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('terminal_id')->constrained('pos_terminals')->cascadeOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->string('status')->default('open');
            $table->decimal('opening_cash', 18, 2)->default(0);
            $table->decimal('expected_cash', 18, 2)->default(0);
            $table->decimal('actual_cash', 18, 2)->nullable();
            $table->decimal('variance', 18, 2)->nullable();
            $table->timestamp('opened_at')->useCurrent();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->index(['terminal_id', 'status']);
        });

        Schema::create('pos_orders', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique();
            $table->foreignId('terminal_id')->constrained('pos_terminals')->restrictOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('pos_sessions')->nullOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('status')->default('draft');
            $table->string('sync_status')->default('not_required');
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('discount_total', 18, 2)->default(0);
            $table->decimal('tax_total', 18, 2)->default(0);
            $table->decimal('total', 18, 2)->default(0);
            $table->decimal('change_amount', 18, 2)->default(0);
            $table->string('source')->default('online');
            $table->string('idempotency_key')->unique();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['terminal_id', 'status']);
            $table->index(['sync_status', 'source']);
        });

        Schema::create('pos_order_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('pos_orders')->cascadeOnDelete();
            $table->string('catalog_product_id')->nullable();
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->decimal('quantity', 18, 4);
            $table->decimal('unit_price', 18, 4);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->decimal('tax_amount', 18, 2)->default(0);
            $table->decimal('line_total', 18, 2);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('pos_orders')->cascadeOnDelete();
            $table->string('method');
            $table->decimal('amount', 18, 2);
            $table->string('reference')->nullable();
            $table->string('status')->default('completed');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['method', 'status']);
        });

        Schema::create('pos_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained('pos_orders')->cascadeOnDelete();
            $table->string('receipt_number')->unique();
            $table->string('status')->default('issued');
            $table->timestamp('issued_at')->useCurrent();
            $table->json('delivery')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_cash_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('pos_sessions')->cascadeOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->decimal('amount', 18, 2);
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->foreignId('order_id')->constrained('pos_orders')->restrictOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->string('status')->default('completed');
            $table->string('resolution')->default('refund');
            $table->decimal('total', 18, 2)->default(0);
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_integration_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->unique();
            $table->string('event_type');
            $table->string('transaction_id');
            $table->string('target');
            $table->json('payload');
            $table->string('status')->default('pending');
            $table->unsignedInteger('retry_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();
            $table->index(['target', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_integration_events');
        Schema::dropIfExists('pos_returns');
        Schema::dropIfExists('pos_cash_movements');
        Schema::dropIfExists('pos_receipts');
        Schema::dropIfExists('pos_payments');
        Schema::dropIfExists('pos_order_lines');
        Schema::dropIfExists('pos_orders');
        Schema::dropIfExists('pos_sessions');
        Schema::dropIfExists('pos_product_catalog');
        Schema::dropIfExists('pos_terminals');
    }
};
