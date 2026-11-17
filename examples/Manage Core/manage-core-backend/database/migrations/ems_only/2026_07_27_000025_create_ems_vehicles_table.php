<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('registration_number')->unique();
            $table->string('model')->nullable();
            $table->string('make')->nullable();
            $table->year('year')->nullable();
            $table->string('color')->nullable();
            $table->integer('capacity')->default(0);
            $table->string('fuel_type')->nullable();
            $table->string('insurance_number')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->string('tax_token_number')->nullable();
            $table->date('tax_token_expiry')->nullable();
            $table->string('fitness_certificate')->nullable();
            $table->date('fitness_expiry')->nullable();
            $table->enum('status', ['active', 'inactive', 'under_maintenance', 'retired'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
};
