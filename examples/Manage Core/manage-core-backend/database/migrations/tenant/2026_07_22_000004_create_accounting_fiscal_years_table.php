<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('fiscal_years', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('Open');
            $table->boolean('is_draft')->default(false);
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('fiscal_years');
    }
};
