<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mfg_machine_utilizations', function (Blueprint $table) {
            $table->id();
            $table->string('machine_name');
            $table->enum('status', ['operational', 'maintenance', 'idle', 'down'])->default('operational');
            $table->decimal('utilization_percent', 5, 2)->default(0);
            $table->decimal('production_hours', 10, 2)->default(0);
            $table->decimal('downtime_hours', 10, 2)->default(0);
            $table->integer('output_units')->default(0);
            $table->decimal('efficiency', 5, 2)->default(0);
            $table->date('date');
            $table->timestamps();

            $table->index(['date']);
            $table->index(['machine_name']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mfg_machine_utilizations');
    }
};
