<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HrmsGoal;
use App\Models\HrmsKpi;
use App\Models\HrmsPerformanceReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PerformanceController extends Controller
{
    // --- KPIs ---
    public function listKpis(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $kpis = HrmsKpi::where('is_active', true)->paginate($perPage);
        return response()->json([
            'data' => $kpis->items(),
            'pagination' => [
                'current_page' => $kpis->currentPage(),
                'per_page' => $kpis->perPage(),
                'total' => $kpis->total(),
                'last_page' => $kpis->lastPage(),
            ],
        ]);
    }

    public function storeKpi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'unit' => 'required|string',
            'target_value' => 'nullable|numeric',
        ]);

        $kpi = HrmsKpi::create($validated);
        return response()->json(['data' => $kpi], 201);
    }

    // --- Goals ---
    public function listGoals(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = HrmsGoal::with(['user', 'creator']);

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            // Managers can see their own and their subordinates' goals
            if ($user->role === 'Manager') {
                $subordinateIds = \App\Models\User::where('manager_id', $user->id)->pluck('id')->toArray();
                $query->whereIn('user_id', array_merge([$user->id], $subordinateIds));
            } else {
                $query->where('user_id', $user->id);
            }
        }

        $perPage = $request->per_page ?? 50;
        $goals = $query->latest()->paginate($perPage);
        return response()->json([
            'data' => $goals->items(),
            'pagination' => [
                'current_page' => $goals->currentPage(),
                'per_page' => $goals->perPage(),
                'total' => $goals->total(),
                'last_page' => $goals->lastPage(),
            ],
        ]);
    }

    public function storeGoal(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:goal,okr',
            'priority' => 'required|in:low,medium,high,urgent',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['status'] = 'not_started';
        $validated['progress'] = 0;

        $goal = HrmsGoal::create($validated);
        return response()->json(['data' => $goal], 201);
    }

    public function updateGoalProgress(Request $request, HrmsGoal $goal): JsonResponse
    {
        $validated = $request->validate([
            'progress' => 'required|numeric|min:0|max:100',
            'status' => 'nullable|string|in:not_started,in_progress,completed,on_hold,cancelled',
        ]);

        $goal->update($validated);
        return response()->json(['data' => $goal]);
    }

    // --- Performance Reviews ---
    public function listReviews(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = HrmsPerformanceReview::with(['user', 'reviewer']);

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('reviewer_id', $user->id);
            });
        }

        $perPage = $request->per_page ?? 50;
        $reviews = $query->latest()->paginate($perPage);
        return response()->json([
            'data' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
                'last_page' => $reviews->lastPage(),
            ],
        ]);
    }

    public function storeReview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'reviewer_id' => 'required|exists:users,id',
            'review_cycle' => 'required|string',
            'review_date' => 'required|date',
            'rating' => 'nullable|numeric|min:1|max:5',
            'strengths' => 'nullable|string',
            'areas_for_improvement' => 'nullable|string',
            'kpi_ratings' => 'nullable|array',
        ]);

        $validated['status'] = 'draft';

        $review = HrmsPerformanceReview::create($validated);
        return response()->json(['data' => $review], 201);
    }

    public function updateReviewStatus(Request $request, HrmsPerformanceReview $review): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,submitted,acknowledged,finalized',
            'employee_comments' => 'nullable|string',
            'manager_comments' => 'nullable|string',
        ]);

        $review->update($validated);
        return response()->json(['data' => $review]);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $stats = [
            'total_goals' => HrmsGoal::where('user_id', $user->id)->count(),
            'completed_goals' => HrmsGoal::where('user_id', $user->id)->where('status', 'completed')->count(),
            'avg_progress' => round(HrmsGoal::where('user_id', $user->id)->avg('progress') ?? 0, 1),
            'latest_rating' => HrmsPerformanceReview::where('user_id', $user->id)->where('status', 'finalized')->latest()->value('rating') ?? 'N/A',
        ];

        return response()->json(['data' => $stats]);
    }
}
