<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class CreateTenant extends Command
{
    protected $signature = 'tenants:create {name} {domain} {database?}';
    protected $description = 'Create a new tenant and its database';

    public function handle()
    {
        $name = $this->argument('name');
        $domain = $this->argument('domain');
        $database = $this->argument('database') ?: 'tenant_' . str_replace('.', '_', $domain);

        $this->info("Creating tenant: {$name}");

        // Create the database
        try {
            DB::statement("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $this->info("Database `{$database}` created or already exists.");
        } catch (\Exception $e) {
            $this->error("Failed to create database: " . $e->getMessage());
            return;
        }

        // Create the tenant record in central DB
        $tenant = Tenant::create([
            'name' => $name,
            'domain' => $domain,
            'database' => $database,
            'status' => 'active',
        ]);

        $this->info("Tenant record created in central database.");

        // Run migrations for the new tenant
        Artisan::call('tenants:migrate', [
            '--force' => true,
        ]);

        $this->info("Tenant setup complete.");
    }
}
