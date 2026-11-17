<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('subdomain', 80)->nullable()->unique()->after('domain');
        });

        \App\Models\Tenant::query()->whereNull('subdomain')->each(function ($tenant): void {
            $subdomain = data_get($tenant->settings, 'subdomain');
            if ($subdomain) {
                $tenant->update(['subdomain' => $subdomain]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropUnique(['subdomain']);
            $table->dropColumn('subdomain');
        });
    }
};
