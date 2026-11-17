<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('support_conversations', function (Blueprint $table) {
            $table->enum('status', ['Open', 'Resolved', 'Closed'])->default('Open');
            $table->timestamp('closed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('support_conversations', function (Blueprint $table) {
            $table->dropColumn(['status', 'closed_at']);
        });
    }
};
