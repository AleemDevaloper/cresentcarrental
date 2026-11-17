<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hrms_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('hrms_jobs')->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained('hrms_candidates')->onDelete('cascade');
            $table->string('stage')->default('Applied'); // Applied, Screening, Interview, Offer, Hired, Rejected
            $table->timestamp('applied_at')->useCurrent();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['job_id', 'candidate_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hrms_applications');
    }
};
