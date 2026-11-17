<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->timestamp('from_user_cleared_at')->nullable();
            $table->timestamp('to_user_cleared_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->dropColumn(['from_user_cleared_at', 'to_user_cleared_at']);
        });
    }
};
