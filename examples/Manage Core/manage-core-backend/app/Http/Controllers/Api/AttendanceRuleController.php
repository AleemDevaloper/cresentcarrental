<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OvertimeRule;
use App\Models\GraceTime;
use App\Models\HalfDayRule;
use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceRuleController extends Controller
{
    public function overtimeRules(Request $request): JsonResponse
    {
        $query = OvertimeRule::with('shift');

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function storeOvertimeRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shift_id' => 'nullable|exists:shifts,id',
            'overtime_type' => 'required|string|in:fixed,hourly,daily,weekly',
            'rate_multiplier' => 'required|numeric|min:1',
            'min_hours_for_overtime' => 'required|integer|min:0',
            'max_overtime_hours' => 'nullable|integer|min:0',
            'approval_required' => 'boolean',
            'applicable_days' => 'nullable|array',
            'applicable_days.*' => 'integer|between:0,6',
            'effective_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $rule = OvertimeRule::create($validated);
        return response()->json(['data' => $rule], 201);
    }

    public function updateOvertimeRule(Request $request, OvertimeRule $overtimeRule): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'shift_id' => 'nullable|exists:shifts,id',
            'overtime_type' => 'string|in:fixed,hourly,daily,weekly',
            'rate_multiplier' => 'numeric|min:1',
            'min_hours_for_overtime' => 'integer|min:0',
            'max_overtime_hours' => 'nullable|integer|min:0',
            'approval_required' => 'boolean',
            'applicable_days' => 'nullable|array',
            'applicable_days.*' => 'integer|between:0,6',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $overtimeRule->update($validated);
        return response()->json(['data' => $overtimeRule->fresh()]);
    }

    public function deleteOvertimeRule(OvertimeRule $overtimeRule): JsonResponse
    {
        $overtimeRule->delete();
        return response()->json(null, 204);
    }

    public function graceTimes(Request $request): JsonResponse
    {
        $query = GraceTime::with('shift');

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function storeGraceTime(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shift_id' => 'nullable|exists:shifts,id',
            'name' => 'required|string|max:255',
            'grace_in_minutes' => 'required|integer|min:0|max:120',
            'grace_out_minutes' => 'required|integer|min:0|max:120',
            'apply_late' => 'boolean',
            'apply_early_exit' => 'boolean',
            'effective_date' => 'required|date',
            'applicable_days' => 'nullable|array',
            'applicable_days.*' => 'integer|between:0,6',
            'notes' => 'nullable|string',
        ]);

        $graceTime = GraceTime::create($validated);
        return response()->json(['data' => $graceTime], 201);
    }

    public function halfDayRules(Request $request): JsonResponse
    {
        $query = HalfDayRule::with('shift');

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function storeHalfDayRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shift_id' => 'nullable|exists:shifts,id',
            'min_hours_for_half_day' => 'required|integer|min:1',
            'max_hours_for_half_day' => 'required|integer|gt:min_hours_for_half_day',
            'half_day_deduction' => 'nullable|numeric|min:0|max:100',
            'allow_late_marking' => 'boolean',
            'late_minutes_threshold' => 'nullable|integer|min:0',
            'effective_date' => 'required|date',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $rule = HalfDayRule::create($validated);
        return response()->json(['data' => $rule], 201);
    }
}
