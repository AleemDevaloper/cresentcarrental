<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $baseDomain = strtolower(config('app.tenant_base_domain'));
        $tenant = Cache::remember("tenant.domain.{$host}", 3600, function () use ($host) {
            return Tenant::where('domain', $host)->first();
        });

        if (!$tenant && $baseDomain && str_ends_with($host, '.' . $baseDomain)) {
            $subdomain = substr($host, 0, -strlen('.' . $baseDomain));
            if ($subdomain !== '' && !str_contains($subdomain, '.')) {
                $tenant = Cache::remember("tenant.subdomain.{$subdomain}", 3600, function () use ($subdomain) {
                    return Tenant::where('subdomain', strtolower($subdomain))->first();
                });
            }
        }

        if ($tenant) {
            if ($tenant->status !== 'active') {
                return response()->json(['message' => 'Tenant is not active.'], 403);
            }
            $this->switchToTenantDatabase($tenant);
            view()->share('tenant', $tenant);
        } elseif ($defaultDb = env('DEFAULT_TENANT_DATABASE')) {
            $this->switchToDefaultDatabase($defaultDb);
            $defaultTenant = Cache::remember("tenant.db.{$defaultDb}", 3600, function () use ($defaultDb) {
                return Tenant::where('database', $defaultDb)->first();
            });
            if ($defaultTenant) {
                app()->instance('tenant', $defaultTenant);
                view()->share('tenant', $defaultTenant);
            }
        }

        return $next($request);
    }

    protected function switchToDefaultDatabase(string $database): void
    {
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => $database,
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        DB::purge('tenant');
        DB::setDefaultConnection('tenant');
    }

    protected function switchToTenantDatabase(Tenant $tenant)
    {
        $connection = 'tenant';
        
        Config::set("database.connections.$connection", [
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

        DB::purge($connection);
        DB::setDefaultConnection($connection);
        
        // Store current tenant in app container for easy access
        app()->instance('tenant', $tenant);
    }
}
