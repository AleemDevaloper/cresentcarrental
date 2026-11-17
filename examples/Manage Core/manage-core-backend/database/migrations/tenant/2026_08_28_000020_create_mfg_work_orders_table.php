<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mfg_work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('work_order_number')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('mfg_production_orders')->nullOnDelete();
            $table->foreignId('bom_id')->nullable()->constrained('mfg_boms')->nullOnDelete();
            $table->enum('status', ['pending', 'in_progress', 'on_hold', 'completed', 'cancelled'])->default('pending');
            $table->decimal('quantity_to_produce', 15, 4)->default(0);
            $table->decimal('quantity_produced', 15, 4)->default(0);
            $table->decimal('quantity_scrapped', 15, 4)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['production_order_id']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mfg_work_orders');
    }
};
