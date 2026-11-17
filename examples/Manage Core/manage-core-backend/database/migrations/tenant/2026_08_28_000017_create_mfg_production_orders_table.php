<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mfg_production_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('product_name');
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->decimal('quantity', 15, 4)->default(0);
            $table->string('unit')->default('pcs');
            $table->enum('status', ['draft', 'in_progress', 'completed', 'cancelled'])->default('draft');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('estimated_cost', 15, 2)->default(0);
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['priority']);
            $table->index(['start_date', 'end_date']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mfg_production_orders');
    }
};
