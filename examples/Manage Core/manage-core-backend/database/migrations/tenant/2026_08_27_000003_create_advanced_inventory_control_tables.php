<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number');
            $table->string('manufacturer_batch_number')->nullable();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->date('manufacturing_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->date('received_date')->nullable();
            $table->decimal('original_quantity', 15, 4)->default(0);
            $table->decimal('on_hand_quantity', 15, 4)->default(0);
            $table->decimal('issued_quantity', 15, 4)->default(0);
            $table->decimal('reserved_quantity', 15, 4)->default(0);
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->unsignedBigInteger('supplier_id')->nullable()->index();
            $table->string('status')->default('active')->index();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['batch_number', 'product_id', 'warehouse_id'], 'inventory_batch_scope_unique');
            $table->index(['product_id', 'warehouse_id', 'expiry_date']);
        });

        Schema::create('inventory_serial_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('serial_number')->unique();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->string('status')->default('available')->index();
            $table->string('purchase_reference')->nullable();
            $table->string('receipt_reference')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('warranty_start')->nullable();
            $table->date('warranty_end')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('current_owner')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'warehouse_id', 'status']);
        });

        Schema::create('inventory_serial_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serial_id')->constrained('inventory_serial_numbers')->cascadeOnDelete();
            $table->string('movement_type');
            $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->foreignId('from_location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->foreignId('to_location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->string('source_type')->nullable();
            $table->string('source_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['serial_id', 'created_at']);
        });

        Schema::table('inventory_stocks', function (Blueprint $table) {
            $table->dropUnique('inventory_stock_dimension_unique');
            $table->foreignId('batch_id')->nullable()->after('location_id')->constrained('inventory_batches')->nullOnDelete();
            $table->foreignId('serial_id')->nullable()->after('batch_id')->constrained('inventory_serial_numbers')->nullOnDelete();
            $table->unique(['product_id', 'product_variant_id', 'warehouse_id', 'location_id', 'batch_id', 'serial_id'], 'inventory_stock_advanced_dimension_unique');
        });

        Schema::table('stock_ledger_entries', function (Blueprint $table) {
            $table->foreignId('batch_id')->nullable()->after('location_id')->constrained('inventory_batches')->nullOnDelete();
            $table->foreignId('serial_id')->nullable()->after('batch_id')->constrained('inventory_serial_numbers')->nullOnDelete();
            $table->index(['batch_id', 'serial_id']);
        });

        Schema::create('inventory_cost_layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->string('source_type')->nullable();
            $table->string('source_id')->nullable();
            $table->dateTime('received_at');
            $table->decimal('original_quantity', 15, 4);
            $table->decimal('remaining_quantity', 15, 4);
            $table->decimal('unit_cost', 15, 4);
            $table->string('status')->default('open')->index();
            $table->timestamps();
            $table->index(['product_id', 'warehouse_id', 'received_at']);
        });

        Schema::create('inventory_stock_counts', function (Blueprint $table) {
            $table->id();
            $table->string('count_number')->unique();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->string('count_type')->default('full');
            $table->date('scheduled_date')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->string('status')->default('draft')->index();
            $table->boolean('blind_count')->default(false);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('approved_at')->nullable();
            $table->dateTime('reconciled_at')->nullable();
            $table->timestamps();
            $table->index(['warehouse_id', 'status']);
        });

        Schema::create('inventory_stock_count_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_count_id')->constrained('inventory_stock_counts')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->foreignId('serial_id')->nullable()->constrained('inventory_serial_numbers')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->decimal('system_quantity', 15, 4)->default(0);
            $table->decimal('counted_quantity', 15, 4)->nullable();
            $table->decimal('difference', 15, 4)->nullable();
            $table->string('unit')->nullable();
            $table->string('reason')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('counted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('counted_at')->nullable();
            $table->timestamps();
            $table->index(['stock_count_id', 'product_id']);
        });

        Schema::create('inventory_reorder_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->cascadeOnDelete();
            $table->decimal('minimum_stock', 15, 4)->default(0);
            $table->decimal('maximum_stock', 15, 4)->nullable();
            $table->decimal('reorder_point', 15, 4)->default(0);
            $table->decimal('reorder_quantity', 15, 4)->default(0);
            $table->decimal('safety_stock', 15, 4)->default(0);
            $table->unsignedInteger('lead_time_days')->nullable();
            $table->decimal('supplier_pack_multiple', 15, 4)->nullable();
            $table->unsignedBigInteger('preferred_supplier_id')->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['product_id', 'warehouse_id', 'is_active']);
        });

        Schema::create('inventory_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('alert_type')->index();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->string('severity')->default('information')->index();
            $table->string('title');
            $table->text('message');
            $table->json('context')->nullable();
            $table->string('status')->default('open')->index();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['alert_type', 'status', 'warehouse_id']);
        });

        Schema::create('inventory_classifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->cascadeOnDelete();
            $table->string('classification')->index();
            $table->decimal('movement_quantity', 15, 4)->default(0);
            $table->unsignedInteger('movement_count')->default(0);
            $table->unsignedInteger('days_since_movement')->nullable();
            $table->dateTime('calculated_at');
            $table->timestamps();
            $table->unique(['product_id', 'warehouse_id', 'classification'], 'inventory_classification_scope_unique');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_stocks', function (Blueprint $table) {
            $table->dropUnique('inventory_stock_advanced_dimension_unique');
            $table->dropConstrainedForeignId('serial_id');
            $table->dropConstrainedForeignId('batch_id');
            $table->unique(['product_id', 'product_variant_id', 'warehouse_id', 'location_id'], 'inventory_stock_dimension_unique');
        });
        Schema::table('stock_ledger_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('serial_id');
            $table->dropConstrainedForeignId('batch_id');
        });
        Schema::dropIfExists('inventory_classifications');
        Schema::dropIfExists('inventory_alerts');
        Schema::dropIfExists('inventory_reorder_rules');
        Schema::dropIfExists('inventory_stock_count_items');
        Schema::dropIfExists('inventory_stock_counts');
        Schema::dropIfExists('inventory_cost_layers');
        Schema::dropIfExists('inventory_serial_movements');
        Schema::dropIfExists('inventory_serial_numbers');
        Schema::dropIfExists('inventory_batches');
    }
};
