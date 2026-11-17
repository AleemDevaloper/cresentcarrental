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
        // Tax Slabs
        Schema::create('hrms_tax_slabs', function (Blueprint $table) {
            $table->id();
            $table->decimal('income_from', 15, 2);
            $table->decimal('income_to', 15, 2)->nullable();
            $table->decimal('fixed_tax', 15, 2)->default(0);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Payroll Batches
        Schema::create('hrms_payroll_batches', function (Blueprint $table) {
            $table->id();
            $table->integer('month');
            $table->integer('year');
            $table->enum('status', ['draft', 'processing', 'verified', 'locked', 'paid'])->default('draft');
            $table->decimal('total_gross', 15, 2)->default(0);
            $table->decimal('total_deduction', 15, 2)->default(0);
            $table->decimal('total_net', 15, 2)->default(0);
            $table->integer('employee_count')->default(0);
            $table->foreignId('processed_by')->constrained('users');
            $table->timestamps();
        });

        // Add batch_id to payslips
        Schema::table('payslips', function (Blueprint $table) {
            $table->foreignId('batch_id')->nullable()->after('id')->constrained('hrms_payroll_batches')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->dropForeign(['batch_id']);
            $table->dropColumn('batch_id');
        });
        Schema::dropIfExists('hrms_payroll_batches');
        Schema::dropIfExists('hrms_tax_slabs');
    }
};
