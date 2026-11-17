<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use App\Models\ShiftRotation;
use App\Models\BreakTime;
use App\Models\GraceTime;
use App\Models\WeeklyOff;
use App\Models\User;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShiftController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Shift::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $shifts = $query->with(['breakTimes', 'graceTimes'])->latest()->get();
        return response()->json(['data' => $shifts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'grace_period_in' => 'nullable|integer|min:0',
            'grace_period_out' => 'nullable|integer|min:0',
            'break_duration' => 'nullable|integer|min:0',
            'half_day_threshold' => 'nullable|integer|min:0',
            'is_overtime_eligible' => 'boolean',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|between:0,6',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'late_threshold' => 'nullable|integer|min:0',
            'early_exit_threshold' => 'nullable|integer|min:0',
            'min_working_hours' => 'nullable|numeric|min:0',
        ]);

        $shift = Shift::create($validated);
        return response()->json(['data' => $shift->load(['breakTimes', 'graceTimes'])], 201);
    }

    public function show(Shift $shift): JsonResponse
    {
        return response()->json(['data' => $shift->load(['breakTimes', 'graceTimes', 'assignments.user'])]);
    }

    public function update(Request $request, Shift $shift): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'start_time' => 'string',
            'end_time' => 'string',
            'grace_period_in' => 'nullable|integer|min:0',
            'grace_period_out' => 'nullable|integer|min:0',
            'break_duration' => 'nullable|integer|min:0',
            'half_day_threshold' => 'nullable|integer|min:0',
            'status' => 'string|in:active,inactive',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|between:0,6',
            'color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'is_overtime_eligible' => 'boolean',
            'late_threshold' => 'nullable|integer|min:0',
            'early_exit_threshold' => 'nullable|integer|min:0',
            'min_working_hours' => 'nullable|numeric|min:0',
        ]);

        $shift->update($validated);
        return response()->json(['data' => $shift->fresh()->load(['breakTimes', 'graceTimes'])]);
    }

    public function destroy(Shift $shift): JsonResponse
    {
        if ($shift->attendances()->exists()) {
            return response()->json(['message' => 'Cannot delete shift with associated attendance records.'], 422);
        }

        $shift->delete();
        return response()->json(null, 204);
    }

    public function assignShift(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:effective_date',
            'notes' => 'nullable|string',
        ]);

        $assignments = DB::transaction(function () use ($request) {
            $shift = Shift::findOrFail($request->shift_id);
            $created = [];

            foreach ($request->user_ids as $userId) {
                // End existing active assignment
                ShiftAssignment::where('user_id', $userId)
                    ->whereNull('end_date')
                    ->update(['end_date' => Carbon::parse($request->effective_date)->subDay()->toDateString()]);

                $assignment = ShiftAssignment::create([
                    'user_id' => $userId,
                    'shift_id' => $shift->id,
                    'effective_date' => $request->effective_date,
                    'end_date' => $request->end_date,
                    'notes' => $request->notes,
                    'assigned_by' => $request->user()->id,
                ]);

                $created[] = $assignment;
            }

            return $created;
        });

        return response()->json(['data' => $assignments], 201);
    }

    public function bulkAssign(Request $request): JsonResponse
    {
        $request->validate([
            'shift_id' => 'required|exists:shifts,id',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:effective_date',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'employee_type' => 'nullable|string',
        ]);

        $query = User::query();

        if ($request->department_id) {
            $query->whereHas('profile', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->designation_id) {
            $query->whereHas('profile', function ($q) use ($request) {
                $q->where('designation_id', $request->designation_id);
            });
        }

        if ($request->employee_type) {
            $query->where('employee_type', $request->employee_type);
        }

        $users = $query->where('status', 'Active')->get();

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found matching the criteria.'], 404);
        }

        $assignments = DB::transaction(function () use ($request, $users) {
            $shift = Shift::findOrFail($request->shift_id);
            $created = [];

            foreach ($users as $user) {
                ShiftAssignment::where('user_id', $user->id)
                    ->whereNull('end_date')
                    ->update(['end_date' => Carbon::parse($request->effective_date)->subDay()->toDateString()]);

                $created[] = ShiftAssignment::create([
                    'user_id' => $user->id,
                    'shift_id' => $shift->id,
                    'effective_date' => $request->effective_date,
                    'end_date' => $request->end_date,
                    'assigned_by' => $request->user()->id,
                ]);
            }

            return $created;
        });

        return response()->json(['data' => $assignments, 'meta' => ['total_assigned' => count($assignments)]], 201);
    }

    public function calendar(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $query = ShiftAssignment::with(['shift', 'user'])
            ->whereBetween('effective_date', [$startDate, $endDate])
            ->orWhere(function ($q) use ($endDate) {
                $q->where('effective_date', '<=', $endDate)
                  ->where(function ($sub) use ($endDate) {
                      $sub->whereNull('end_date')
                          ->orWhere('end_date', '>=', $endDate);
                  });
            });

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        $assignments = $query->get();

        $calendar = [];
        $period = $startDate->copy();

        while ($period <= $endDate) {
            $dateStr = $period->toDateString();
            $dayAssignments = $assignments->filter(function ($a) use ($dateStr) {
                return $a->effective_date <= $dateStr
                    && (is_null($a->end_date) || $a->end_date >= $dateStr);
            });

            $calendar[] = [
                'date' => $dateStr,
                'day' => $period->dayOfWeek,
                'is_weekend' => in_array($period->dayOfWeek, [0, 6]),
                'assignments' => $dayAssignments->values(),
            ];

            $period->addDay();
        }

        return response()->json(['data' => $calendar]);
    }

    public function coverage(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        $date = Carbon::parse($request->date);
        $query = ShiftAssignment::with(['user', 'shift'])
            ->where('effective_date', '<=', $date->toDateString())
            ->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', $date->toDateString());
            });

        if ($request->shift_id) {
            $query->where('shift_id', $request->shift_id);
        }

        $assignments = $query->get();
        $grouped = $assignments->groupBy('shift_id');

        $coverage = $grouped->map(function ($items, $shiftId) {
            $shift = $items->first()->shift;
            return [
                'shift' => $shift->name,
                'shift_id' => $shiftId,
                'total_assigned' => $items->count(),
                'users' => $items->pluck('user.name'),
            ];
        })->values();

        return response()->json(['data' => $coverage]);
    }

    public function rotations(Request $request): JsonResponse
    {
        $rotations = ShiftRotation::with(['shifts', 'users'])->latest()->get();
        return response()->json(['data' => $rotations]);
    }

    public function storeRotation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shift_ids' => 'required|array|min:2',
            'shift_ids.*' => 'exists:shifts,id',
            'rotation_cycle_days' => 'required|integer|min:1',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
            'effective_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $rotation = DB::transaction(function () use ($validated, $request) {
            $rotation = ShiftRotation::create([
                'name' => $validated['name'],
                'rotation_cycle_days' => $validated['rotation_cycle_days'],
                'effective_date' => $validated['effective_date'],
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);

            $rotation->shifts()->attach($validated['shift_ids']);

            if (!empty($validated['user_ids'])) {
                $rotation->users()->attach($validated['user_ids']);
            }

            return $rotation;
        });

        return response()->json(['data' => $rotation->load(['shifts', 'users'])], 201);
    }

    public function graceTimes(Request $request): JsonResponse
    {
        $query = GraceTime::with('shift');

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function updateGraceTime(Request $request, GraceTime $graceTime): JsonResponse
    {
        $validated = $request->validate([
            'grace_in_minutes' => 'required|integer|min:0|max:120',
            'grace_out_minutes' => 'required|integer|min:0|max:120',
            'apply_late' => 'boolean',
            'apply_early_exit' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $graceTime->update($validated);
        return response()->json(['data' => $graceTime->fresh()]);
    }

    public function breakTimes(Request $request, Shift $shift): JsonResponse
    {
        return response()->json(['data' => $shift->breakTimes()->latest()->get()]);
    }

    public function storeBreakTime(Request $request, Shift $shift): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'is_paid' => 'boolean',
        ]);

        $breakTime = $shift->breakTimes()->create($validated);
        return response()->json(['data' => $breakTime], 201);
    }

    public function weeklyOffs(Request $request): JsonResponse
    {
        $query = WeeklyOff::with(['shift', 'department']);

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function storeWeeklyOff(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'day_of_week' => 'required|integer|between:0,6',
            'shift_id' => 'nullable|exists:shifts,id',
            'department_id' => 'nullable|exists:departments,id',
            'is_alternate' => 'boolean',
            'effective_date' => 'required|date',
        ]);

        $weeklyOff = WeeklyOff::create($validated);
        return response()->json(['data' => $weeklyOff], 201);
    }
}
