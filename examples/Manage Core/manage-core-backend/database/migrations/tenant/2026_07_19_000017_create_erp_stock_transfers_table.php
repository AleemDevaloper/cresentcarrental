<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_no')->unique();
            $table->string('from_warehouse')->nullable();
            $table->string('to_warehouse')->nullable();
            $table->string('material')->nullable();
            $table->decimal('quantity', 10, 2)->default(0);
            $table->string('carrier')->nullable();
            $table->string('tracking_no')->nullable();
            $table->enum('status', ['requested', 'approved', 'dispatched', 'received', 'cancelled'])->default('requested');
            $table->date('request_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfers');
    }
};
