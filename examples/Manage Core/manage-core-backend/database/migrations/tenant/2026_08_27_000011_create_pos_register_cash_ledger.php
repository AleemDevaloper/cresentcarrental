<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_registers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('store')->nullable();
            $table->string('currency', 3)->default('PKR');
            $table->decimal('default_opening_float', 18, 2)->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::table('pos_terminals', function (Blueprint $table) {
            $table->foreignId('register_id')->nullable()->constrained('pos_registers')->nullOnDelete();
        });

        Schema::create('pos_cash_ledger', function (Blueprint $table) {
            $table->id();
            $table->string('movement_id')->unique();
            $table->foreignId('session_id')->constrained('pos_sessions')->restrictOnDelete();
            $table->foreignId('terminal_id')->constrained('pos_terminals')->restrictOnDelete();
            $table->foreignId('register_id')->nullable()->constrained('pos_registers')->nullOnDelete();
            $table->string('type');
            $table->string('direction');
            $table->decimal('amount', 18, 2);
            $table->string('reference_type')->nullable();
            $table->string('reference_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->index(['session_id', 'type']);
            $table->index(['register_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_cash_ledger');
        Schema::table('pos_terminals', function (Blueprint $table) {
            $table->dropForeign(['register_id']);
            $table->dropColumn('register_id');
        });
        Schema::dropIfExists('pos_registers');
    }
};
