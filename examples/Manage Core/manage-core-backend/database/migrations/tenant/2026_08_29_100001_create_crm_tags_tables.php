<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_tags', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('slug')->unique();
            $table->string('color', 20)->default('#6366f1');
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();

            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_taggables', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('tag_id')->index();
            $table->string('taggable_type')->index();
            $table->unsignedBigInteger('taggable_id')->index();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->unique(['tag_id', 'taggable_type', 'taggable_id'], 'crm_taggables_unique');
            try { $table->foreign('tag_id')->references('id')->on('crm_tags')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_taggables');
        Schema::connection('tenant')->dropIfExists('crm_tags');
    }
};