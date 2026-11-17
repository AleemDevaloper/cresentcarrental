<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->bigInteger('file_size')->nullable(); // in bytes
        });

        Schema::table('user_documents', function (Blueprint $table) {
            $table->bigInteger('file_size')->nullable(); // in bytes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('file_size');
        });

        Schema::table('user_documents', function (Blueprint $table) {
            $table->dropColumn('file_size');
        });
    }
};
