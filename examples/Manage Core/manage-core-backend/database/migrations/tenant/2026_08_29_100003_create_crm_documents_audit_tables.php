<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('original_name');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('path');
            $table->string('disk')->default('public');
            $table->string('related_type')->nullable()->index();
            $table->unsignedBigInteger('related_id')->nullable()->index();
            $table->string('visibility')->default('private');
            $table->string('version')->default('1.0');
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('parent_id')->references('id')->on('crm_documents')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('user_name')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('action', 50)->index();
            $table->string('module', 50)->index();
            $table->string('entity_type')->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable()->index();
            $table->string('entity_label')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->json('metadata')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->index();

            try { $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_audit_logs');
        Schema::connection('tenant')->dropIfExists('crm_documents');
    }
};