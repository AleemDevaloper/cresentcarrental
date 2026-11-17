<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('mysql')->create('integration_api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('api_key');
            $table->json('scopes')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::connection('mysql')->dropIfExists('integration_api_keys');
    }
};
