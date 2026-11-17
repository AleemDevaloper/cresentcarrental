<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Education
            $table->json('education')->nullable(); // [{degree, institution, year, grade}]
            
            // Experience
            $table->json('experience')->nullable(); // [{company, position, duration, description}]
            
            // Skills & Certifications
            $table->json('skills')->nullable(); // ["PHP", "Laravel", "React"]
            $table->json('certifications')->nullable(); // [{name, issuing_org, issue_date, expiry_date}]
            
            // Language Proficiency
            $table->json('languages')->nullable(); // [{language, proficiency}]
            
            // Family Details
            $table->json('family_details')->nullable(); // [{name, relation, contact}]
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_profiles');
    }
};
