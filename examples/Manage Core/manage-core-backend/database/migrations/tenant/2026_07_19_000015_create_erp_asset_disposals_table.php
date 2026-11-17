<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_disposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->nullable()->constrained('assets')->onDelete('set null');
            $table->string('asset_name')->nullable();
            $table->enum('disposal_type', ['sale', 'scrap', 'transfer'])->default('sale');
            $table->decimal('book_value', 15, 2)->default(0);
            $table->decimal('accum_depreciation', 15, 2)->default(0);
            $table->decimal('sale_price', 15, 2)->default(0);
            $table->decimal('scrap_value', 15, 2)->default(0);
            $table->string('recipient')->nullable();
            $table->text('reason')->nullable();
            $table->date('disposal_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_disposals');
    }
};
