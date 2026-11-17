<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Overtime;
use App\Models\Attendance;
use App\Models\EmployeeSalary;
use App\Models\ApprovalRequest;
use App\Models\ApprovalHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OvertimeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Overtime::query();

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $perPage = $request->per_page ?? 50;
        $overtimes = $query->with(['user', 'attendance'])->latest()->paginate($perPage);
        return response()->json([
            'data' => $overtimes->items(),
            'pagination' => [
                'current_page' => $overtimes->currentPage(),
                'per_page' => $overtimes->perPage(),
                'total' => $overtimes->total(),
                'last_page' => $overtimes->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.1|max:16',
            'description' => 'required|string',
            'rate' => 'nullable|numeric|min:1.0|max:3.0',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        $overtime = DB::transaction(function() use ($request, $data) {
            $userId = $request->user()->id;
            $rate = $data['rate'] ?? 1.50;

            // Calculate amount based on employee base salary
            $empSalary = EmployeeSalary::where('user_id', $userId)->first();
            $baseAmount = $empSalary ? $empSalary->base_amount : 0;
            $hourlyRate = $baseAmount > 0 ? ($baseAmount / 176) : 0; // standard 22 days * 8 hours
            $amount = $data['hours'] * $hourlyRate * $rate;

            $overtime = Overtime::create([
                'user_id' => $userId,
                'date' => $data['date'],
                'hours' => $data['hours'],
                'rate' => $rate,
                'amount' => round($amount, 2),
                'type' => 'manual',
                'status' => 'pending',
                'description' => $data['description'],
            ]);

            // Create Approval Request
            $approval = ApprovalRequest::create([
                'requester_id' => $userId,
                'type' => 'overtime_request',
                'approvable_id' => $overtime->id,
                'approvable_type' => Overtime::class,
                'reason' => $data['description'],
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'pending',
                'metadata' => [
                    'hours' => $data['hours'],
                    'rate' => $rate,
                    'amount' => round($amount, 2),
                    'date' => $data['date']
                ]
            ]);

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $userId,
                'action' => 'created',
                'note' => 'Overtime request submitted for approval.',
            ]);

            // Notify Admin/HR
            if (function_exists('notify')) {
                notify(
                    'New Overtime Request',
                    "{$request->user()->name} has requested {$data['hours']} hours of overtime.",
                    ['Admin', 'HR']
                );
            }

            return $overtime;
        });

        return response()->json(['data' => $overtime], 201);
    }

    public function autoDetect(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $attendances = Attendance::with(['shift', 'user'])
            ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
            ->whereNotNull('clock_in')
            ->whereNotNull('clock_out')
            ->whereNotNull('shift_id')
            ->get();

        $detectedCount = 0;
        $overtimesCreated = [];

        foreach ($attendances as $attendance) {
            $shift = $attendance->shift;
            if (!$shift || !$shift->is_overtime_eligible) {
                continue;
            }

            // Calculate shift duration in minutes
            $shiftStart = Carbon::parse($shift->start_time);
            $shiftEnd = Carbon::parse($shift->end_time);
            if ($shiftEnd->lt($shiftStart)) {
                $shiftEnd->addDay(); // handles overnight shift
            }
            $shiftDurationMinutes = $shiftEnd->diffInMinutes($shiftStart);

            // Calculate actual worked duration in minutes
            $clockIn = Carbon::parse($attendance->clock_in);
            $clockOut = Carbon::parse($attendance->clock_out);
            if ($clockOut->lt($clockIn)) {
                $clockOut->addDay(); // handles overnight clocking
            }
            $actualDurationMinutes = $clockOut->diffInMinutes($clockIn);

            // Calculate overtime minutes if work exceeds shift duration + grace period
            $graceOut = $shift->grace_period_out ?? 15;
            $overtimeMinutes = $actualDurationMinutes - $shiftDurationMinutes;

            if ($overtimeMinutes > $graceOut) {
                $overtimeHours = round($overtimeMinutes / 60, 2);

                // Check if overtime record already exists for this attendance
                $exists = Overtime::where('user_id', $attendance->user_id)
                    ->where('date', $attendance->date)
                    ->exists();

                if (!$exists && $overtimeHours >= 0.5) { // Minimum 30 mins to qualify
                    // Calculate amount based on base salary
                    $empSalary = EmployeeSalary::where('user_id', $attendance->user_id)->first();
                    $baseAmount = $empSalary ? $empSalary->base_amount : 0;
                    $hourlyRate = $baseAmount > 0 ? ($baseAmount / 176) : 0;
                    $rate = 1.50; // standard OT rate
                    $amount = $overtimeHours * $hourlyRate * $rate;

                    $overtime = Overtime::create([
                        'user_id' => $attendance->user_id,
                        'date' => $attendance->date,
                        'hours' => $overtimeHours,
                        'rate' => $rate,
                        'amount' => round($amount, 2),
                        'type' => 'automated',
                        'status' => 'pending', // pending approval
                        'description' => "Auto-detected overtime: Worked {$overtimeHours} hours beyond shift time.",
                        'attendance_id' => $attendance->id,
                    ]);

                    // Create Approval Request
                    $approval = ApprovalRequest::create([
                        'requester_id' => $attendance->user_id,
                        'type' => 'overtime_request',
                        'approvable_id' => $overtime->id,
                        'approvable_type' => Overtime::class,
                        'reason' => $overtime->description,
                        'priority' => 'low',
                        'status' => 'pending',
                        'metadata' => [
                            'hours' => $overtimeHours,
                            'rate' => $rate,
                            'amount' => round($amount, 2),
                            'date' => $attendance->date,
                            'attendance_id' => $attendance->id
                        ]
                    ]);

                    ApprovalHistory::create([
                        'approval_request_id' => $approval->id,
                        'user_id' => $attendance->user_id,
                        'action' => 'created',
                        'note' => 'System detected overtime from attendance records.',
                    ]);

                    $overtimesCreated[] = $overtime->load('user');
                    $detectedCount++;
                }
            }
        }

        return response()->json([
            'message' => "Successfully detected {$detectedCount} overtime incidents.",
            'data' => $overtimesCreated
        ]);
    }

    public function updateStatus(Request $request, Overtime $overtime): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|string|in:approved,rejected,pending',
        ]);

        DB::transaction(function () use ($request, $overtime, $data) {
            $overtime->update($data);

            $approval = ApprovalRequest::where('approvable_type', Overtime::class)
                ->where('approvable_id', $overtime->id)
                ->latest()
                ->first();

            if ($approval) {
                $approval->update([
                    'status' => $data['status'],
                    'approver_id' => $request->user()->id,
                ]);

                ApprovalHistory::create([
                    'approval_request_id' => $approval->id,
                    'user_id' => $request->user()->id,
                    'action' => $data['status'],
                    'note' => "Overtime request marked {$data['status']}.",
                ]);
            }
        });

        return response()->json(['data' => $overtime->fresh(['user', 'attendance'])]);
    }

    public function destroy(Overtime $overtime): JsonResponse
    {
        if ($overtime->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($overtime->status !== 'pending' && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Cannot delete non-pending overtime records.'], 422);
        }

        $overtime->delete();
        return response()->json(['ok' => true]);
    }
}
