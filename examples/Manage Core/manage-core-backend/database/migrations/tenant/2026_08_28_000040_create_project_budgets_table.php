<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->decimal('spent', 15, 2)->default(0);
            $table->string('status')->default('Active'); // Active, Exceeded, Closed
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_budgets');
    }
};
