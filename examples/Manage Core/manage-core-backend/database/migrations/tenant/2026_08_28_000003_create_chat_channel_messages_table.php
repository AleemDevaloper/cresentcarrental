<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_channel_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->constrained('chat_channels')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->longText('content');
            $table->enum('type', ['text', 'file', 'image', 'system'])->default('text');
            $table->foreignId('parent_id')->nullable()->constrained('chat_channel_messages')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_channel_messages');
    }
};
