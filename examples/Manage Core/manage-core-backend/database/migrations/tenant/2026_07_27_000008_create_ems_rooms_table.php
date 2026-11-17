<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained()->cascadeOnDelete();
            $table->string('room_number');
            $table->string('name')->nullable();
            $table->integer('floor')->default(0);
            $table->integer('capacity')->default(0);
            $table->string('type')->nullable();
            $table->enum('status', ['available', 'occupied', 'under_maintenance'])->default('available');
            $table->json('facilities')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rooms');
    }
};
