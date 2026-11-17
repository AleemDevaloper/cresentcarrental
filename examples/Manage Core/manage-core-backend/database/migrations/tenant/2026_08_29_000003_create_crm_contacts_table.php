<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_contacts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('customer_id')->index();
            $table->string('first_name')->index();
            $table->string('last_name')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('title')->nullable();
            $table->string('department')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->string('status')->default('active')->index();
            $table->text('notes')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->text('address')->nullable();
            $table->date('birthday')->nullable();
            $table->date('anniversary')->nullable();
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_contacts');
    }
};
