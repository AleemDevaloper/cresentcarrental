<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiQuota;
use App\Models\User;
use App\Services\AiQuotaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiQuotaController extends Controller
{
    /**
     * List every organization with its AI quota config and current-period usage.
     */
    public function index(Request $request): JsonResponse
    {
        $role = $request->user()->role;
        if (!in_array($role, ['SuperAdmin', 'Admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $organizations = User::whereNotNull('organization')
            ->where('organization', '!=', '')
            ->selectRaw('organization, COUNT(*) as user_count')
            ->groupBy('organization')
            ->orderBy('organization')
            ->get();

        $quotas = AiQuota::all()->keyBy('organization');

        $data = $organizations->map(function ($org) use ($quotas) {
            $quota = $quotas->get($org->organization);
            $usage = AiQuotaService::usageForOrganization($org->organization, $quota);

            $requestLimit = $quota ? (int) $quota->request_limit : 0;
            $tokenLimit = $quota ? (int) $quota->token_limit : 0;
            $costLimit = $quota ? (float) $quota->cost_limit : 0;

            $pct = function ($used, $limit) {
                if (!$limit || $limit <= 0) {
                    return 0;
                }
                return min(100, round(($used / $limit) * 100));
            };

            return [
                'organization' => $org->organization,
                'userCount' => (int) $org->user_count,
                'quotaId' => $quota ? $quota->id : null,
                'enabled' => $quota ? (bool) $quota->enabled : false,
                'period' => $quota ? $quota->period : 'monthly',
                'requestLimit' => $requestLimit,
                'tokenLimit' => $tokenLimit,
                'costLimit' => $costLimit,
                'usage' => $usage,
                'requestPct' => $pct($usage['requests'], $requestLimit),
                'tokenPct' => $pct($usage['tokens'], $tokenLimit),
                'costPct' => $pct($usage['cost'], $costLimit),
            ];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * Create or update the AI quota for an organization.
     */
    public function store(Request $request): JsonResponse
    {
        $role = $request->user()->role;
        if (!in_array($role, ['SuperAdmin', 'Admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'organization' => ['required', 'string', 'max:255'],
            'requestLimit' => ['required', 'integer', 'min:0'],
            'tokenLimit' => ['required', 'integer', 'min:0'],
            'costLimit' => ['required', 'numeric', 'min:0'],
            'period' => ['required', 'in:daily,weekly,monthly'],
            'enabled' => ['sometimes', 'boolean'],
        ]);

        $quota = AiQuota::updateOrCreate(
            ['organization' => $data['organization']],
            [
                'request_limit' => $data['requestLimit'],
                'token_limit' => $data['tokenLimit'],
                'cost_limit' => $data['costLimit'],
                'period' => $data['period'],
                'enabled' => $data['enabled'] ?? true,
            ]
        );

        return response()->json([
            'id' => $quota->id,
            'organization' => $quota->organization,
            'requestLimit' => (int) $quota->request_limit,
            'tokenLimit' => (int) $quota->token_limit,
            'costLimit' => (float) $quota->cost_limit,
            'period' => $quota->period,
            'enabled' => (bool) $quota->enabled,
        ]);
    }

    /**
     * Update an existing AI quota.
     */
    public function update($id, Request $request): JsonResponse
    {
        $role = $request->user()->role;
        if (!in_array($role, ['SuperAdmin', 'Admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $quota = AiQuota::findOrFail($id);

        $data = $request->validate([
            'requestLimit' => ['sometimes', 'integer', 'min:0'],
            'tokenLimit' => ['sometimes', 'integer', 'min:0'],
            'costLimit' => ['sometimes', 'numeric', 'min:0'],
            'period' => ['sometimes', 'in:daily,weekly,monthly'],
            'enabled' => ['sometimes', 'boolean'],
        ]);

        $quota->update([
            'request_limit' => $data['requestLimit'] ?? $quota->request_limit,
            'token_limit' => $data['tokenLimit'] ?? $quota->token_limit,
            'cost_limit' => $data['costLimit'] ?? $quota->cost_limit,
            'period' => $data['period'] ?? $quota->period,
            'enabled' => $data['enabled'] ?? $quota->enabled,
        ]);

        return response()->json([
            'id' => $quota->id,
            'organization' => $quota->organization,
            'requestLimit' => (int) $quota->request_limit,
            'tokenLimit' => (int) $quota->token_limit,
            'costLimit' => (float) $quota->cost_limit,
            'period' => $quota->period,
            'enabled' => (bool) $quota->enabled,
        ]);
    }
}
