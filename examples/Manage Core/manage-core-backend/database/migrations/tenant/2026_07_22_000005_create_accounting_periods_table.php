<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('periods', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('fiscal_year_id')->index();
            $table->string('name')->index();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_open')->default(true);
            $table->boolean('is_draft')->default(false);
            $table->timestamps();

            try { $table->foreign('fiscal_year_id')->references('id')->on('fiscal_years')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('periods');
    }
};
