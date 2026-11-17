<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campus_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('type');
            $table->text('description')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('location')->nullable();
            $table->string('floor')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('operating_hours')->nullable();
            $table->json('amenities')->nullable();
            $table->json('rules')->nullable();
            $table->boolean('is_bookable')->default(true);
            $table->enum('status', ['available', 'unavailable', 'under_maintenance'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('facilities');
    }
};
