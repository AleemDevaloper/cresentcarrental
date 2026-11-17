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
        Schema::create('bank_exports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_batch_id')->nullable()->constrained('hrms_payroll_batches')->nullOnDelete();
            $table->string('bank_name');
            $table->string('export_code')->unique();
            $table->string('title');
            $table->string('payroll_run');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->integer('employee_count')->default(0);
            $table->string('status')->default('processing'); // processing, completed, failed
            $table->text('file_path')->nullable();
            $table->text('error_message')->nullable();
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_exports');
    }
};
