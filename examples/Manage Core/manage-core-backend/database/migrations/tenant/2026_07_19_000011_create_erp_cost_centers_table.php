<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cost_centers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('cost_type')->nullable();
            $table->decimal('annual_budget', 15, 2)->default(0);
            $table->string('allocation_method')->nullable();
            $table->string('manager')->nullable();
            $table->string('department')->nullable();
            $table->string('branch')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cost_centers');
    }
};
