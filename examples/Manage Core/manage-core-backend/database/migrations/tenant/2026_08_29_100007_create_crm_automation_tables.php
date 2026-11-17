<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_automations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->text('description')->nullable();
            $table->string('entity_type', 50)->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->boolean('test_mode')->default(false);
            $table->unsignedInteger('execution_count')->default(0);
            $table->unsignedInteger('success_count')->default(0);
            $table->unsignedInteger('failure_count')->default(0);
            $table->unsignedInteger('max_executions_per_record')->default(1);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::connection('tenant')->create('crm_automation_triggers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('automation_id')->index();
            $table->string('event', 80)->index();
            $table->json('conditions')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            try { $table->foreign('automation_id')->references('id')->on('crm_automations')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_automation_conditions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('automation_id')->index();
            $table->string('field', 100);
            $table->string('operator', 30);
            $table->text('value')->nullable();
            $table->string('logic', 10)->default('and');
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            try { $table->foreign('automation_id')->references('id')->on('crm_automations')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_automation_actions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('automation_id')->index();
            $table->string('type', 80)->index();
            $table->json('params')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->unsignedInteger('delay_minutes')->default(0);
            $table->timestamps();

            try { $table->foreign('automation_id')->references('id')->on('crm_automations')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_automation_runs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('automation_id')->index();
            $table->string('entity_type', 50)->index();
            $table->unsignedBigInteger('entity_id')->index();
            $table->string('status', 20)->default('running')->index();
            $table->json('context')->nullable();
            $table->json('result')->nullable();
            $table->text('error')->nullable();
            $table->unsignedInteger('actions_executed')->default(0);
            $table->unsignedBigInteger('triggered_by')->nullable()->index();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            try { $table->foreign('automation_id')->references('id')->on('crm_automations')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('triggered_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('crm_lead_score_rules', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('category', 30)->default('positive')->index();
            $table->string('event', 80)->index();
            $table->integer('points')->default(0);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_lead_score_rules');
        Schema::connection('tenant')->dropIfExists('crm_automation_runs');
        Schema::connection('tenant')->dropIfExists('crm_automation_actions');
        Schema::connection('tenant')->dropIfExists('crm_automation_conditions');
        Schema::connection('tenant')->dropIfExists('crm_automation_triggers');
        Schema::connection('tenant')->dropIfExists('crm_automations');
    }
};