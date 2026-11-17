<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add priority to approval_requests
        Schema::table('approval_requests', function (Blueprint $table) {
            $table->string('priority')->default('medium')->after('status'); // low, medium, high, urgent
            $table->json('metadata')->nullable()->after('reason'); // For storing request-specific data (e.g., new email, role change details)
        });

        // Create approval_comments table
        Schema::create('approval_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_request_id')->constrained('approval_requests')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('comment');
            $table->timestamps();
        });

        // Create approval_history table
        Schema::create('approval_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_request_id')->constrained('approval_requests')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Who performed the action
            $table->string('action'); // created, reviewed, approved, rejected, escalated, sent_back
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_history');
        Schema::dropIfExists('approval_comments');
        Schema::table('approval_requests', function (Blueprint $table) {
            $table->dropColumn(['priority', 'metadata']);
        });
    }
};
