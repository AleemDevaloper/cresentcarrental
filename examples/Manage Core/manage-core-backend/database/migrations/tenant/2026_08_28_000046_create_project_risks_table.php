<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category'); // Technical, Resource, Schedule, Budget, Quality, External
            $table->string('probability')->default('Medium'); // Low, Medium, High
            $table->string('impact')->default('Medium'); // Low, Medium, High
            $table->string('status')->default('Open'); // Open, Mitigating, Monitoring, Closed
            $table->text('mitigation_plan')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_risks');
    }
};
