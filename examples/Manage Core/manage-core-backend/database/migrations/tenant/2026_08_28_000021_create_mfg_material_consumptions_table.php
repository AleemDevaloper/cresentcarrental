<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mfg_material_consumptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_order_id')->constrained('mfg_work_orders')->cascadeOnDelete();
            $table->string('item_name');
            $table->decimal('planned_quantity', 15, 4)->default(0);
            $table->decimal('actual_quantity', 15, 4)->default(0);
            $table->string('unit')->default('pcs');
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->decimal('variance', 15, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['work_order_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mfg_material_consumptions');
    }
};
