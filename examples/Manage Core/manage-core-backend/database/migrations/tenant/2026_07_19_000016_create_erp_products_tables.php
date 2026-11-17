<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->enum('default_valuation', ['fifo', 'lifo', 'weighted_avg', 'standard'])->default('fifo');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->string('ean')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->string('material_type')->nullable();
            $table->decimal('purchase_cost', 15, 2)->default(0);
            $table->decimal('sales_price', 15, 2)->default(0);
            $table->integer('initial_stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->integer('max_stock')->default(0);
            $table->integer('reorder_point')->default(0);
            $table->string('warehouse')->nullable();
            $table->string('bin_location')->nullable();
            $table->string('costing_method')->nullable();
            $table->string('abc_class')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('uoms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('symbol')->nullable();
            $table->enum('category', ['weight', 'volume', 'length', 'quantity', 'time', 'area'])->default('quantity');
            $table->boolean('is_base')->default(false);
            $table->decimal('conversion_multiplier', 10, 4)->default(1);
            $table->string('base_unit')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uoms');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_categories');
    }
};
