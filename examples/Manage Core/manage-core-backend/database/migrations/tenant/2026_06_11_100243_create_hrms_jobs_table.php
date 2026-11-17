<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hrms_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('designation_id')->nullable()->constrained()->onDelete('set null');
            $table->string('employment_type')->default('Full-time');
            $table->string('location')->nullable();
            $table->integer('vacancy_count')->default(1);
            $table->date('expiry_date')->nullable();
            $table->string('status')->default('Open'); // Open, Closed, Draft
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hrms_jobs');
    }
};
