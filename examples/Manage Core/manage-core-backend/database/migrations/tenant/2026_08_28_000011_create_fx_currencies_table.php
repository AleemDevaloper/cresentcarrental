<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('fx_currencies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('symbol', 10)->nullable();
            $table->boolean('is_base_currency')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('decimal_places')->default(2);
            $table->timestamps();

            $table->index('is_active');
            $table->index('is_base_currency');
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('fx_currencies');
    }
};
