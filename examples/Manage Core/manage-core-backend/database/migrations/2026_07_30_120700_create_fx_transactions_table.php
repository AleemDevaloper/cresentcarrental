<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fx_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->date('transaction_date')->nullable();
            $table->string('reference_number')->nullable();
            $table->string('company')->nullable();
            $table->string('branch')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('currency')->nullable();
            $table->string('transaction_type')->nullable();
            $table->decimal('exchange_rate', 20, 6)->nullable();
            $table->decimal('original_amount', 20, 2)->nullable();
            $table->decimal('converted_amount', 20, 2)->nullable();
            $table->decimal('bank_charges', 20, 2)->nullable();
            $table->decimal('tax', 20, 2)->nullable();
            $table->text('description')->nullable();
            $table->string('approval_status')->default('Pending');
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fx_transactions');
    }
};
