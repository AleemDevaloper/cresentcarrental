<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('mysql')->create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->index();
            $table->string('title');
            $table->string('summary')->nullable();
            $table->longText('description')->nullable();
            $table->string('type')->default('information')->index();
            $table->string('priority')->default('normal')->index();
            $table->string('severity_color')->default('#2563eb');
            $table->string('status')->default('draft')->index();
            $table->boolean('is_platform_wide')->default(false)->index();
            $table->json('target_tenant_ids')->nullable();
            $table->json('target_roles')->nullable();
            $table->json('target_departments')->nullable();
            $table->json('module_visibility')->nullable();
            $table->json('placements')->nullable();
            $table->json('delivery_channels')->nullable();
            $table->json('actions')->nullable();
            $table->json('attachments')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('requires_acknowledgement')->default(false);
            $table->boolean('requires_read_confirmation')->default(false);
            $table->boolean('dismissible')->default(true);
            $table->timestamp('scheduled_at')->nullable()->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamp('starts_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->string('timezone')->default('UTC');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::connection('mysql')->create('announcement_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained('announcements')->cascadeOnDelete();
            $table->foreignId('tenant_id')->nullable()->index();
            $table->foreignId('user_id')->nullable()->index();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('dismissed_at')->nullable();
            $table->string('device')->nullable();
            $table->string('browser')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
            $table->unique(['announcement_id', 'tenant_id', 'user_id'], 'announcement_receipt_unique');
        });

        Schema::connection('mysql')->create('announcement_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->nullable()->index();
            $table->foreignId('actor_id')->nullable()->index();
            $table->string('action')->index();
            $table->text('message')->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::connection('mysql')->dropIfExists('announcement_audit_logs');
        Schema::connection('mysql')->dropIfExists('announcement_receipts');
        Schema::connection('mysql')->dropIfExists('announcements');
    }
};
