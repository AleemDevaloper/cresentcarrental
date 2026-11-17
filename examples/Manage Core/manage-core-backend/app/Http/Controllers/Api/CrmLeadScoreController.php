<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmLeadScoreRule;
use App\Models\CrmLead;
use App\Services\Crm\CrmLeadScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmLeadScoreController extends Controller
{
    public function __construct(private CrmLeadScoreService $service) {}

    public function indexRules(Request $request): JsonResponse
    {
        $query = CrmLeadScoreRule::query();
        if ($request->filled('category')) $query->where('category', $request->input('category'));
        $items = $query->orderBy('sort_order')->get();
        return response()->json(['success' => true, 'data' => $items]);
    }

    public function storeRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:positive,negative',
            'event' => 'required|string|max:80',
            'points' => 'required|integer',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);
        $rule = CrmLeadScoreRule::create($validated);
        return response()->json(['success' => true, 'data' => $rule], 201);
    }

    public function updateRule(Request $request, $id): JsonResponse
    {
        $rule = CrmLeadScoreRule::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:positive,negative',
            'event' => 'sometimes|string|max:80',
            'points' => 'sometimes|integer',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);
        $rule->update($validated);
        return response()->json(['success' => true, 'data' => $rule->fresh()]);
    }

    public function destroyRule($id): JsonResponse
    {
        $rule = CrmLeadScoreRule::findOrFail($id);
        $rule->delete();
        return response()->json(['success' => true, 'message' => 'Rule deleted']);
    }

    public function seedDefaults(): JsonResponse
    {
        $this->service->seedDefaults();
        return response()->json(['success' => true, 'message' => 'Default rules seeded']);
    }

    public function recalculate($leadId): JsonResponse
    {
        $lead = CrmLead::findOrFail($leadId);
        $score = $this->service->recalculate($lead);
        return response()->json(['success' => true, 'data' => ['score' => $score, 'rating' => $lead->fresh()->rating]]);
    }
}