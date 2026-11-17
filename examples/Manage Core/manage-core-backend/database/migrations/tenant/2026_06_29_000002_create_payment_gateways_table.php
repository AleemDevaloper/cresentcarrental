<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('status')->default('Active');
            $table->string('volume')->default('$0');
            $table->string('fee')->default('0%');
            $table->string('uptime')->nullable();
            $table->string('color')->default('#635bff');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
