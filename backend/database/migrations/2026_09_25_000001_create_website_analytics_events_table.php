<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('website_analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_name', 80)->index();
            $table->string('session_id', 100)->index();
            $table->string('page_path', 500)->nullable()->index();
            $table->string('page_title', 255)->nullable();
            $table->string('target_label', 255)->nullable();
            $table->string('target_href', 500)->nullable();
            $table->string('content_type', 80)->nullable()->index();
            $table->string('content_id', 190)->nullable()->index();
            $table->json('metadata')->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('user_agent', 1000)->nullable();
            $table->string('ip_address', 45)->nullable()->index();
            $table->timestamp('occurred_at')->useCurrent()->index();
            $table->timestamps();
            $table->index(['event_name', 'occurred_at']);
            $table->index(['page_path', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_analytics_events');
    }
};
