<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeenAt
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            $cacheKey = "user.{$user->id}.last_seen_at";

            $lastUpdate = Cache::get($cacheKey);
            $fiveMinutesAgo = now()->subMinutes(5);

            if (!$lastUpdate || $lastUpdate->lt($fiveMinutesAgo)) {
                $user->update(['last_seen_at' => now()]);
                Cache::put($cacheKey, now(), 360);
            }
        }

        return $next($request);
    }
}
