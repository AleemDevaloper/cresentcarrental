<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('patents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->json('inventors');
            $table->string('patent_number')->unique();
            $table->date('filing_date')->nullable();
            $table->date('granted_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->enum('status', ['filed', 'pending', 'granted', 'expired', 'rejected'])->default('filed');
            $table->string('country')->nullable();
            $table->string('file_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('patents');
    }
};
