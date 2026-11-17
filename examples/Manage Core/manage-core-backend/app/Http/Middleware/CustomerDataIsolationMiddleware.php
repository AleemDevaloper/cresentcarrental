<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CustomerDataIsolationMiddleware
 * 
 * Ensures that AR Customers (from clients table) and Super Admin Customers (from superadmin_customers table)
 * are kept completely separate and never mixed in the API responses.
 */
class CustomerDataIsolationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is a Super Admin Customers route
        if ($request->is('api/v1/super-admin/customers*')) {
            // Verify user has super_admin role
            $user = auth()->user();
            if (!$user || !$user->hasRole('super_admin')) {
                return response()->json([
                    'error' => 'Unauthorized. Only Super Admins can access this resource.',
                    'message' => 'This endpoint is reserved for Super Admin customers management.',
                ], 403);
            }

            // Add marker to request for Super Admin customers
            $request->attributes->set('_customer_type', 'superadmin');
        }
        
        // Check if this is an AR Customers route
        if ($request->is('api/v1/customers*') && !$request->is('api/v1/super-admin/*')) {
            // Add marker to request for AR customers
            $request->attributes->set('_customer_type', 'ar');
            
            // Prevent accidental access to super admin customers
            if ($request->query('include_superadmin')) {
                return response()->json([
                    'error' => 'Invalid parameter',
                    'message' => 'Super Admin customers cannot be accessed from AR endpoints.',
                ], 400);
            }
        }

        return $next($request);
    }
}
