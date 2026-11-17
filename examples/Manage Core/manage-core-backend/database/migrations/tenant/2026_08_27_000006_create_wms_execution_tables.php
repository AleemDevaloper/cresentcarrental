<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('time_zone')->nullable();
            $table->json('wms_settings')->nullable();
            $table->boolean('wms_enabled')->default(false);
        });

        Schema::create('warehouse_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->string('type')->default('storage');
            $table->decimal('capacity', 18, 4)->nullable();
            $table->string('temperature_range')->nullable();
            $table->unsignedInteger('priority')->default(100);
            $table->string('status')->default('active');
            $table->json('rules')->nullable();
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('warehouse_aisles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('warehouse_zones')->nullOnDelete();
            $table->string('code');
            $table->string('name')->nullable();
            $table->string('direction')->default('two_way');
            $table->unsignedInteger('sequence')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('warehouse_racks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('warehouse_zones')->nullOnDelete();
            $table->foreignId('aisle_id')->nullable()->constrained('warehouse_aisles')->nullOnDelete();
            $table->string('code');
            $table->decimal('height', 12, 3)->nullable();
            $table->decimal('width', 12, 3)->nullable();
            $table->decimal('depth', 12, 3)->nullable();
            $table->decimal('maximum_weight', 18, 4)->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('warehouse_shelves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rack_id')->constrained('warehouse_racks')->cascadeOnDelete();
            $table->string('code');
            $table->unsignedInteger('level')->default(1);
            $table->decimal('maximum_weight', 18, 4)->nullable();
            $table->json('dimensions')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unique(['rack_id', 'code']);
        });

        Schema::create('warehouse_bins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('warehouse_zones')->nullOnDelete();
            $table->foreignId('aisle_id')->nullable()->constrained('warehouse_aisles')->nullOnDelete();
            $table->foreignId('rack_id')->nullable()->constrained('warehouse_racks')->nullOnDelete();
            $table->foreignId('shelf_id')->nullable()->constrained('warehouse_shelves')->nullOnDelete();
            $table->string('code');
            $table->string('barcode')->nullable();
            $table->string('type')->default('picking');
            $table->decimal('unit_capacity', 18, 4)->nullable();
            $table->decimal('weight_capacity', 18, 4)->nullable();
            $table->decimal('volume_capacity', 18, 4)->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
            $table->index(['barcode', 'status']);
        });

        Schema::create('warehouse_docks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->string('code');
            $table->string('type')->default('mixed');
            $table->decimal('capacity', 18, 4)->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('wms_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_number')->unique();
            $table->string('type');
            $table->unsignedBigInteger('warehouse_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('source_location_id')->nullable();
            $table->unsignedBigInteger('destination_location_id')->nullable();
            $table->decimal('quantity', 18, 4)->default(0);
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->unsignedBigInteger('serial_id')->nullable();
            $table->unsignedBigInteger('assigned_worker_id')->nullable();
            $table->string('priority')->default('normal');
            $table->string('status')->default('pending');
            $table->string('exception_code')->nullable();
            $table->text('exception_notes')->nullable();
            $table->json('source_document')->nullable();
            $table->timestamps();
            $table->index(['warehouse_id', 'type', 'status']);
            $table->index(['product_id', 'status']);
        });

        Schema::create('wms_waves', function (Blueprint $table) {
            $table->id();
            $table->string('wave_number')->unique();
            $table->unsignedBigInteger('warehouse_id');
            $table->string('type')->default('single_order');
            $table->string('status')->default('draft');
            $table->unsignedInteger('order_count')->default(0);
            $table->timestamp('released_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['warehouse_id', 'status']);
        });

        Schema::create('wms_replenishment_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('warehouse_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('source_bin_id')->nullable();
            $table->unsignedBigInteger('destination_bin_id')->nullable();
            $table->decimal('minimum_quantity', 18, 4)->default(0);
            $table->decimal('replenishment_quantity', 18, 4)->default(0);
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            $table->unique(['warehouse_id', 'product_id', 'destination_bin_id']);
        });

        Schema::create('wms_exceptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('warehouse_id');
            $table->foreignId('task_id')->nullable()->constrained('wms_tasks')->nullOnDelete();
            $table->string('code');
            $table->text('description');
            $table->string('status')->default('open');
            $table->unsignedBigInteger('reported_by')->nullable();
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['warehouse_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wms_exceptions');
        Schema::dropIfExists('wms_replenishment_rules');
        Schema::dropIfExists('wms_waves');
        Schema::dropIfExists('wms_tasks');
        Schema::dropIfExists('warehouse_docks');
        Schema::dropIfExists('warehouse_bins');
        Schema::dropIfExists('warehouse_shelves');
        Schema::dropIfExists('warehouse_racks');
        Schema::dropIfExists('warehouse_aisles');
        Schema::dropIfExists('warehouse_zones');
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropColumn([
                'country', 'city', 'time_zone', 'wms_settings', 'wms_enabled',
            ]);
        });
    }
};
