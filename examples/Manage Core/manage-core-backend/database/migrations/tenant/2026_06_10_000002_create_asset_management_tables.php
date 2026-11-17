<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('asset_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('asset_code')->unique();
            $table->string('location')->nullable();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 15, 2)->nullable();
            $table->decimal('current_value', 15, 2)->nullable();
            $table->date('warranty_expiry')->nullable();
            $table->enum('status', ['active', 'maintenance', 'retired', 'stolen', 'lost'])->default('active');
            $table->timestamps();
        });

        Schema::create('asset_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->date('maintenance_date');
            $table->decimal('cost', 15, 2)->nullable();
            $table->text('description')->nullable();
            $table->string('performed_by')->nullable();
            $table->timestamps();
        });

        Schema::create('asset_depreciations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->date('entry_date');
            $table->decimal('remaining_value', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_depreciations');
        Schema::dropIfExists('asset_maintenances');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_categories');
    }
};
