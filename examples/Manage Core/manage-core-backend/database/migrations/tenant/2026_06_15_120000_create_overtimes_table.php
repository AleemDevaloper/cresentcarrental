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
        Schema::create('overtimes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->decimal('hours', 5, 2);
            $table->decimal('rate', 3, 2)->default(1.50); // e.g. 1.5x regular pay
            $table->decimal('amount', 15, 2)->default(0);  // calculated cash amount
            $table->enum('type', ['manual', 'automated'])->default('manual');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('description')->nullable();
            $table->foreignId('attendance_id')->nullable()->constrained('attendance')->onDelete('set null');
            $table->foreignId('payslip_id')->nullable()->constrained('payslips')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtimes');
    }
};
