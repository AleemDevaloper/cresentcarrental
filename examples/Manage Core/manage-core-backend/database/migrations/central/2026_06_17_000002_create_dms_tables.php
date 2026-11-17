<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('dms_folders')) {
            Schema::create('dms_folders', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('parent_id')->nullable()->index();
                $table->string('name', 255);
                $table->string('slug', 255)->index();
                $table->text('description')->nullable();
                $table->string('color', 20)->nullable();
                $table->string('icon', 50)->nullable();
                $table->string('access_level', 50)->default('private');
                $table->unsignedBigInteger('owner_id')->nullable();
                $table->string('department', 100)->nullable();
                $table->boolean('is_archived')->default(false);
                $table->integer('sort_order')->default(0);
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('tenant_id');
                $table->index('owner_id');
                $table->foreign('parent_id')->references('id')->on('dms_folders')->nullOnDelete();
                $table->foreign('owner_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_documents')) {
            Schema::create('dms_documents', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('folder_id')->nullable()->index();
                $table->string('name', 255);
                $table->string('slug', 255)->index();
                $table->text('description')->nullable();
                $table->string('file_path', 500);
                $table->string('file_type', 50);
                $table->string('file_extension', 20);
                $table->bigInteger('file_size');
                $table->string('mime_type', 100)->nullable();
                $table->string('thumbnail_path', 500)->nullable();
                $table->integer('version')->default(1);
                $table->string('status', 50)->default('draft');
                $table->string('approval_status', 50)->default('pending');
                $table->string('signature_status', 50)->default('pending');
                $table->string('confidentiality', 50)->default('internal');
                $table->string('retention_policy', 100)->nullable();
                $table->datetime('retention_until')->nullable();
                $table->unsignedBigInteger('owner_id')->nullable();
                $table->string('department', 100)->nullable();
                $table->unsignedBigInteger('project_id')->nullable();
                $table->unsignedBigInteger('client_id')->nullable();
                $table->text('tags')->nullable();
                $table->text('metadata')->nullable();
                $table->boolean('is_template')->default(false);
                $table->boolean('is_archived')->default(false);
                $table->boolean('watermark_enabled')->default(false);
                $table->integer('download_limit')->nullable();
                $table->datetime('expires_at')->nullable();
                $table->datetime('last_viewed_at')->nullable();
                $table->integer('view_count')->default(0);
                $table->integer('download_count')->default(0);
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('tenant_id');
                $table->index('owner_id');
                $table->index('status');
                $table->index('file_type');
                $table->index(['tenant_id', 'folder_id']);
                $table->foreign('folder_id')->references('id')->on('dms_folders')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_document_versions')) {
            Schema::create('dms_document_versions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('document_id');
                $table->integer('version');
                $table->string('file_path', 500);
                $table->bigInteger('file_size');
                $table->string('file_type', 50)->nullable();
                $table->string('mime_type', 100)->nullable();
                $table->text('comment')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('version');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_document_signatures')) {
            Schema::create('dms_document_signatures', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('document_id');
                $table->unsignedBigInteger('signer_id')->nullable();
                $table->string('signer_email', 255);
                $table->string('signer_name', 255);
                $table->string('signature_type', 50);
                $table->integer('signing_order')->default(0);
                $table->text('signature_data')->nullable();
                $table->text('certificate_info')->nullable();
                $table->datetime('signed_at')->nullable();
                $table->string('status', 50)->default('pending');
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->datetime('sent_at')->nullable();
                $table->datetime('viewed_at')->nullable();
                $table->datetime('reminder_sent_at')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('signer_id');
                $table->index('status');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('signer_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_document_approvals')) {
            Schema::create('dms_document_approvals', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('document_id');
                $table->unsignedBigInteger('approver_id')->nullable();
                $table->string('approver_email', 255)->nullable();
                $table->string('stage', 100);
                $table->string('status', 50)->default('pending');
                $table->text('comment')->nullable();
                $table->unsignedBigInteger('escalated_to')->nullable();
                $table->integer('approval_order')->default(0);
                $table->datetime('approved_at')->nullable();
                $table->datetime('rejected_at')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('approver_id');
                $table->index('status');
                $table->index('stage');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('approver_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_audit_logs')) {
            Schema::create('dms_audit_logs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('document_id')->nullable();
                $table->unsignedBigInteger('folder_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('action', 100);
                $table->text('details')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->string('device', 255)->nullable();
                $table->string('location', 255)->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('folder_id');
                $table->index('user_id');
                $table->index('action');
                $table->index('created_at');
                $table->foreign('document_id')->references('id')->on('dms_documents')->nullOnDelete();
                $table->foreign('folder_id')->references('id')->on('dms_folders')->nullOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_document_comments')) {
            Schema::create('dms_document_comments', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('document_id');
                $table->unsignedBigInteger('user_id')->nullable();
                $table->text('content');
                $table->text('mentions')->nullable();
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->boolean('resolved')->default(false);
                $table->unsignedBigInteger('resolved_by')->nullable();
                $table->datetime('resolved_at')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('user_id');
                $table->index('parent_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
                $table->foreign('parent_id')->references('id')->on('dms_document_comments')->cascadeOnDelete();
                $table->foreign('resolved_by')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_document_shares')) {
            Schema::create('dms_document_shares', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('document_id');
                $table->unsignedBigInteger('shared_by');
                $table->unsignedBigInteger('shared_with_user_id')->nullable();
                $table->string('shared_with_email', 255)->nullable();
                $table->string('access_level', 50)->default('view');
                $table->string('share_token', 100)->unique();
                $table->string('password', 255)->nullable();
                $table->datetime('expires_at')->nullable();
                $table->integer('max_downloads')->nullable();
                $table->boolean('is_revoked')->default(false);
                $table->datetime('last_accessed_at')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('shared_with_user_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('shared_by')->references('id')->on('users')->cascadeOnDelete();
                $table->foreign('shared_with_user_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_templates')) {
            Schema::create('dms_templates', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->string('name', 255);
                $table->string('slug', 255)->index();
                $table->text('description')->nullable();
                $table->string('category', 100)->nullable()->index();
                $table->string('file_path', 500)->nullable();
                $table->string('thumbnail_path', 500)->nullable();
                $table->longText('content')->nullable();
                $table->text('fields')->nullable();
                $table->text('tags')->nullable();
                $table->boolean('is_public')->default(false);
                $table->integer('usage_count')->default(0);
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('tenant_id');
            });
        }

        if (!Schema::hasTable('dms_ai_analyses')) {
            Schema::create('dms_ai_analyses', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('document_id');
                $table->string('analysis_type', 50);
                $table->text('result')->nullable();
                $table->text('summary')->nullable();
                $table->decimal('confidence_score', 5, 2)->nullable();
                $table->text('metadata')->nullable();
                $table->string('status', 50)->default('completed');
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->index('document_id');
                $table->index('analysis_type');
                $table->index('tenant_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            });
        }

        if (!Schema::hasTable('dms_annotations')) {
            Schema::create('dms_annotations', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('document_id');
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('type', 50);
                $table->text('content');
                $table->integer('page_number')->nullable();
                $table->text('position')->nullable();
                $table->string('color', 20)->nullable();
                $table->boolean('is_resolved')->default(false);
                $table->timestamps();
                $table->softDeletes();

                $table->index('document_id');
                $table->index('user_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('dms_discussions')) {
            Schema::create('dms_discussions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('document_id');
                $table->string('title', 255);
                $table->text('content')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->string('status', 50)->default('open');
                $table->timestamps();
                $table->softDeletes();

                $table->index('document_id');
                $table->index('tenant_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            });
        }

        if (!Schema::hasTable('dms_collaboration_tasks')) {
            Schema::create('dms_collaboration_tasks', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tenant_id')->nullable();
                $table->unsignedBigInteger('document_id');
                $table->string('title', 255);
                $table->text('description')->nullable();
                $table->unsignedBigInteger('assigned_to')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->date('due_date')->nullable();
                $table->string('priority', 20)->default('medium');
                $table->string('status', 50)->default('pending');
                $table->timestamps();
                $table->softDeletes();

                $table->index('document_id');
                $table->index('assigned_to');
                $table->index('tenant_id');
                $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('dms_collaboration_tasks');
        Schema::dropIfExists('dms_discussions');
        Schema::dropIfExists('dms_annotations');
        Schema::dropIfExists('dms_ai_analyses');
        Schema::dropIfExists('dms_templates');
        Schema::dropIfExists('dms_document_shares');
        Schema::dropIfExists('dms_document_comments');
        Schema::dropIfExists('dms_audit_logs');
        Schema::dropIfExists('dms_document_approvals');
        Schema::dropIfExists('dms_document_signatures');
        Schema::dropIfExists('dms_document_versions');
        Schema::dropIfExists('dms_documents');
        Schema::dropIfExists('dms_folders');
    }
};
