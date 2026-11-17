<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_held_carts', function (Blueprint $table) {
            $table->id();
            $table->string('cart_number')->unique();
            $table->foreignId('session_id')->constrained('pos_sessions')->restrictOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->json('items');
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('status')->default('held');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('resumed_at')->nullable();
            $table->timestamps();
            $table->index(['session_id', 'status']);
        });

        Schema::create('pos_transaction_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('pos_orders')->cascadeOnDelete();
            $table->string('event_type');
            $table->unsignedBigInteger('user_id');
            $table->text('reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['order_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_transaction_events');
        Schema::dropIfExists('pos_held_carts');
    }
};
