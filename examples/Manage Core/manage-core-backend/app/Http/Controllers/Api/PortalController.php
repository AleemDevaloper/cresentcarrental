<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PortalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = DB::table('portals');

        // Only SuperAdmin should see all portals. Regular Admin/HR users must be scoped to their own data.
        if (!in_array($user->role, ['SuperAdmin', 'super_admin'], true)) {
            $query->where('created_by', $user->id);
        }

        $portals = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $portals]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:portals,domain',
            'theme_settings' => 'nullable|json',
            'language' => 'nullable|string|size:2',
            'timezone' => 'nullable|string',
            'modules' => 'nullable|array',
            'modules.*' => 'exists:modules,id',
        ]);

        $portal = DB::transaction(function() use ($request, $data) {
            $themeSettings = $data['theme_settings'] ?? null;
            if (is_string($themeSettings)) {
                $themeSettings = json_decode($themeSettings, true);
            }

            $id = DB::table('portals')->insertGetId([
                'name' => $data['name'],
                'domain' => $data['domain'],
                'theme_settings' => $themeSettings ? json_encode($themeSettings) : null,
                'language' => $data['language'] ?? 'en',
                'timezone' => $data['timezone'] ?? 'UTC',
                'status' => 'active',
                'created_by' => $request->user()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($data['modules'])) {
                $pivotData = [];
                foreach ($data['modules'] as $moduleId) {
                    $pivotData[] = [
                        'portal_id' => $id,
                        'module_id' => $moduleId,
                        'created_at' => now(),
                    ];
                }
                DB::table('portal_modules')->insert($pivotData);
            }

            return DB::table('portals')->find($id);
        });

        $portal->modules = DB::table('portal_modules')
            ->where('portal_id', $portal->id)
            ->join('modules', 'portal_modules.module_id', '=', 'modules.id')
            ->select('modules.*')
            ->get();

        return response()->json(['data' => $portal], 201);
    }

    public function show($id): JsonResponse
    {
        $portal = DB::table('portals')->find($id);
        if (!$portal) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $portal->modules = DB::table('portal_modules')
            ->where('portal_id', $portal->id)
            ->join('modules', 'portal_modules.module_id', '=', 'modules.id')
            ->select('modules.*')
            ->get();

        if ($portal->theme_settings) {
            $portal->theme_settings = json_decode($portal->theme_settings);
        }

        return response()->json(['data' => $portal]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $portal = DB::table('portals')->find($id);
        if (!$portal) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'domain' => 'nullable|string|unique:portals,domain,' . $id,
            'theme_settings' => 'nullable|json',
            'language' => 'nullable|string|size:2',
            'timezone' => 'nullable|string',
            'modules' => 'nullable|array',
            'modules.*' => 'exists:modules,id',
            'status' => 'nullable|string|in:active,inactive,suspended',
        ]);

        DB::transaction(function() use ($id, $data, $request) {
            $updateData = [];
            if (isset($data['name'])) $updateData['name'] = $data['name'];
            if (isset($data['domain'])) $updateData['domain'] = $data['domain'];
            if (isset($data['theme_settings'])) {
                $themeSettings = $data['theme_settings'];
                if (is_string($themeSettings)) {
                    $themeSettings = json_decode($themeSettings, true);
                }
                $updateData['theme_settings'] = json_encode($themeSettings);
            }
            if (isset($data['language'])) $updateData['language'] = $data['language'];
            if (isset($data['timezone'])) $updateData['timezone'] = $data['timezone'];
            if (isset($data['status'])) $updateData['status'] = $data['status'];
            $updateData['updated_at'] = now();

            DB::table('portals')->where('id', $id)->update($updateData);

            if (isset($data['modules'])) {
                DB::table('portal_modules')->where('portal_id', $id)->delete();
                $pivotData = [];
                foreach ($data['modules'] as $moduleId) {
                    $pivotData[] = [
                        'portal_id' => $id,
                        'module_id' => $moduleId,
                        'created_at' => now(),
                    ];
                }
                DB::table('portal_modules')->insert($pivotData);
            }
        });

        return $this->show($id);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $portal = DB::table('portals')->find($id);
        if (!$portal) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        DB::transaction(function() use ($id) {
            DB::table('portal_modules')->where('portal_id', $id)->delete();
            DB::table('portals')->where('id', $id)->delete();
        });

        return response()->json(['ok' => true]);
    }

    public function branding(Request $request, $id): JsonResponse
    {
        $portal = DB::table('portals')->find($id);
        if (!$portal) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $data = $request->validate([
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png|max:512',
        ]);

        $updateData = [];

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $uploadPath = public_path('uploads/portals/logo');
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            $filename = 'logo_' . $id . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
            $file->move($uploadPath, $filename);
            $updateData['logo'] = 'uploads/portals/logo/' . $filename;
        }

        if ($request->hasFile('favicon')) {
            $file = $request->file('favicon');
            $uploadPath = public_path('uploads/portals/favicon');
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            $filename = 'favicon_' . $id . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
            $file->move($uploadPath, $filename);
            $updateData['favicon'] = 'uploads/portals/favicon/' . $filename;
        }

        if (!empty($updateData)) {
            $updateData['updated_at'] = now();
            DB::table('portals')->where('id', $id)->update($updateData);
        }

        return response()->json(['data' => DB::table('portals')->find($id)]);
    }
}
