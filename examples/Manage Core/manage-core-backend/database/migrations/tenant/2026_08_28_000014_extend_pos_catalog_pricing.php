<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_product_catalog', function (Blueprint $table) {
            $table->string('product_code')->nullable()->unique();
            $table->string('brand')->nullable();
            $table->string('product_type')->default('standard');
            $table->string('unit')->default('unit');
            $table->string('tax_profile')->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->json('attributes')->nullable();
            $table->json('variant_options')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->boolean('is_quick_sale')->default(false);
            $table->boolean('allow_negative_stock')->default(false);
            $table->decimal('low_stock_threshold', 18, 4)->nullable();
        });

        Schema::create('pos_product_barcodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_product_id')->constrained('pos_product_catalog')->cascadeOnDelete();
            $table->string('barcode')->unique();
            $table->string('type')->default('primary');
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->index(['catalog_product_id', 'active']);
        });

        Schema::create('pos_price_lists', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('store')->nullable();
            $table->string('customer_group')->nullable();
            $table->string('currency', 3)->default('PKR');
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('pos_product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_list_id')->constrained('pos_price_lists')->cascadeOnDelete();
            $table->foreignId('catalog_product_id')->constrained('pos_product_catalog')->cascadeOnDelete();
            $table->decimal('price', 18, 4);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
            $table->index(['catalog_product_id', 'starts_at', 'ends_at']);
        });

        Schema::create('pos_discount_rules', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->default('percentage');
            $table->decimal('value', 18, 4);
            $table->decimal('minimum_quantity', 18, 4)->nullable();
            $table->decimal('minimum_amount', 18, 2)->nullable();
            $table->foreignId('catalog_product_id')->nullable()->constrained('pos_product_catalog')->nullOnDelete();
            $table->integer('priority')->default(100);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->index(['status', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_discount_rules');
        Schema::dropIfExists('pos_product_prices');
        Schema::dropIfExists('pos_price_lists');
        Schema::dropIfExists('pos_product_barcodes');
        Schema::table('pos_product_catalog', function (Blueprint $table) {
            $table->dropUnique(['product_code']);
            $table->dropColumn([
                'product_code', 'brand', 'product_type', 'unit', 'tax_profile', 'description',
                'images', 'attributes', 'variant_options', 'is_favorite', 'is_quick_sale',
                'allow_negative_stock', 'low_stock_threshold',
            ]);
        });
    }
};
