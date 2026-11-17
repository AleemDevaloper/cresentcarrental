<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_provider_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('provider_type')->default('openrouter');
            $table->string('api_key')->nullable();
            $table->string('base_url')->nullable();
            $table->string('default_model')->nullable();
            $table->json('available_models')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_provider_settings');
    }
};
