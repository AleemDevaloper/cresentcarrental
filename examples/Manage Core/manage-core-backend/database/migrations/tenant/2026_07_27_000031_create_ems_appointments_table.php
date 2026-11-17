<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('doctor_name');
            $table->string('doctor_department')->nullable();
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->time('end_time')->nullable();
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->text('prescription')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'no_show'])->default('scheduled');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('appointments');
    }
};
