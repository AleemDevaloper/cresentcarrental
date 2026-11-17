<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_activities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('type')->index();
            $table->string('subject')->index();
            $table->text('description')->nullable();
            $table->string('status')->default('planned')->index();
            $table->string('priority')->default('medium')->index();
            $table->timestamp('due_date')->nullable()->index();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->text('outcome')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('deal_id')->nullable()->index();
            $table->unsignedBigInteger('contact_id')->nullable()->index();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->string('location')->nullable();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('contact_id')->references('id')->on('crm_contacts')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_activities');
    }
};
