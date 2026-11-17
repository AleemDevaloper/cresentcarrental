<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_tenant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('active'); // active, suspended, trial, expired
            $table->string('license_type')->default('starter'); // trial, starter, professional, enterprise, custom
            $table->string('license_key')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_tenant');
    }
};
