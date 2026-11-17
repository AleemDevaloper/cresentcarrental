<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('opening_balances', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('account_id')->index();
            $table->unsignedBigInteger('period_id')->nullable()->index();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('currency')->default('PKR');
            $table->text('note')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->boolean('is_draft')->default(false);
            $table->timestamps();

            try { $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('period_id')->references('id')->on('periods')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('opening_balances');
    }
};
