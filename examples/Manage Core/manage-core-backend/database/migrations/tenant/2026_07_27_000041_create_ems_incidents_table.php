<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('reported_by');
            $table->string('incident_type');
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->date('incident_date');
            $table->time('incident_time')->nullable();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->text('actions_taken')->nullable();
            $table->string('reported_to')->nullable();
            $table->enum('status', ['reported', 'investigating', 'resolved', 'closed'])->default('reported');
            $table->text('resolution')->nullable();
            $table->date('resolved_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('incidents');
    }
};
