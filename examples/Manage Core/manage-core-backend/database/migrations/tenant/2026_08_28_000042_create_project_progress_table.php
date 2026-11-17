<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('milestone')->nullable();
            $table->integer('progress_percent')->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('reported_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_progress');
    }
};
