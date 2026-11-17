<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_custom_fields', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entity_type')->index();
            $table->string('name')->index();
            $table->string('label');
            $table->string('type');
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->unique(['entity_type', 'name'], 'crm_cf_entity_name_unique');
        });

        Schema::connection('tenant')->create('crm_custom_field_values', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('custom_field_id')->index();
            $table->string('entity_type')->index();
            $table->unsignedBigInteger('entity_id')->index();
            $table->text('value')->nullable();
            $table->timestamps();

            $table->unique(['custom_field_id', 'entity_type', 'entity_id'], 'crm_cfv_unique');
            try { $table->foreign('custom_field_id')->references('id')->on('crm_custom_fields')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_custom_field_values');
        Schema::connection('tenant')->dropIfExists('crm_custom_fields');
    }
};