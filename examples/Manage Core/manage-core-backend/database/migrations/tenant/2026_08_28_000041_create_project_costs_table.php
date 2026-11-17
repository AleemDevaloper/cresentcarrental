<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('budget_id')->nullable()->constrained('project_budgets')->onDelete('set null');
            $table->string('type'); // Labor, Material, Software, Travel, Other
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->date('incurred_date');
            $table->foreignId('incurred_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_costs');
    }
};
