<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HrmsOnboardingChecklist;
use App\Models\HrmsEmployeeOnboarding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OnboardingController extends Controller
{
    public function listChecklists(): JsonResponse
    {
        return response()->json(['data' => HrmsOnboardingChecklist::where('is_active', true)->get()]);
    }

    public function storeChecklist(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'items' => 'required|array',
            'items.*.title' => 'required|string',
            'items.*.responsible_dept' => 'required|string',
            'items.*.description' => 'nullable|string',
        ]);

        $checklist = HrmsOnboardingChecklist::create($validated);
        return response()->json(['data' => $checklist], 201);
    }

    public function listOnboardings(): JsonResponse
    {
        return response()->json(['data' => HrmsEmployeeOnboarding::with(['user', 'checklist'])->latest()->get()]);
    }

    public function storeOnboarding(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'checklist_id' => 'required|exists:hrms_onboarding_checklists,id',
        ]);

        $onboarding = HrmsEmployeeOnboarding::create($validated + [
            'status' => 'pending',
            'started_at' => now(),
            'completed_items' => []
        ]);

        return response()->json(['data' => $onboarding->load(['user', 'checklist'])], 201);
    }

    public function updateProgress(Request $request, HrmsEmployeeOnboarding $onboarding): JsonResponse
    {
        $validated = $request->validate([
            'completed_items' => 'required|array',
            'status' => 'required|in:pending,in_progress,completed'
        ]);

        $data = $validated;
        if ($validated['status'] === 'completed') {
            $data['completed_at'] = now();
        }

        $onboarding->update($data);
        return response()->json(['data' => $onboarding]);
    }
}
