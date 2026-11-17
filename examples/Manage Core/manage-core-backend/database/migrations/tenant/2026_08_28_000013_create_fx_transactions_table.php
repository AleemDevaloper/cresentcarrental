<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('fx_transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('transaction_number')->unique();
            $table->enum('type', ['buy', 'sell', 'transfer']);
            $table->unsignedBigInteger('from_currency_id');
            $table->unsignedBigInteger('to_currency_id');
            $table->decimal('amount', 20, 4);
            $table->decimal('exchange_rate', 20, 8);
            $table->decimal('converted_amount', 20, 4);
            $table->string('account_reference')->nullable();
            $table->string('counterparty')->nullable();
            $table->date('value_date');
            $table->date('settlement_date')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('type');
            $table->index('status');
            $table->index('value_date');
            $table->index('from_currency_id');
            $table->index('to_currency_id');
            $table->index('created_by');
            $table->foreign('from_currency_id')->references('id')->on('fx_currencies')->onDelete('cascade');
            $table->foreign('to_currency_id')->references('id')->on('fx_currencies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('fx_transactions');
    }
};
