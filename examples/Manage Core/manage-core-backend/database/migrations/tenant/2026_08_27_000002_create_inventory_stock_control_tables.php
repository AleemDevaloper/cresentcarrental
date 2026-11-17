<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->string('code')->nullable()->unique()->after('id');
            $table->string('branch')->nullable()->after('name');
            $table->string('warehouse_type')->default('main')->after('branch');
            $table->string('address')->nullable()->after('location');
            $table->string('contact')->nullable()->after('address');
            $table->string('phone')->nullable()->after('contact');
            $table->string('email')->nullable()->after('phone');
            $table->string('status')->default('active')->after('email');
            $table->json('operating_hours')->nullable()->after('status');
            $table->text('description')->nullable()->after('operating_hours');
        });

        Schema::table('warehouse_locations', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->decimal('capacity_quantity', 15, 4)->nullable()->after('location_type');
            $table->decimal('capacity_weight', 15, 4)->nullable()->after('capacity_quantity');
            $table->decimal('capacity_volume', 15, 4)->nullable()->after('capacity_weight');
        });

        Schema::table('stock_ledger_entries', function (Blueprint $table) {
            $table->string('transaction_id')->nullable()->after('id')->index();
            $table->decimal('quantity_in', 15, 4)->default(0)->after('quantity');
            $table->decimal('quantity_out', 15, 4)->default(0)->after('quantity_in');
            $table->decimal('net_quantity', 15, 4)->default(0)->after('quantity_out');
            $table->decimal('total_cost', 15, 4)->default(0)->after('unit_cost');
            $table->decimal('running_balance', 15, 4)->default(0)->after('total_cost');
            $table->string('source_module')->nullable()->after('source_type');
            $table->string('status')->default('posted')->after('source_id');
        });

        Schema::create('inventory_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->decimal('on_hand', 15, 4)->default(0);
            $table->decimal('reserved', 15, 4)->default(0);
            $table->decimal('average_cost', 15, 4)->default(0);
            $table->dateTime('last_movement_at')->nullable();
            $table->timestamps();
            $table->unique(['product_id', 'product_variant_id', 'warehouse_id', 'location_id'], 'inventory_stock_dimension_unique');
            $table->index(['warehouse_id', 'product_id']);
        });

        Schema::create('inventory_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_no')->unique();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->decimal('quantity', 15, 4);
            $table->string('source_type')->nullable();
            $table->string('source_id')->nullable();
            $table->string('status')->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['product_id', 'warehouse_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_reservations');
        Schema::dropIfExists('inventory_stocks');
        Schema::table('stock_ledger_entries', function (Blueprint $table) {
            foreach (['transaction_id', 'quantity_in', 'quantity_out', 'net_quantity', 'total_cost', 'running_balance', 'source_module', 'status'] as $column) {
                $table->dropColumn($column);
            }
        });
        Schema::table('warehouse_locations', function (Blueprint $table) {
            foreach (['description', 'capacity_quantity', 'capacity_weight', 'capacity_volume'] as $column) {
                $table->dropColumn($column);
            }
        });
        Schema::table('warehouses', function (Blueprint $table) {
            foreach (['code', 'branch', 'warehouse_type', 'address', 'contact', 'phone', 'email', 'status', 'operating_hours', 'description'] as $column) {
                $table->dropColumn($column);
            }
        });
    }
};
