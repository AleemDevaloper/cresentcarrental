<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dms_retention_policies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->string('name', 255);
            $table->string('slug', 255)->index();
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable()->index();
            $table->integer('retention_days')->nullable();
            $table->string('retention_period', 50)->default('indefinite');
            $table->string('action', 50)->default('archive');
            $table->json('conditions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
        });

        Schema::create('dms_scheduled_jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->string('name', 255);
            $table->string('type', 50)->index();
            $table->string('status', 50)->default('pending');
            $table->text('configuration')->nullable();
            $table->text('result')->nullable();
            $table->datetime('scheduled_at');
            $table->datetime('started_at')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index('tenant_id');
            $table->index('status');
        });

        Schema::create('dms_ai_analyses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('document_id');
            $table->string('type', 50);
            $table->text('result')->nullable();
            $table->float('confidence')->nullable();
            $table->text('metadata')->nullable();
            $table->string('status', 50)->default('pending');
            $table->text('error_message')->nullable();
            $table->unsignedBigInteger('analyzed_by')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->timestamps();

            $table->index('document_id');
            $table->index('type');
            $table->index('status');
            $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            $table->foreign('analyzed_by')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('dms_annotations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('document_id');
            $table->unsignedBigInteger('version_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('type', 50)->index();
            $table->text('content');
            $table->integer('page_number')->nullable();
            $table->text('position')->nullable();
            $table->string('color', 20)->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();

            $table->index('document_id');
            $table->index('user_id');
            $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            $table->foreign('version_id')->references('id')->on('dms_document_versions')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('dms_discussions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('document_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('title', 255);
            $table->text('content');
            $table->boolean('is_resolved')->default(false);
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->datetime('resolved_at')->nullable();
            $table->timestamps();

            $table->index('document_id');
            $table->index('user_id');
            $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('resolved_by')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('dms_discussion_replies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('discussion_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('content');
            $table->timestamps();

            $table->index('discussion_id');
            $table->index('user_id');
            $table->foreign('discussion_id')->references('id')->on('dms_discussions')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('dms_collaboration_tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('document_id');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('priority', 50)->default('medium');
            $table->string('status', 50)->default('pending');
            $table->date('due_date')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->timestamps();

            $table->index('document_id');
            $table->index('assigned_to');
            $table->index('status');
            $table->foreign('document_id')->references('id')->on('dms_documents')->cascadeOnDelete();
            $table->foreign('assigned_to')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dms_collaboration_tasks');
        Schema::dropIfExists('dms_discussion_replies');
        Schema::dropIfExists('dms_discussions');
        Schema::dropIfExists('dms_annotations');
        Schema::dropIfExists('dms_ai_analyses');
        Schema::dropIfExists('dms_scheduled_jobs');
        Schema::dropIfExists('dms_retention_policies');
    }
};
