<?php

namespace App\Services;

use App\Models\AiQuota;
use App\Models\AiUsageLog;
use App\Models\User;
use Carbon\Carbon;

class AiQuotaService
{
    /**
     * Returns the start (inclusive) datetime for the current quota period.
     */
    public static function periodStart(AiQuota $quota): Carbon
    {
        $now = Carbon::now();
        return match ($quota->period) {
            'daily' => $now->copy()->startOfDay(),
            'weekly' => $now->copy()->startOfWeek(),
            'monthly' => $now->copy()->startOfMonth(),
            default => $now->copy()->startOfMonth(),
        };
    }

    /**
     * Aggregated AI usage for an organization within the current period of its quota.
     */
    public static function usageForOrganization(string $organization, ?AiQuota $quota = null): array
    {
        if ($quota === null) {
            $quota = AiQuota::where('organization', $organization)->first();
        }

        $query = AiUsageLog::query()
            ->whereHas('user', function ($q) use ($organization) {
                $q->where('organization', $organization);
            });

        if ($quota) {
            $query->where('created_at', '>=', self::periodStart($quota));
        }

        $result = (clone $query)
            ->selectRaw('COUNT(*) as requests')
            ->selectRaw('COALESCE(SUM(input_tokens + output_tokens), 0) as tokens')
            ->selectRaw('COALESCE(SUM(cost), 0) as cost')
            ->first();

        return [
            'requests' => (int) ($result->requests ?? 0),
            'tokens' => (int) ($result->tokens ?? 0),
            'cost' => (float) ($result->cost ?? 0),
        ];
    }

    /**
     * Checks whether the given organization has exceeded any of its enabled quota limits.
     * Returns null when no quota is set or quota is disabled/unlimited.
     */
    public static function checkLimit(string $organization): ?array
    {
        $quota = AiQuota::where('organization', $organization)->first();
        if (!$quota || !$quota->enabled) {
            return null;
        }

        $usage = self::usageForOrganization($organization, $quota);

        $exceeded = [];
        if ($quota->request_limit > 0 && $usage['requests'] >= $quota->request_limit) {
            $exceeded['requests'] = true;
        }
        if ($quota->token_limit > 0 && $usage['tokens'] >= $quota->token_limit) {
            $exceeded['tokens'] = true;
        }
        if ($quota->cost_limit > 0 && $usage['cost'] >= $quota->cost_limit) {
            $exceeded['cost'] = true;
        }

        if (empty($exceeded)) {
            return null;
        }

        return [
            'quota' => $quota,
            'usage' => $usage,
            'exceeded' => $exceeded,
        ];
    }
}
