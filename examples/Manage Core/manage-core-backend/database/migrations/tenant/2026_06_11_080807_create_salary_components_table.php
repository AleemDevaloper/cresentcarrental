<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['earning', 'deduction']);
            $table->boolean('is_fixed')->default(true);
            $table->enum('calculation_type', ['flat', 'percentage'])->nullable();
            $table->foreignId('percentage_of')->nullable()->constrained('salary_components')->onDelete('set null');
            $table->decimal('value', 15, 2)->default(0); // flat amount or percentage
            $table->boolean('is_taxable')->default(true);
            $table->boolean('is_statutory')->default(false); // EOBI, Social Security, etc.
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_components');
    }
};
