<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('supplier_sku')->nullable();
            $table->string('supplier_barcode')->nullable()->index();
            $table->string('supplier_product_name')->nullable();
            $table->string('purchase_unit')->nullable();
            $table->decimal('conversion_factor', 15, 4)->default(1);
            $table->decimal('minimum_order_quantity', 15, 4)->default(0);
            $table->decimal('order_multiple', 15, 4)->default(1);
            $table->unsignedInteger('lead_time_days')->nullable();
            $table->decimal('last_purchase_price', 15, 4)->nullable();
            $table->string('currency')->nullable();
            $table->boolean('is_preferred')->default(false);
            $table->string('status')->default('active')->index();
            $table->timestamps();
            $table->unique(['vendor_id', 'product_id', 'product_variant_id'], 'supplier_product_unique');
        });

        Schema::create('supplier_product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_product_id')->constrained('supplier_products')->cascadeOnDelete();
            $table->decimal('unit_price', 15, 4);
            $table->string('currency')->nullable();
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();
            $table->index(['supplier_product_id', 'effective_from']);
        });

        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('pr_number')->unique();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->string('requesting_department')->nullable();
            $table->date('required_date')->nullable();
            $table->string('priority')->default('normal');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('purchase_requisition_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requisition_id')->constrained('purchase_requisitions')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->decimal('quantity', 15, 4);
            $table->string('unit')->nullable();
            $table->decimal('estimated_unit_cost', 15, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('vendor_id')->constrained('vendors')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->string('currency')->nullable();
            $table->decimal('exchange_rate', 15, 6)->nullable();
            $table->string('payment_terms')->nullable();
            $table->string('delivery_terms')->nullable();
            $table->decimal('subtotal', 15, 4)->default(0);
            $table->decimal('tax_amount', 15, 4)->default(0);
            $table->decimal('total_amount', 15, 4)->default(0);
            $table->decimal('over_receipt_tolerance', 8, 4)->default(0);
            $table->string('status')->default('draft')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['vendor_id', 'warehouse_id', 'status']);
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('supplier_sku')->nullable();
            $table->decimal('quantity', 15, 4);
            $table->decimal('received_quantity', 15, 4)->default(0);
            $table->string('unit')->nullable();
            $table->decimal('unit_price', 15, 4);
            $table->decimal('tax_amount', 15, 4)->default(0);
            $table->decimal('total_amount', 15, 4)->default(0);
            $table->date('expected_date')->nullable();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('goods_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('grn_number')->unique();
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->restrictOnDelete();
            $table->foreignId('vendor_id')->constrained('vendors')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->date('receipt_date');
            $table->string('delivery_note_number')->nullable();
            $table->string('supplier_invoice_reference')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('quality_status')->default('pending_inspection');
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['purchase_order_id', 'status']);
        });

        Schema::create('goods_receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goods_receipt_id')->constrained('goods_receipts')->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->nullable()->constrained('purchase_order_items')->nullOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->decimal('ordered_quantity', 15, 4)->default(0);
            $table->decimal('received_quantity', 15, 4);
            $table->decimal('accepted_quantity', 15, 4)->default(0);
            $table->decimal('rejected_quantity', 15, 4)->default(0);
            $table->decimal('damaged_quantity', 15, 4)->default(0);
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->json('serial_numbers')->nullable();
            $table->date('expiry_date')->nullable();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->foreignId('vendor_id')->constrained('vendors')->restrictOnDelete();
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->nullOnDelete();
            $table->foreignId('goods_receipt_id')->nullable()->constrained('goods_receipts')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->string('reason');
            $table->string('status')->default('draft')->index();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('purchase_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_return_id')->constrained('purchase_returns')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->decimal('quantity', 15, 4);
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->foreignId('serial_id')->nullable()->constrained('inventory_serial_numbers')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('purchase_price_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->restrictOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->nullOnDelete();
            $table->foreignId('goods_receipt_id')->nullable()->constrained('goods_receipts')->nullOnDelete();
            $table->decimal('quantity', 15, 4);
            $table->decimal('unit_cost', 15, 4);
            $table->string('currency')->nullable();
            $table->date('receipt_date');
            $table->timestamps();
            $table->index(['vendor_id', 'product_id', 'receipt_date']);
        });

        Schema::create('purchase_match_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('goods_receipt_id')->nullable()->constrained('goods_receipts')->nullOnDelete();
            $table->string('vendor_bill_reference')->nullable();
            $table->decimal('po_quantity', 15, 4)->default(0);
            $table->decimal('received_quantity', 15, 4)->default(0);
            $table->decimal('billed_quantity', 15, 4)->default(0);
            $table->decimal('po_amount', 15, 4)->default(0);
            $table->decimal('billed_amount', 15, 4)->default(0);
            $table->string('status')->default('pending');
            $table->text('exception_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_match_records');
        Schema::dropIfExists('purchase_price_history');
        Schema::dropIfExists('purchase_return_items');
        Schema::dropIfExists('purchase_returns');
        Schema::dropIfExists('goods_receipt_items');
        Schema::dropIfExists('goods_receipts');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('purchase_requisition_items');
        Schema::dropIfExists('purchase_requisitions');
        Schema::dropIfExists('supplier_product_prices');
        Schema::dropIfExists('supplier_products');
    }
};
