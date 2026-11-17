<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('fx_exchange_rates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from_currency_id');
            $table->unsignedBigInteger('to_currency_id');
            $table->decimal('rate', 20, 8);
            $table->enum('source', ['manual', 'api', 'bank'])->default('manual');
            $table->date('effective_date');
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index('from_currency_id');
            $table->index('to_currency_id');
            $table->index('effective_date');
            $table->index('is_active');
            $table->index(['from_currency_id', 'to_currency_id', 'is_active']);
            $table->foreign('from_currency_id')->references('id')->on('fx_currencies')->onDelete('cascade');
            $table->foreign('to_currency_id')->references('id')->on('fx_currencies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('fx_exchange_rates');
    }
};
