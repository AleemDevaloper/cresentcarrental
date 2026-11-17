<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fx_revaluations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->nullable();
            $table->date('valuation_date')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('total_gain', 20, 2)->default(0);
            $table->decimal('total_loss', 20, 2)->default(0);
            $table->string('status')->default('Pending');
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fx_revaluations');
    }
};
