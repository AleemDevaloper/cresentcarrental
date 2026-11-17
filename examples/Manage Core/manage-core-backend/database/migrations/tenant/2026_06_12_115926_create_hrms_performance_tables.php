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
        // KPIs (Key Performance Indicators)
        if (!Schema::hasTable('hrms_kpis')) {
            Schema::create('hrms_kpis', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('category')->nullable(); // e.g., Technical, Soft Skills, Sales
                $table->string('unit')->default('percentage'); // percentage, number, currency
                $table->decimal('target_value', 15, 2)->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // Goals / OKRs
        if (!Schema::hasTable('hrms_goals')) {
            Schema::create('hrms_goals', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('title');
                $table->text('description')->nullable();
                $table->enum('type', ['goal', 'okr'])->default('goal');
                $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
                $table->date('start_date');
                $table->date('end_date');
                $table->decimal('progress', 5, 2)->default(0); // 0.00 to 100.00
                $table->enum('status', ['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled'])->default('not_started');
                $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
                $table->timestamps();
            });
        }

        // Performance Reviews
        if (!Schema::hasTable('hrms_performance_reviews')) {
            Schema::create('hrms_performance_reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
                $table->string('review_cycle'); // e.g., Q1 2026, Annual 2026
                $table->date('review_date');
                $table->decimal('rating', 3, 2)->nullable(); // e.g., 1.0 to 5.0
                $table->text('strengths')->nullable();
                $table->text('areas_for_improvement')->nullable();
                $table->text('employee_comments')->nullable();
                $table->text('manager_comments')->nullable();
                $table->enum('status', ['draft', 'submitted', 'acknowledged', 'finalized'])->default('draft');
                $table->json('kpi_ratings')->nullable(); // Individual KPI scores
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hrms_performance_reviews');
        Schema::dropIfExists('hrms_goals');
        Schema::dropIfExists('hrms_kpis');
    }
};
