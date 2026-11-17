<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmNotification;
use App\Services\Crm\CrmNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmNotificationController extends Controller
{
    public function __construct(private CrmNotificationService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = CrmNotification::where('user_id', auth()->id());
        if ($request->filled('type')) $query->where('type', $request->input('type'));
        if ($request->input('unread_only') === 'true') $query->whereNull('read_at');
        $items = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ['count' => $this->service->unreadCount(auth()->id())]
        ]);
    }

    public function markRead($id): JsonResponse
    {
        $n = CrmNotification::where('user_id', auth()->id())->findOrFail($id);
        $n->markRead();
        return response()->json(['success' => true, 'data' => $n->fresh()]);
    }

    public function markAllRead(): JsonResponse
    {
        $count = $this->service->markAllRead(auth()->id());
        return response()->json(['success' => true, 'count' => $count]);
    }

    public function destroy($id): JsonResponse
    {
        $n = CrmNotification::where('user_id', auth()->id())->findOrFail($id);
        $n->delete();
        return response()->json(['success' => true, 'message' => 'Notification deleted']);
    }
}