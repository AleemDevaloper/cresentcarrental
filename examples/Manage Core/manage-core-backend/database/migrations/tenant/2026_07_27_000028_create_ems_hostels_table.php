<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('type')->nullable();
            $table->enum('gender', ['male', 'female', 'co_ed'])->default('co_ed');
            $table->integer('total_rooms')->default(0);
            $table->integer('total_beds')->default(0);
            $table->integer('available_beds')->default(0);
            $table->text('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('warden_name')->nullable();
            $table->string('warden_contact')->nullable();
            $table->json('amenities')->nullable();
            $table->json('rules')->nullable();
            $table->enum('status', ['active', 'inactive', 'full'])->default('active');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('hostels');
    }
};
