<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->json('opening_denominations')->nullable();
        });

        Schema::table('pos_cash_ledger', function (Blueprint $table) {
            $table->string('idempotency_key')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('pos_cash_ledger', function (Blueprint $table) {
            $table->dropUnique(['idempotency_key']);
            $table->dropColumn('idempotency_key');
        });

        Schema::table('pos_sessions', function (Blueprint $table) {
            $table->dropColumn('opening_denominations');
        });
    }
};
