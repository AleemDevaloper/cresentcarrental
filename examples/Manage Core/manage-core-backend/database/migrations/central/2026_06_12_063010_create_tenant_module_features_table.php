<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_module_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_feature_id')->constrained()->onDelete('cascade');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->unique(['tenant_id', 'module_feature_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_module_features');
    }
};
