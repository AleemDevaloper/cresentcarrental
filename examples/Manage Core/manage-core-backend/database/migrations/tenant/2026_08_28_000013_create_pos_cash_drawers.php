<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_cash_drawers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->foreignId('terminal_id')->nullable()->unique()->constrained('pos_terminals')->nullOnDelete();
            $table->foreignId('register_id')->nullable()->constrained('pos_registers')->nullOnDelete();
            $table->string('currency', 3)->default('PKR');
            $table->string('status')->default('active');
            $table->decimal('safe_drop_threshold', 18, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_cash_drawers');
    }
};
