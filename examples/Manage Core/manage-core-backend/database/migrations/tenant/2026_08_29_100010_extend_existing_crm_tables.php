<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->table('crm_deals', function (Blueprint $table) {
            $columns = [];
            try { $columns = Schema::connection('tenant')->getColumnListing('crm_deals'); } catch (\Exception $e) {}
            if (!in_array('products', $columns)) $table->json('products')->nullable()->after('source');
            if (!in_array('discount', $columns)) $table->decimal('discount', 15, 2)->nullable()->after('products');
            if (!in_array('tax', $columns)) $table->decimal('tax', 15, 2)->nullable()->after('discount');
            if (!in_array('forecast_category', $columns)) $table->string('forecast_category', 30)->nullable()->after('tax');
        });

        Schema::connection('tenant')->table('crm_pipeline_stages', function (Blueprint $table) {
            $columns = [];
            try { $columns = Schema::connection('tenant')->getColumnListing('crm_pipeline_stages'); } catch (\Exception $e) {}
            if (!in_array('description', $columns)) $table->text('description')->nullable()->after('name');
            if (!in_array('required_fields', $columns)) $table->json('required_fields')->nullable()->after('is_lost');
        });

        Schema::connection('tenant')->table('crm_activities', function (Blueprint $table) {
            $columns = [];
            try { $columns = Schema::connection('tenant')->getColumnListing('crm_activities'); } catch (\Exception $e) {}
            if (!in_array('recurrence', $columns)) $table->json('recurrence')->nullable();
            if (!in_array('tags', $columns)) $table->json('tags')->nullable();
        });
    }

    public function down(): void
    {
        // No-op
    }
};