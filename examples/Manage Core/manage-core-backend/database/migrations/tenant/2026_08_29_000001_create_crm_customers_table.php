<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_customers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->unique();
            $table->string('name')->index();
            $table->string('company')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('industry')->nullable()->index();
            $table->string('size')->nullable();
            $table->string('type')->default('prospect')->index();
            $table->string('status')->default('active')->index();
            $table->unsignedTinyInteger('rating')->nullable();
            $table->decimal('annual_revenue', 15, 2)->nullable();
            $table->unsignedInteger('employee_count')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->string('source')->nullable();
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_customers');
    }
};
