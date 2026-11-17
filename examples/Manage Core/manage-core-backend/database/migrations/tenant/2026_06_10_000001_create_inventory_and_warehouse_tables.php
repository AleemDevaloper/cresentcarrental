<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('category')->nullable();
            $table->string('unit')->default('unit');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->decimal('unit_cost', 15, 2);
            $table->decimal('prev_cost', 15, 2)->nullable();
            $table->decimal('variance', 10, 2)->nullable();
            $table->date('effective_date');
            $table->string('vendor_reference')->nullable();
            $table->timestamps();
        });

        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->decimal('capacity', 15, 2)->nullable();
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('warehouse_finances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['expense', 'revenue']);
            $table->string('category'); // e.g., Rent, Utility, Labor
            $table->decimal('amount', 15, 2);
            $table->date('entry_date');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_finances');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('inventory_costs');
        Schema::dropIfExists('inventory_items');
    }
};
