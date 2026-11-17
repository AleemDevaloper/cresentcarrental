<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('currencies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('symbol', 10);
            $table->boolean('is_base')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedTinyInteger('decimal_places')->default(2);
            $table->decimal('exchange_rate', 15, 8)->default(1.00000000);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('currencies');
    }
};
