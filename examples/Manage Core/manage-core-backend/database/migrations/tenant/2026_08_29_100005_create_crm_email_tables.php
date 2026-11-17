<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_email_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('account_name')->index();
            $table->string('email_address')->index();
            $table->string('display_name')->nullable();
            $table->string('provider', 30)->index();
            $table->string('connection_type', 30)->default('oauth');
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->string('token_type', 30)->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->text('smtp_host')->nullable();
            $table->unsignedInteger('smtp_port')->nullable();
            $table->string('smtp_username')->nullable();
            $table->text('smtp_password')->nullable();
            $table->string('smtp_encryption', 10)->nullable();
            $table->string('imap_host')->nullable();
            $table->unsignedInteger('imap_port')->nullable();
            $table->string('imap_username')->nullable();
            $table->text('imap_password')->nullable();
            $table->string('imap_encryption', 10)->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->string('sync_status', 20)->default('idle')->index();
            $table->timestamp('last_sync_at')->nullable();
            $table->string('sync_cursor')->nullable();
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('received_count')->default(0);
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->boolean('is_default')->default(false);
            $table->boolean('track_opens')->default(true);
            $table->boolean('track_clicks')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_signatures', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('name')->index();
            $table->longText('body');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_shared')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            try { $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_templates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('subject');
            $table->longText('body');
            $table->string('category')->nullable()->index();
            $table->boolean('is_shared')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('owner_id')->nullable()->index();
            $table->json('variables')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            try { $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_threads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('thread_key')->nullable()->index();
            $table->unsignedBigInteger('email_account_id')->nullable()->index();
            $table->string('subject')->index();
            $table->string('participants')->nullable();
            $table->unsignedInteger('message_count')->default(0);
            $table->unsignedInteger('unread_count')->default(0);
            $table->timestamp('last_message_at')->nullable()->index();
            $table->string('entity_type')->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable()->index();
            $table->string('snippet')->nullable();
            $table->boolean('is_starred')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->boolean('is_trash')->default(false);
            $table->boolean('is_spam')->default(false);
            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
            try { $table->foreign('email_account_id')->references('id')->on('crm_email_accounts')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_emails', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('thread_id')->nullable()->index();
            $table->unsignedBigInteger('email_account_id')->nullable()->index();
            $table->string('provider_message_id')->nullable()->index();
            $table->string('message_id_header')->nullable();
            $table->string('in_reply_to')->nullable();
            $table->text('references')->nullable();
            $table->string('direction', 10)->index();
            $table->string('folder', 30)->default('inbox')->index();
            $table->string('from_email')->index();
            $table->string('from_name')->nullable();
            $table->text('to_emails');
            $table->text('cc_emails')->nullable();
            $table->text('bcc_emails')->nullable();
            $table->string('subject');
            $table->longText('body_html')->nullable();
            $table->longText('body_text')->nullable();
            $table->boolean('is_read')->default(false);
            $table->boolean('is_starred')->default(false);
            $table->boolean('is_draft')->default(false)->index();
            $table->boolean('is_scheduled')->default(false);
            $table->timestamp('scheduled_at')->nullable();
            $table->string('status', 20)->default('received')->index();
            $table->timestamp('sent_at')->nullable()->index();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamp('bounced_at')->nullable();
            $table->unsignedInteger('open_count')->default(0);
            $table->unsignedInteger('click_count')->default(0);
            $table->text('bounce_reason')->nullable();
            $table->boolean('track_opens')->default(true);
            $table->boolean('track_clicks')->default(true);
            $table->unsignedBigInteger('campaign_id')->nullable()->index();
            $table->unsignedBigInteger('sequence_id')->nullable()->index();
            $table->unsignedBigInteger('template_id')->nullable()->index();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('entity_type')->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable()->index();
            $table->json('headers')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['entity_type', 'entity_id']);
            $table->index('is_read');
            try { $table->foreign('thread_id')->references('id')->on('crm_email_threads')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('email_account_id')->references('id')->on('crm_email_accounts')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('template_id')->references('id')->on('crm_email_templates')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_attachments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('email_id')->index();
            $table->string('name');
            $table->string('original_name');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('path');
            $table->string('disk')->default('public');
            $table->string('content_id')->nullable();
            $table->boolean('is_inline')->default(false);
            $table->timestamps();

            try { $table->foreign('email_id')->references('id')->on('crm_emails')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('email_id')->index();
            $table->string('event_type', 30)->index();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('link_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->timestamps();

            try { $table->foreign('email_id')->references('id')->on('crm_emails')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_email_webhooks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('provider', 30)->index();
            $table->unsignedBigInteger('email_account_id')->nullable()->index();
            $table->string('event_id')->index();
            $table->string('event_type', 50)->index();
            $table->json('payload');
            $table->json('headers')->nullable();
            $table->boolean('processed')->default(false)->index();
            $table->text('error')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('received_at')->nullable()->index();
            $table->timestamps();

            try { $table->foreign('email_account_id')->references('id')->on('crm_email_accounts')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_email_webhooks');
        Schema::connection('tenant')->dropIfExists('crm_email_events');
        Schema::connection('tenant')->dropIfExists('crm_email_attachments');
        Schema::connection('tenant')->dropIfExists('crm_emails');
        Schema::connection('tenant')->dropIfExists('crm_email_threads');
        Schema::connection('tenant')->dropIfExists('crm_email_templates');
        Schema::connection('tenant')->dropIfExists('crm_email_signatures');
        Schema::connection('tenant')->dropIfExists('crm_email_accounts');
    }
};