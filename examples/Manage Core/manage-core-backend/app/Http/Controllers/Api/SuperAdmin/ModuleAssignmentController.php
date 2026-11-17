<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Module;
use App\Models\ModuleTenant;
use App\Models\TenantModuleFeature;
use Illuminate\Http\Request;

class ModuleAssignmentController extends Controller
{
    public function index()
    {
        return response()->json(ModuleTenant::with(['tenant', 'module'])->get());
    }

    public function assign(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'module_id' => 'required|exists:modules,id',
            'license_type' => 'required|string|in:trial,starter,professional,enterprise,custom',
            'expires_at' => 'nullable|date',
            'status' => 'string|in:active,suspended,trial,expired',
            'settings' => 'nullable|array',
        ]);

        $assignment = ModuleTenant::updateOrCreate(
            ['tenant_id' => $validated['tenant_id'], 'module_id' => $validated['module_id']],
            $validated
        );

        return response()->json($assignment);
    }

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'module_id' => 'required|exists:modules,id',
        ]);

        ModuleTenant::where('tenant_id', $validated['tenant_id'])
            ->where('module_id', $validated['module_id'])
            ->delete();

        return response()->json(['message' => 'Module removed from tenant']);
    }

    public function toggleTenantFeature(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'module_feature_id' => 'required|exists:module_features,id',
            'is_enabled' => 'required|boolean',
        ]);

        $feature = TenantModuleFeature::updateOrCreate(
            ['tenant_id' => $validated['tenant_id'], 'module_feature_id' => $validated['module_feature_id']],
            ['is_enabled' => $validated['is_enabled']]
        );

        return response()->json($feature);
    }

    public function getTenantModules(Tenant $tenant)
    {
        return response()->json($tenant->modules()->withPivot(['status', 'license_type', 'expires_at'])->get());
    }
}
