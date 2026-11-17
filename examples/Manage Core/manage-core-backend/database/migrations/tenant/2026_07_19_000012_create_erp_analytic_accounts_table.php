<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytic_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('account_type')->nullable();
            $table->decimal('budget_assigned', 15, 2)->default(0);
            $table->string('linked_project')->nullable();
            $table->string('customer')->nullable();
            $table->string('contract_id')->nullable();
            $table->string('gl_revenue_account')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytic_accounts');
    }
};
