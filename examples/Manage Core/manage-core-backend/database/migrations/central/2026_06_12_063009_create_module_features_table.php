<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code');
            $table->text('description')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->unique(['module_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_features');
    }
};
