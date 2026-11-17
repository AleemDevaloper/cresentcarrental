<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BudgetAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetAlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BudgetAlert::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }
 if ($request->filled('status')) {
            $status = $request->string('status');
            $query->where('status', $status);
        }

        $items = $query->orderBy('name')->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'total' => $items->total(),
                'currentPage' => $items->currentPage(),
                'lastPage' => $items->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:budget_alerts,code',
            'name' => 'required|string',
            'alert_category' => 'nullable|string',
            'severity' => 'nullable|in:low,medium,high,critical',
            'trigger_limit' => 'nullable|numeric',
            'recipients' => 'nullable|string',
            'channels' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $item = BudgetAlert::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(BudgetAlert $budgetAlert): JsonResponse
    {
        return response()->json(['data' => $budgetAlert]);
    }

    public function update(Request $request, BudgetAlert $budgetAlert): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:budget_alerts,code,' . $budgetAlert->id,
            'name' => 'sometimes|string',
            'alert_category' => 'nullable|string',
            'severity' => 'nullable|in:low,medium,high,critical',
            'trigger_limit' => 'nullable|numeric',
            'recipients' => 'nullable|string',
            'channels' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $budgetAlert->update($validated);

        return response()->json(['data' => $budgetAlert]);
    }

    public function destroy(BudgetAlert $budgetAlert): JsonResponse
    {
        $budgetAlert->delete();

        return response()->json(['data' => ['id' => $budgetAlert->id]], 200);
    }
}
