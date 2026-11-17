<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class MigrateTenants extends Command
{
    protected $signature = 'tenants:migrate {--fresh : Drop all tables and re-run all migrations} {--seed : Seed the tenant database after migrating} {--force : Force the operation to run when in production}';
    protected $description = 'Run migrations for all tenants';

    public function handle()
    {
        $tenants = Tenant::all();

        if ($tenants->isEmpty()) {
            $this->info('No tenants found.');
            return;
        }

        foreach ($tenants as $tenant) {
            $this->migrateTenant($tenant);
        }

        $this->info('All tenant migrations completed.');
    }

    protected function migrateTenant(Tenant $tenant)
    {
        $this->info("Migrating tenant: {$tenant->name} ({$tenant->domain})");

        // Set tenant connection
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => $tenant->database,
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        DB::purge('tenant');

        $options = [
            '--database' => 'tenant',
            '--path' => 'database/migrations/tenant',
            '--force' => true,
        ];

        if ($this->option('fresh')) {
            Artisan::call('migrate:fresh', $options);
        } else {
            Artisan::call('migrate', $options);
        }

        if ($this->option('seed')) {
            Artisan::call('db:seed', [
                '--database' => 'tenant',
                '--force' => true,
            ]);
        }

        $this->info(Artisan::output());
    }
}
