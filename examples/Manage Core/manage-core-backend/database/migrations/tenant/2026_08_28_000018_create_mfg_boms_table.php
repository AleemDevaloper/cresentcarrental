<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mfg_boms', function (Blueprint $table) {
            $table->id();
            $table->string('bom_code')->unique();
            $table->string('name');
            $table->string('product_name');
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('version')->default('1.0');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('description')->nullable();
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mfg_boms');
    }
};
