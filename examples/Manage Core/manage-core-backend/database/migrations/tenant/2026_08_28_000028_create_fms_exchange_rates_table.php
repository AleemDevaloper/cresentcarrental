<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('exchange_rates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from_currency_id')->index();
            $table->unsignedBigInteger('to_currency_id')->index();
            $table->decimal('rate', 15, 8);
            $table->string('source')->nullable();
            $table->date('effective_date');
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();

            try { $table->foreign('from_currency_id')->references('id')->on('currencies')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('to_currency_id')->references('id')->on('currencies')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('exchange_rates');
    }
};
