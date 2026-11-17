<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_deals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->unique();
            $table->string('name')->index();
            $table->unsignedBigInteger('customer_id')->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('contact_id')->nullable()->index();
            $table->unsignedBigInteger('pipeline_id')->index();
            $table->string('stage')->default('lead')->index();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('currency', 10)->nullable();
            $table->unsignedInteger('probability')->default(0);
            $table->date('expected_close_date')->nullable();
            $table->date('actual_close_date')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->string('source')->nullable();
            $table->string('status')->default('open')->index();
            $table->string('priority')->default('medium')->index();
            $table->text('description')->nullable();
            $table->text('next_step')->nullable();
            $table->text('lost_reason')->nullable();
            $table->timestamp('won_at')->nullable();
            $table->timestamp('lost_at')->nullable();
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('contact_id')->references('id')->on('crm_contacts')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('pipeline_id')->references('id')->on('crm_pipelines')->onDelete('restrict'); } catch (\Exception $e) {}
            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_deals');
    }
};
