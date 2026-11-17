<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAccess
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_active || ($roles && !in_array($user->role, $roles, true))) {
            abort(403, 'You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
