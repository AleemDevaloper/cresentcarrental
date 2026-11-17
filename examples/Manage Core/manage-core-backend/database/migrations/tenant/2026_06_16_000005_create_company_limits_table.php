<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_limits', function (Blueprint $table) {
            $table->id();
            $table->string('organization')->unique();
            $table->integer('user_limit')->default(0)->comment('0 = unlimited');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_limits');
    }
};
