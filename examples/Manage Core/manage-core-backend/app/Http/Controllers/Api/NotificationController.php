<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request, ?string $role = null)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        $authenticatedRole = notification_role_display($user->role);
        $requestedRole = notification_role_display($role ?? $authenticatedRole);

        if (!$authenticatedRole) {
            return response()->json(['message' => 'Unable to determine user role.'], 422);
        }

        if ($requestedRole !== $authenticatedRole) {
            return response()->json(['message' => 'You are not allowed to view notifications for this role.'], 403);
        }

        return Notification::query()
            ->whereIn('role', notification_role_variants($authenticatedRole))
            ->where('is_read', false)
            ->latest()
            ->get();
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);
        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        $authenticatedRole = notification_role_display($user->role);
        
        Notification::query()
            ->whereIn('role', notification_role_variants($authenticatedRole))
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
