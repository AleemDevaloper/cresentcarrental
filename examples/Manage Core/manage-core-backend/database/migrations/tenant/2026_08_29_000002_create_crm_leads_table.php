<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_leads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->unique();
            $table->string('name')->index();
            $table->string('company')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('title')->nullable();
            $table->string('source')->nullable();
            $table->string('status')->default('new')->index();
            $table->string('rating')->nullable();
            $table->unsignedInteger('score')->default(0);
            $table->string('industry')->nullable()->index();
            $table->decimal('estimated_value', 15, 2)->nullable();
            $table->string('currency', 10)->nullable();
            $table->date('expected_close_date')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('campaign_id')->nullable()->index();
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->timestamp('converted_at')->nullable();
            $table->text('lost_reason')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('campaign_id')->references('id')->on('crm_campaigns')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_leads');
    }
};
