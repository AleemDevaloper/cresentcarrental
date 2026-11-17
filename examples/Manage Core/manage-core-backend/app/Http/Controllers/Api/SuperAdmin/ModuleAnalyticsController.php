<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleTenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ModuleAnalyticsController extends Controller
{
    public function dashboardStats()
    {
        $totalModules = Module::count();
        $activeModules = Module::where('status', 'active')->count();
        $disabledModules = Module::where('status', 'disabled')->count();
        $betaModules = Module::where('status', 'beta')->count();

        $totalLicensed = ModuleTenant::count();

        $revenue = ModuleTenant::join('modules', 'module_tenant.module_id', '=', 'modules.id')
            ->sum('modules.base_price');

        $mostUsed = Module::withCount('tenants')
            ->orderBy('tenants_count', 'desc')
            ->first();

        $leastUsed = Module::withCount('tenants')
            ->orderBy('tenants_count', 'asc')
            ->first();

        $adoptionRate = $totalModules > 0
            ? round(($activeModules / $totalModules) * 100, 1)
            : 0;

        $utilization = $totalLicensed > 0 && $totalModules > 0
            ? round(($totalLicensed / $totalModules) * 100, 1)
            : 0;

        return response()->json([
            'kpis' => [
                'total_modules' => $totalModules,
                'active_modules' => $activeModules,
                'disabled_modules' => $disabledModules,
                'licensed_modules' => $totalLicensed,
                'beta_modules' => $betaModules,
                'revenue' => $revenue,
                'most_used' => $mostUsed ? [
                    'name' => $mostUsed->name,
                    'tenant_count' => $mostUsed->tenants_count,
                ] : null,
                'least_used' => $leastUsed ? [
                    'name' => $leastUsed->name,
                    'tenant_count' => $leastUsed->tenants_count,
                ] : null,
                'usage_percent' => $adoptionRate,
            ],
            'analytics' => [
                'adoption_rate' => $adoptionRate,
                'utilization' => $utilization,
                'performance' => $totalModules > 0
                    ? round(($activeModules / $totalModules) * 100, 1)
                    : 0,
            ],
        ]);
    }

    public function usageTrends()
    {
        $distribution = Module::withCount('tenants')
            ->get()
            ->map(fn ($m) => ['name' => $m->name, 'value' => $m->tenants_count]);

        $adoptionTrends = [];
        if (Schema::hasTable('module_tenant')) {
            $adoptionTrends = DB::table('module_tenant')
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m') as date"),
                    DB::raw('count(*) as count')
                )
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->toArray();
        }

        return response()->json([
            'adoption_trends' => $adoptionTrends,
            'distribution' => $distribution,
        ]);
    }
}
