<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_notes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('content');
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('deal_id')->nullable()->index();
            $table->unsignedBigInteger('contact_id')->nullable()->index();
            $table->unsignedBigInteger('activity_id')->nullable()->index();
            $table->boolean('is_pinned')->default(false);
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('contact_id')->references('id')->on('crm_contacts')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('activity_id')->references('id')->on('crm_activities')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_notes');
    }
};
