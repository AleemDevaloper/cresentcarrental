<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_terminals', function (Blueprint $table) {
            $table->string('device_id')->nullable()->unique();
            $table->string('installation_id')->nullable();
            $table->string('app_version')->nullable();
            $table->string('operating_system')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->string('connection_status')->default('offline');
            $table->timestamp('approved_at')->nullable();
            $table->json('hardware_configuration')->nullable();
        });

        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->string('session_number')->nullable()->unique();
            $table->json('opening_denominations')->nullable();
            $table->json('closing_denominations')->nullable();
            $table->string('close_reason')->nullable();
        });

        Schema::create('pos_cash_counts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('pos_sessions')->cascadeOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->json('denominations');
            $table->decimal('total', 18, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_cash_counts');
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->dropColumn(['session_number', 'opening_denominations', 'closing_denominations', 'close_reason']);
        });
        Schema::table('pos_terminals', function (Blueprint $table) {
            $table->dropColumn([
                'device_id', 'installation_id', 'app_version', 'operating_system', 'last_seen_at',
                'connection_status', 'approved_at', 'hardware_configuration',
            ]);
        });
    }
};
