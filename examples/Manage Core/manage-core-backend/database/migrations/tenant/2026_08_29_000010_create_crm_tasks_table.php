<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->index();
            $table->text('description')->nullable();
            $table->string('status')->default('todo')->index();
            $table->string('priority')->default('medium')->index();
            $table->timestamp('due_date')->nullable()->index();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('deal_id')->nullable()->index();
            $table->timestamp('reminder_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_tasks');
    }
};
