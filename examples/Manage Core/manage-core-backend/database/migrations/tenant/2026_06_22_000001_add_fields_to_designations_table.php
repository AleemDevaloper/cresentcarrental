<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('designations', function (Blueprint $table) {
            $table->string('level')->nullable()->after('name');
            $table->string('salary_band')->nullable()->after('level');
            $table->integer('performance_score')->nullable()->after('salary_band');
            $table->string('reports_to')->nullable()->after('performance_score');
            $table->text('description')->nullable()->after('reports_to');
        });
    }

    public function down(): void
    {
        Schema::table('designations', function (Blueprint $table) {
            $table->dropColumn(['level', 'salary_band', 'performance_score', 'reports_to', 'description']);
        });
    }
};
