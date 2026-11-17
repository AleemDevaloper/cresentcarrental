<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('fx_revaluation_lines', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('revaluation_id');
            $table->string('account_reference');
            $table->unsignedBigInteger('currency_id');
            $table->decimal('balance_amount', 20, 4);
            $table->decimal('unrealized_rate', 20, 8);
            $table->decimal('realized_rate', 20, 8)->nullable();
            $table->decimal('gain_amount', 20, 4)->default(0);
            $table->decimal('loss_amount', 20, 4)->default(0);
            $table->text('notes')->nullable();

            $table->index('revaluation_id');
            $table->index('currency_id');
            $table->index('account_reference');
            $table->foreign('revaluation_id')->references('id')->on('fx_revaluations')->onDelete('cascade');
            $table->foreign('currency_id')->references('id')->on('fx_currencies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('fx_revaluation_lines');
    }
};
