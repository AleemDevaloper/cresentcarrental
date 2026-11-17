<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('salary_structure_id')->constrained()->onDelete('cascade');
            $table->decimal('base_amount', 15, 2); // Annual CTC or Monthly Basic
            $table->date('effective_date');
            $table->string('payment_method')->default('bank_transfer'); // bank_transfer, cash, cheque
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};
