<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('superadmin_customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('country')->nullable();
            $table->string('avatar')->nullable();
            $table->string('status')->default('Active'); // Active, Inactive, Archived
            $table->string('type')->nullable(); // VIP, Enterprise, SMB, etc.
            $table->string('industry')->nullable();
            $table->integer('health_score')->default(100);
            $table->foreignId('account_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('since')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->timestamps();
            
            // Add index for faster lookups and filtering
            $table->index(['status']);
            $table->index(['email']);
            $table->index(['created_at']);
        });

        Schema::create('superadmin_customer_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('superadmin_customer_id')->constrained('superadmin_customers')->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('designation')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('superadmin_customer_contacts');
        Schema::dropIfExists('superadmin_customers');
    }
};
