<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_deal_stage_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('deal_id')->index();
            $table->string('from_stage')->nullable();
            $table->string('to_stage');
            $table->unsignedInteger('from_probability')->nullable();
            $table->unsignedInteger('to_probability')->nullable();
            $table->unsignedBigInteger('moved_by')->nullable()->index();
            $table->text('note')->nullable();
            $table->timestamps();

            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('moved_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_deal_stage_history');
    }
};