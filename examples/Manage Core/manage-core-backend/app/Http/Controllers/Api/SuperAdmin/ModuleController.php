<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleFeature;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response()->json(Module::withCount('tenants')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:modules,code',
            'version' => 'string',
            'status' => 'string|in:active,disabled,beta,archived',
            'description' => 'nullable|string',
            'dependencies' => 'nullable|array',
            'category' => 'nullable|string',
            'base_price' => 'numeric',
            'settings' => 'nullable|array',
        ]);

        $module = Module::create($validated);
        return response()->json($module, 201);
    }

    public function show(Module $module)
    {
        return response()->json($module->load('features'));
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'status' => 'string|in:active,disabled,beta,archived',
            'version' => 'string',
            'description' => 'nullable|string',
            'dependencies' => 'nullable|array',
            'category' => 'nullable|string',
            'base_price' => 'numeric',
            'settings' => 'nullable|array',
        ]);

        $module->update($validated);
        return response()->json($module);
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return response()->json(null, 204);
    }

    public function addFeature(Request $request, Module $module)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string',
            'description' => 'nullable|string',
            'is_enabled' => 'boolean',
        ]);

        $feature = $module->features()->create($validated);
        return response()->json($feature, 201);
    }

    public function updateFeature(Request $request, ModuleFeature $feature)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string',
            'description' => 'nullable|string',
            'is_enabled' => 'boolean',
        ]);

        $feature->update($validated);
        return response()->json($feature);
    }

    public function destroyFeature(ModuleFeature $feature)
    {
        $feature->delete();
        return response()->json(null, 204);
    }
}
