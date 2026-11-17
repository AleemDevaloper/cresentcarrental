<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained('investment_portfolios')->onDelete('cascade');
            $table->string('name');
            $table->string('category'); // e.g., Stocks, Bonds, Real Estate
            $table->decimal('principal_amount', 15, 2);
            $table->decimal('current_value', 15, 2);
            $table->date('investment_date');
            $table->enum('status', ['active', 'liquidated', 'matured'])->default('active');
            $table->timestamps();
        });

        Schema::create('investment_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investment_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->date('entry_date');
            $table->string('type'); // e.g., Dividend, Interest, Capital Gain
            $table->timestamps();
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->string('lender_name')->nullable()->after('user_id');
            $table->string('loan_type')->nullable()->after('lender_name'); // e.g., Corporate, Employee
            $table->decimal('interest_rate', 5, 2)->default(0)->after('amount');
            $table->date('start_date')->nullable()->after('repayment_months');
            $table->decimal('emi_amount', 15, 2)->nullable()->after('start_date');
            $table->decimal('outstanding_balance', 15, 2)->nullable()->after('emi_amount');
        });

        Schema::create('emi_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->integer('emi_number');
            $table->date('due_date');
            $table->decimal('principal_component', 15, 2);
            $table->decimal('interest_component', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->date('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emi_schedules');
        
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['lender_name', 'loan_type', 'interest_rate', 'start_date', 'emi_amount', 'outstanding_balance']);
        });

        Schema::dropIfExists('investment_returns');
        Schema::dropIfExists('investments');
        Schema::dropIfExists('investment_portfolios');
    }
};
