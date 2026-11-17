<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('manufacturer')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->after('category_id')->constrained('brands')->nullOnDelete();
            $table->string('product_type')->default('stockable')->after('material_type');
            $table->string('alternate_barcode')->nullable()->after('ean');
            $table->string('default_unit')->nullable()->after('product_type');
            $table->decimal('wholesale_price', 15, 2)->default(0)->after('sales_price');
            $table->decimal('retail_price', 15, 2)->default(0)->after('wholesale_price');
            $table->decimal('minimum_price', 15, 2)->default(0)->after('retail_price');
            $table->decimal('maximum_price', 15, 2)->default(0)->after('minimum_price');
            $table->boolean('track_inventory')->default(true)->after('maximum_price');
            $table->boolean('track_batch')->default(false)->after('track_inventory');
            $table->boolean('track_serial')->default(false)->after('track_batch');
            $table->boolean('track_expiry')->default(false)->after('track_serial');
            $table->decimal('safety_stock', 15, 2)->default(0)->after('reorder_point');
            $table->decimal('reorder_quantity', 15, 2)->default(0)->after('safety_stock');
            $table->json('tags')->nullable()->after('abc_class');
            $table->index(['status', 'category_id']);
            $table->index(['sku', 'ean']);
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->index();
            $table->json('attributes')->nullable();
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('weight', 12, 4)->nullable();
            $table->json('dimensions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['product_id', 'is_active']);
        });

        Schema::create('warehouse_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->string('code');
            $table->string('name');
            $table->string('location_type')->default('bin');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('stock_ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->index();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations')->nullOnDelete();
            $table->string('movement_type');
            $table->decimal('quantity', 15, 4);
            $table->string('unit')->nullable();
            $table->string('batch_no')->nullable()->index();
            $table->string('serial_no')->nullable()->index();
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->dateTime('movement_date');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('source_type')->nullable();
            $table->string('source_id')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'warehouse_id', 'movement_date']);
            $table->unique(['reference_no', 'product_id', 'product_variant_id', 'movement_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_ledger_entries');
        Schema::dropIfExists('warehouse_locations');
        Schema::dropIfExists('product_variants');
        Schema::table('products', function (Blueprint $table) {
            $columns = [
                'brand_id', 'product_type', 'alternate_barcode', 'default_unit',
                'wholesale_price', 'retail_price', 'minimum_price', 'maximum_price',
                'track_inventory', 'track_batch', 'track_serial', 'track_expiry',
                'safety_stock', 'reorder_quantity', 'tags',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('products', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
        Schema::dropIfExists('brands');
    }
};
