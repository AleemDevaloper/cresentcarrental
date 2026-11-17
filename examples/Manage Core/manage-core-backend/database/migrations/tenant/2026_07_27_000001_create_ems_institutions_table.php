<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->string('code')->unique();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('institution_type');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->date('founded_date')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('tax_registration')->nullable();
            $table->string('currency')->default('USD');
            $table->string('language')->default('en');
            $table->string('timezone')->default('UTC');
            $table->string('country')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('address')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('principal')->nullable();
            $table->string('vice_principal')->nullable();
            $table->string('director')->nullable();
            $table->string('registrar')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('institutions');
    }
};
