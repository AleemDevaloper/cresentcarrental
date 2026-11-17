<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->table('crm_campaigns', function (Blueprint $table) {
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'subject')) $table->string('subject')->nullable()->after('name');
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'from_name')) $table->string('from_name')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'from_email')) $table->string('from_email')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'reply_to')) $table->string('reply_to')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'scheduled_at')) $table->timestamp('scheduled_at')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'sent_at')) $table->timestamp('sent_at')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'recipient_count')) $table->unsignedInteger('recipient_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'delivered_count')) $table->unsignedInteger('delivered_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'opened_count')) $table->unsignedInteger('opened_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'clicked_count')) $table->unsignedInteger('clicked_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'replied_count')) $table->unsignedInteger('replied_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'bounced_count')) $table->unsignedInteger('bounced_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'unsubscribed_count')) $table->unsignedInteger('unsubscribed_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'converted_count')) $table->unsignedInteger('converted_count')->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'revenue')) $table->decimal('revenue', 15, 2)->default(0);
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'body')) $table->longText('body')->nullable();
            if (!Schema::connection('tenant')->hasColumn('crm_campaigns', 'template_id')) $table->unsignedBigInteger('template_id')->nullable();
        });

        Schema::connection('tenant')->create('crm_campaign_recipients', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('campaign_id')->index();
            $table->string('entity_type', 50)->index();
            $table->unsignedBigInteger('entity_id')->index();
            $table->string('email')->index();
            $table->string('name')->nullable();
            $table->string('status', 30)->default('pending')->index();
            $table->unsignedBigInteger('email_id')->nullable()->index();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamp('bounced_at')->nullable();
            $table->timestamps();

            try { $table->foreign('campaign_id')->references('id')->on('crm_campaigns')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_calendar_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->index();
            $table->text('description')->nullable();
            $table->string('type', 30)->default('meeting')->index();
            $table->string('status', 20)->default('scheduled')->index();
            $table->timestamp('start_at')->index();
            $table->timestamp('end_at')->nullable();
            $table->boolean('all_day')->default(false);
            $table->string('location')->nullable();
            $table->string('timezone', 50)->nullable();
            $table->string('color')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable()->index();
            $table->string('related_type')->nullable()->index();
            $table->unsignedBigInteger('related_id')->nullable()->index();
            $table->unsignedBigInteger('activity_id')->nullable()->index();
            $table->json('attendees')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['related_type', 'related_id']);
            try { $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_duplicate_groups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entity_type', 50)->index();
            $table->json('field_signature');
            $table->string('match_field', 50);
            $table->string('match_value');
            $table->unsignedInteger('member_count')->default(0);
            $table->string('status', 20)->default('open')->index();
            $table->timestamp('resolved_at')->nullable();
            $table->unsignedBigInteger('primary_record_id')->nullable();
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['match_field', 'match_value']);
        });

        Schema::connection('tenant')->create('crm_duplicate_members', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('group_id')->index();
            $table->string('entity_type', 50)->index();
            $table->unsignedBigInteger('entity_id')->index();
            $table->decimal('match_score', 5, 2)->default(0);
            $table->json('field_matches')->nullable();
            $table->boolean('is_ignored')->default(false);
            $table->timestamps();

            $table->unique(['group_id', 'entity_type', 'entity_id'], 'crm_dup_members_unique');
            try { $table->foreign('group_id')->references('id')->on('crm_duplicate_groups')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_import_jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entity_type', 50)->index();
            $table->string('file_name');
            $table->string('disk')->default('local');
            $table->string('path');
            $table->json('column_mapping')->nullable();
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('processed_rows')->default(0);
            $table->unsignedInteger('success_count')->default(0);
            $table->unsignedInteger('skipped_count')->default(0);
            $table->unsignedInteger('failed_count')->default(0);
            $table->unsignedInteger('duplicate_count')->default(0);
            $table->string('status', 20)->default('pending')->index();
            $table->json('error_report')->nullable();
            $table->text('error')->nullable();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::connection('tenant')->create('crm_import_rows', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id')->index();
            $table->unsignedInteger('row_number');
            $table->json('raw_data');
            $table->string('status', 20)->default('pending')->index();
            $table->unsignedBigInteger('created_entity_id')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();

            try { $table->foreign('job_id')->references('id')->on('crm_import_jobs')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_export_jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entity_type', 50)->index();
            $table->string('format', 20)->default('csv');
            $table->string('scope', 30)->default('all');
            $table->json('filters')->nullable();
            $table->json('columns')->nullable();
            $table->json('selected_ids')->nullable();
            $table->unsignedInteger('total_rows')->default(0);
            $table->string('status', 20)->default('pending')->index();
            $table->string('file_path')->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->text('error')->nullable();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_export_jobs');
        Schema::connection('tenant')->dropIfExists('crm_import_rows');
        Schema::connection('tenant')->dropIfExists('crm_import_jobs');
        Schema::connection('tenant')->dropIfExists('crm_duplicate_members');
        Schema::connection('tenant')->dropIfExists('crm_duplicate_groups');
        Schema::connection('tenant')->dropIfExists('crm_calendar_events');
        Schema::connection('tenant')->dropIfExists('crm_campaign_recipients');
    }
};