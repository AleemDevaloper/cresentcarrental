<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_followups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->string('type', 30)->default('email')->index();
            $table->string('status', 30)->default('pending')->index();
            $table->string('priority', 20)->default('medium')->index();
            $table->timestamp('due_at')->nullable()->index();
            $table->timestamp('reminder_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->unsignedInteger('attempt_count')->default(0);
            $table->string('source', 30)->nullable();
            $table->unsignedBigInteger('sequence_id')->nullable()->index();
            $table->unsignedBigInteger('sequence_enrollment_id')->nullable()->index();
            $table->unsignedBigInteger('template_id')->nullable()->index();
            $table->unsignedBigInteger('owner_id')->nullable()->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('contact_id')->nullable()->index();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('deal_id')->nullable()->index();
            $table->unsignedBigInteger('assigned_to')->nullable()->index();
            $table->text('result')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('template_id')->references('id')->on('crm_email_templates')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('contact_id')->references('id')->on('crm_contacts')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_sequences', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->text('description')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->unsignedBigInteger('owner_id')->nullable()->index();
            $table->json('target_filters')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('active_enrollments')->default(0);
            $table->unsignedInteger('completed_enrollments')->default(0);
            $table->unsignedInteger('stopped_enrollments')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_sequence_steps', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('sequence_id')->index();
            $table->unsignedInteger('order')->default(0);
            $table->string('name')->nullable();
            $table->string('type', 30);
            $table->unsignedInteger('delay_days')->default(0);
            $table->unsignedInteger('delay_hours')->default(0);
            $table->time('send_time')->nullable();
            $table->unsignedBigInteger('template_id')->nullable()->index();
            $table->json('conditions')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();

            try { $table->foreign('sequence_id')->references('id')->on('crm_sequences')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('template_id')->references('id')->on('crm_email_templates')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_sequence_enrollments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('sequence_id')->index();
            $table->unsignedBigInteger('current_step_id')->nullable()->index();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('contact_id')->nullable()->index();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->unsignedBigInteger('deal_id')->nullable()->index();
            $table->unsignedBigInteger('owner_id')->nullable()->index();
            $table->string('status', 20)->default('active')->index();
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('next_step_at')->nullable()->index();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('stopped_at')->nullable();
            $table->string('stop_reason')->nullable();
            $table->unsignedInteger('step_count')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            try { $table->foreign('sequence_id')->references('id')->on('crm_sequences')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('contact_id')->references('id')->on('crm_contacts')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('customer_id')->references('id')->on('crm_customers')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('deal_id')->references('id')->on('crm_deals')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_sequence_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('enrollment_id')->index();
            $table->unsignedBigInteger('step_id')->nullable()->index();
            $table->string('event_type', 30)->index();
            $table->json('payload')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->timestamps();

            try { $table->foreign('enrollment_id')->references('id')->on('crm_sequence_enrollments')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('step_id')->references('id')->on('crm_sequence_steps')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_sequence_events');
        Schema::connection('tenant')->dropIfExists('crm_sequence_enrollments');
        Schema::connection('tenant')->dropIfExists('crm_sequence_steps');
        Schema::connection('tenant')->dropIfExists('crm_sequences');
        Schema::connection('tenant')->dropIfExists('crm_followups');
    }
};