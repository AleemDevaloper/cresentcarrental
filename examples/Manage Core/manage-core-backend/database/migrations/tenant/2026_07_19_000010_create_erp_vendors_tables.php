<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('vendor_code')->unique();
            $table->string('name');
            $table->string('legal_name')->nullable();
            $table->string('vendor_type')->nullable();
            $table->string('tax_no')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('website')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('credit_terms')->nullable();
            $table->integer('credit_days')->nullable();
            $table->decimal('credit_limit', 15, 2)->nullable();
            $table->string('currency')->nullable();
            $table->string('gl_expense_account')->nullable();
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('vendor_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_id')->unique();
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->date('payment_date');
            $table->string('method')->nullable();
            $table->string('reference')->nullable();
            $table->enum('status', ['pending', 'processed', 'reversed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_payments');
        Schema::dropIfExists('vendors');
    }
};
