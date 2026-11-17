<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_campaigns', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('type')->index();
            $table->string('status')->default('draft')->index();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 15, 2)->default(0);
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->decimal('expected_revenue', 15, 2)->default(0);
            $table->decimal('actual_revenue', 15, 2)->default(0);
            $table->text('target_audience')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_campaigns');
    }
};
