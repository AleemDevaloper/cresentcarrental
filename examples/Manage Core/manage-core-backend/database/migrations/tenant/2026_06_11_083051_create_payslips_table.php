<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->decimal('gross_earning', 15, 2);
            $table->decimal('total_deduction', 15, 2);
            $table->decimal('net_salary', 15, 2);
            $table->string('status')->default('draft'); // draft, published, paid, cancelled
            $table->json('earnings_breakdown')->nullable();
            $table->json('deductions_breakdown')->nullable();
            $table->json('attendance_summary')->nullable();
            $table->foreignId('generated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['user_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
