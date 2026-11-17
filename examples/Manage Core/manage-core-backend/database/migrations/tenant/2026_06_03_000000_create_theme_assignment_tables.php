<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('theme_configs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('settings');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('theme_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_config_id')->constrained('theme_configs')->onDelete('cascade');
            $table->string('assignable_type'); // Organization, Role, Department, Team, User
            $table->unsignedBigInteger('assignable_id')->nullable();
            $table->json('options'); // apply_theme, apply_sidebar, etc.
            $table->json('lock_settings'); // lock_theme, lock_sidebar, etc.
            $table->integer('priority')->default(0);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('theme_assignment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('action');
            $table->text('description');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_assignment_logs');
        Schema::dropIfExists('theme_assignments');
        Schema::dropIfExists('theme_configs');
    }
};
