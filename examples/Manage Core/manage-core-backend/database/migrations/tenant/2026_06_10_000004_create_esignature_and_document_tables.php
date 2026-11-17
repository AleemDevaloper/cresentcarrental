<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable');
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->bigInteger('file_size')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('signature_requests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('document_path');
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'completed', 'rejected', 'expired'])->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('signature_signers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('signature_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('email')->nullable();
            $table->integer('signing_order')->default(1);
            $table->enum('status', ['pending', 'signed', 'rejected'])->default('pending');
            $table->timestamp('signed_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('signature_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('signature_request_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., Created, Viewed, Signed, Rejected
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signature_audit_logs');
        Schema::dropIfExists('signature_signers');
        Schema::dropIfExists('signature_requests');
        Schema::dropIfExists('attachments');
    }
};
