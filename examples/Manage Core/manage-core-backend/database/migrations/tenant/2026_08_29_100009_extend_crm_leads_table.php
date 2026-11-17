<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->table('crm_leads', function (Blueprint $table) {
            $columns = [];
            try { $columns = Schema::connection('tenant')->getColumnListing('crm_leads'); } catch (\Exception $e) {}
            if (!in_array('first_name', $columns)) $table->string('first_name')->nullable()->after('code');
            if (!in_array('last_name', $columns)) $table->string('last_name')->nullable()->after('first_name');
            if (!in_array('job_title', $columns)) $table->string('job_title')->nullable()->after('company');
            if (!in_array('mobile', $columns)) $table->string('mobile')->nullable()->after('phone');
            if (!in_array('website', $columns)) $table->string('website')->nullable()->after('mobile');
            if (!in_array('linkedin', $columns)) $table->string('linkedin')->nullable()->after('website');
            if (!in_array('postal_code', $columns)) $table->string('postal_code')->nullable()->after('country');
            if (!in_array('campaign_id', $columns)) $table->unsignedBigInteger('campaign_id')->nullable()->index()->after('source');
            if (!in_array('company_size', $columns)) $table->string('company_size')->nullable()->after('industry');
            if (!in_array('revenue', $columns)) $table->decimal('revenue', 15, 2)->nullable()->after('company_size');
            if (!in_array('team_id', $columns)) $table->unsignedBigInteger('team_id')->nullable()->index()->after('assigned_to');
            if (!in_array('last_contacted_at', $columns)) $table->timestamp('last_contacted_at')->nullable()->after('created_by');
            if (!in_array('next_follow_up_at', $columns)) $table->timestamp('next_follow_up_at')->nullable()->index()->after('last_contacted_at');
            if (!in_array('converted_contact_id', $columns)) $table->unsignedBigInteger('converted_contact_id')->nullable()->after('converted_at');
            if (!in_array('converted_deal_id', $columns)) $table->unsignedBigInteger('converted_deal_id')->nullable()->after('converted_contact_id');
            if (!in_array('campaign_id', $columns)) {
                try { $table->foreign('campaign_id')->references('id')->on('crm_campaigns')->onDelete('set null'); } catch (\Exception $e) {}
            }
        });
    }

    public function down(): void
    {
        // No-op
    }
};