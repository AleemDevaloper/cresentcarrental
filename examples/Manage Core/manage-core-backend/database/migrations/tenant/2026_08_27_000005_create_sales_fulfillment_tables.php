<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('status')->default('draft');
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('discount_total', 18, 2)->default(0);
            $table->decimal('tax_total', 18, 2)->default(0);
            $table->decimal('total', 18, 2)->default(0);
            $table->date('requested_delivery_date')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['customer_id', 'status']);
        });

        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->cascadeOnDelete();
            $table->unsignedBigInteger('product_id');
            $table->decimal('ordered_quantity', 18, 4);
            $table->decimal('reserved_quantity', 18, 4)->default(0);
            $table->decimal('issued_quantity', 18, 4)->default(0);
            $table->decimal('unit_price', 18, 4);
            $table->decimal('tax_amount', 18, 2)->default(0);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index('product_id');
        });

        Schema::create('sales_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->cascadeOnDelete();
            $table->string('delivery_number')->unique();
            $table->string('status')->default('draft');
            $table->string('tracking_number')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->json('proof_of_delivery')->nullable();
            $table->timestamps();
            $table->index(['sales_order_id', 'status']);
        });

        Schema::create('sales_delivery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_delivery_id')->constrained('sales_deliveries')->cascadeOnDelete();
            $table->foreignId('sales_order_item_id')->constrained('sales_order_items')->cascadeOnDelete();
            $table->decimal('quantity', 18, 4);
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->unsignedBigInteger('serial_id')->nullable();
            $table->timestamps();
        });

        Schema::create('sales_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->foreignId('sales_order_id')->nullable()->constrained('sales_orders')->nullOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('status')->default('draft');
            $table->string('resolution')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->index(['customer_id', 'status']);
        });

        Schema::create('sales_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_return_id')->constrained('sales_returns')->cascadeOnDelete();
            $table->unsignedBigInteger('product_id');
            $table->decimal('quantity', 18, 4);
            $table->string('condition')->default('pending_inspection');
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->unsignedBigInteger('serial_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_return_items');
        Schema::dropIfExists('sales_returns');
        Schema::dropIfExists('sales_delivery_items');
        Schema::dropIfExists('sales_deliveries');
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
    }
};
