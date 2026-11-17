<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_pipeline_stages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pipeline_id')->index();
            $table->string('name')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('probability')->default(0);
            $table->string('color', 20)->nullable();
            $table->boolean('is_won')->default(false);
            $table->boolean('is_lost')->default(false);
            $table->timestamps();

            try { $table->foreign('pipeline_id')->references('id')->on('crm_pipelines')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_pipeline_stages');
    }
};
