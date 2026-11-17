<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmAuditController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmAuditLog::query();
        if ($request->filled('user_id')) $query->where('user_id', $request->input('user_id'));
        if ($request->filled('module')) $query->where('module', $request->input('module'));
        if ($request->filled('action')) $query->where('action', $request->input('action'));
        if ($request->filled('entity_type')) $query->where('entity_type', $request->input('entity_type'));
        if ($request->filled('entity_id')) $query->where('entity_id', $request->input('entity_id'));
        if ($request->filled('from')) $query->where('created_at', '>=', $request->input('from'));
        if ($request->filled('to')) $query->where('created_at', '<=', $request->input('to'));
        $items = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 50));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function show($id): JsonResponse
    {
        $log = CrmAuditLog::findOrFail($id);
        return response()->json(['success' => true, 'data' => $log]);
    }

    public function entityTimeline($entityType, $entityId): JsonResponse
    {
        $logs = CrmAuditLog::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['success' => true, 'data' => $logs]);
    }
}