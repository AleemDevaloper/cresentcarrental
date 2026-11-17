<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('resource_name');
            $table->string('resource_type'); // Human, Equipment, Software, Other
            $table->string('role')->nullable();
            $table->integer('allocation_percent')->default(100);
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('Active'); // Active, Released, On Hold
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_resources');
    }
};
