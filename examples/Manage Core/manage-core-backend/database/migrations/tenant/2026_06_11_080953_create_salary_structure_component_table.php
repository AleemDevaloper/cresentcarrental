<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_structure_component', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salary_structure_id')->constrained()->onDelete('cascade');
            $table->foreignId('salary_component_id')->constrained()->onDelete('cascade');
            $table->decimal('override_value', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_structure_component');
    }
};
