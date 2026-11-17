<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('grace_period_in')->default(15); // minutes
            $table->integer('grace_period_out')->default(15); // minutes
            $table->integer('break_duration')->default(60); // minutes
            $table->integer('half_day_threshold')->nullable(); // minutes
            $table->boolean('is_overtime_eligible')->default(false);
            $table->json('days_of_week')->nullable(); // [1,2,3,4,5]
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
