<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->hasRole('super_admin')) {
            return response()->json(['message' => 'Only Super Admins can access this resource.'], 403);
        }

        return $next($request);
    }
}
