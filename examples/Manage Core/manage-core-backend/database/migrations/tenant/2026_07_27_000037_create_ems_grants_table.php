<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('grants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('funding_agency');
            $table->string('principal_investigator');
            $table->json('co_investigators')->nullable();
            $table->string('grant_number')->unique();
            $table->decimal('amount', 14, 2);
            $table->string('currency')->default('USD');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['pending', 'approved', 'active', 'completed', 'cancelled'])->default('pending');
            $table->text('reporting_requirements')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('grants');
    }
};
