<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticAccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AnalyticAccount::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
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
            'code' => 'required|string|unique:analytic_accounts,code',
            'name' => 'required|string',
            'account_type' => 'nullable|string',
            'budget_assigned' => 'nullable|numeric',
            'linked_project' => 'nullable|string',
            'customer' => 'nullable|string',
            'contract_id' => 'nullable|string',
            'gl_revenue_account' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $item = AnalyticAccount::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(AnalyticAccount $analyticAccount): JsonResponse
    {
        return response()->json(['data' => $analyticAccount]);
    }

    public function update(Request $request, AnalyticAccount $analyticAccount): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:analytic_accounts,code,' . $analyticAccount->id,
            'name' => 'sometimes|string',
            'account_type' => 'nullable|string',
            'budget_assigned' => 'nullable|numeric',
            'linked_project' => 'nullable|string',
            'customer' => 'nullable|string',
            'contract_id' => 'nullable|string',
            'gl_revenue_account' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $analyticAccount->update($validated);

        return response()->json(['data' => $analyticAccount]);
    }

    public function destroy(AnalyticAccount $analyticAccount): JsonResponse
    {
        $analyticAccount->delete();

        return response()->json(['data' => ['id' => $analyticAccount->id]], 200);
    }
}
