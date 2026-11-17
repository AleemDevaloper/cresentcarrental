<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyLimit;
use App\Models\User;
use Illuminate\Http\Request;

class CompanyLimitController extends Controller
{
    public function stats(Request $request)
    {
        $role = $request->user()->role;
        $userId = $request->user()->id;

        if ($role === 'SuperAdmin' || $role === 'Admin') {
            $organizations = User::whereNotNull('organization')
                ->where('organization', '!=', '')
                ->selectRaw('organization, COUNT(*) as user_count')
                ->groupBy('organization')
                ->get();

            $limits = CompanyLimit::all()->keyBy('organization');

            $data = $organizations->map(function ($org) use ($limits) {
                $limit = $limits->get($org->organization);
                return [
                    'organization' => $org->organization,
                    'userCount' => (int) $org->user_count,
                    'userLimit' => $limit ? (int) $limit->user_limit : 0,
                    'limitId' => $limit ? $limit->id : null,
                ];
            });

            return response()->json(['data' => $data]);
        }

        $user = $request->user();
        $org = $user->organization;
        if (!$org) {
            return response()->json(['data' => []]);
        }

        $userCount = User::where('organization', $org)->count();
        $limit = CompanyLimit::where('organization', $org)->first();

        return response()->json([
            'data' => [[
                'organization' => $org,
                'userCount' => $userCount,
                'userLimit' => $limit ? (int) $limit->user_limit : 0,
                'limitId' => $limit ? $limit->id : null,
            ]],
        ]);
    }

    public function store(Request $request)
    {
        $role = $request->user()->role;
        if ($role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'organization' => ['required', 'string', 'max:255'],
            'userLimit' => ['required', 'integer', 'min:0'],
        ]);

        $limit = CompanyLimit::updateOrCreate(
            ['organization' => $data['organization']],
            ['user_limit' => $data['userLimit']]
        );

        return response()->json([
            'id' => $limit->id,
            'organization' => $limit->organization,
            'userLimit' => (int) $limit->user_limit,
        ]);
    }

    public function update($id, Request $request)
    {
        $role = $request->user()->role;
        if ($role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'userLimit' => ['required', 'integer', 'min:0'],
        ]);

        $limit = CompanyLimit::findOrFail($id);
        $limit->update(['user_limit' => $data['userLimit']]);

        return response()->json([
            'id' => $limit->id,
            'organization' => $limit->organization,
            'userLimit' => (int) $limit->user_limit,
        ]);
    }
}
