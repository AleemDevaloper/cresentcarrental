<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Site;
use App\Models\Shift;
use App\Models\User;
use App\Models\AttendanceCorrection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Attendance::query();

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        }

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        $attendance = $query->with(['user', 'site', 'shift'])->latest('date')->paginate($request->per_page ?? 50);
        return response()->json(['data' => $attendance]);
    }

    public function clockIn(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $request->validate([
            'site_id' => 'nullable|exists:sites,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'selfie' => 'nullable|image|max:2048',
            'device_info' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $existing = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->clock_in) {
            return response()->json(['message' => 'Already clocked in today.'], 422);
        }

        $verificationStatus = 'verified';
        $notes = [];

        if ($request->site_id && $request->latitude && $request->longitude) {
            $site = Site::find($request->site_id);
            if ($site && $site->latitude && $site->longitude) {
                $distance = $this->calculateDistance(
                    $site->latitude, $site->longitude,
                    $request->latitude, $request->longitude
                );

                if ($distance > ($site->radius ?? 100)) {
                    $verificationStatus = 'pending';
                    $notes[] = 'Clocked in outside site radius (' . round($distance) . 'm away).';
                }
            }
        }

        $selfiePath = null;
        if ($request->hasFile('selfie')) {
            $selfiePath = $request->file('selfie')->store('attendance/selfies', 'public');
        }

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'site_id' => $request->site_id,
                'shift_id' => $request->shift_id,
                'clock_in' => Carbon::now()->toTimeString(),
                'latitude_in' => $request->latitude,
                'longitude_in' => $request->longitude,
                'selfie_in' => $selfiePath,
                'device_info' => $request->device_info,
                'ip_address' => $request->ip(),
                'verification_status' => $verificationStatus,
                'verification_notes' => implode('. ', $notes),
                'notes' => $request->notes,
                'status' => 'Present',
            ]
        );

        return response()->json(['data' => $attendance->load(['site', 'shift'])]);
    }

    public function clockOut(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $request->validate([
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'selfie' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
        ]);

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->clock_in) {
            return response()->json(['message' => 'Must clock in before clocking out.'], 422);
        }

        if ($attendance->clock_out) {
            return response()->json(['message' => 'Already clocked out today.'], 422);
        }

        $selfiePath = null;
        if ($request->hasFile('selfie')) {
            $selfiePath = $request->file('selfie')->store('attendance/selfies', 'public');
        }

        $attendance->update([
            'clock_out' => Carbon::now()->toTimeString(),
            'latitude_out' => $request->latitude,
            'longitude_out' => $request->longitude,
            'selfie_out' => $selfiePath,
            'notes' => $request->notes,
        ]);

        $this->calculateWorkHours($attendance);

        return response()->json(['data' => $attendance->load(['site', 'shift'])]);
    }

    public function qrClockIn(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $request->validate([
            'qr_code' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'selfie' => 'nullable|image|max:2048',
            'device_info' => 'nullable|string',
        ]);

        $site = Site::where('qr_code', $request->qr_code)->first();

        if (!$site) {
            return response()->json(['message' => 'Invalid QR code.'], 404);
        }

        if ($site->status !== 'active') {
            return response()->json(['message' => 'Site is inactive.'], 403);
        }

        $existing = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->clock_in) {
            return response()->json(['message' => 'Already clocked in today.'], 422);
        }

        $verificationStatus = 'verified';
        $notes = [];

        if ($request->latitude && $request->longitude && $site->latitude && $site->longitude) {
            $distance = $this->calculateDistance(
                $site->latitude, $site->longitude,
                $request->latitude, $request->longitude
            );

            if ($distance > ($site->radius ?? 100)) {
                $verificationStatus = 'pending';
                $notes[] = 'QR clock-in outside site radius (' . round($distance) . 'm away).';
            }
        }

        $selfiePath = null;
        if ($request->hasFile('selfie')) {
            $selfiePath = $request->file('selfie')->store('attendance/selfies', 'public');
        }

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'site_id' => $site->id,
                'clock_in' => Carbon::now()->toTimeString(),
                'latitude_in' => $request->latitude,
                'longitude_in' => $request->longitude,
                'selfie_in' => $selfiePath,
                'device_info' => $request->device_info,
                'ip_address' => $request->ip(),
                'verification_status' => $verificationStatus,
                'verification_notes' => implode('. ', $notes),
                'status' => 'Present',
                'source' => 'qr',
            ]
        );

        return response()->json(['data' => $attendance->load(['site'])]);
    }

    public function supervisorClockIn(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'clock_in' => 'required',
            'clock_out' => 'nullable',
            'site_id' => 'nullable|exists:sites,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'status' => 'nullable|string|in:Present,Absent,Late,Half Day,Holiday',
            'notes' => 'nullable|string',
        ]);

        $attendance = DB::transaction(function () use ($request) {
            return Attendance::updateOrCreate(
                ['user_id' => $request->user_id, 'date' => $request->date],
                [
                    'clock_in' => $request->clock_in,
                    'clock_out' => $request->clock_out,
                    'site_id' => $request->site_id,
                    'shift_id' => $request->shift_id,
                    'status' => $request->status ?? 'Present',
                    'notes' => $request->notes,
                    'marked_by' => $request->user()->id,
                    'verification_status' => 'verified',
                    'source' => 'supervisor',
                ]
            );
        });

        if ($request->clock_out) {
            $this->calculateWorkHours($attendance);
        }

        return response()->json(['data' => $attendance->fresh()->load(['user', 'site', 'shift'])]);
    }

    public function gpsValidate(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'site_id' => 'required|exists:sites,id',
        ]);

        $site = Site::findOrFail($request->site_id);

        if (!$site->latitude || !$site->longitude) {
            return response()->json(['message' => 'Site has no GPS coordinates configured.'], 422);
        }

        $distance = $this->calculateDistance(
            $site->latitude, $site->longitude,
            $request->latitude, $request->longitude
        );

        $withinRadius = $distance <= ($site->radius ?? 100);

        return response()->json(['data' => [
            'site_id' => $site->id,
            'site_name' => $site->name,
            'site_latitude' => $site->latitude,
            'site_longitude' => $site->longitude,
            'user_latitude' => $request->latitude,
            'user_longitude' => $request->longitude,
            'distance' => round($distance, 2),
            'within_radius' => $withinRadius,
            'radius_setting' => $site->radius ?? 100,
        ]]);
    }

    public function photoHistory(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Attendance::whereNotNull('selfie_in');

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $records = $query->with('user')
            ->latest('date')
            ->paginate($request->per_page ?? 20)
            ->through(function ($record) {
                return [
                    'id' => $record->id,
                    'user_id' => $record->user_id,
                    'user_name' => $record->user->name,
                    'date' => $record->date,
                    'clock_in' => $record->clock_in,
                    'clock_out' => $record->clock_out,
                    'selfie_in' => $record->selfie_in ? Storage::url($record->selfie_in) : null,
                    'selfie_out' => $record->selfie_out ? Storage::url($record->selfie_out) : null,
                    'verification_status' => $record->verification_status,
                ];
            });

        return response()->json(['data' => $records]);
    }

    public function redZone(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $perPage = $request->per_page ?? 50;
        $records = Attendance::whereBetween('date', [$request->start_date, $request->end_date])
            ->where(function ($q) {
                $q->where('verification_status', 'pending')
                  ->orWhereNull('clock_out')
                  ->orWhere('status', 'Absent');
            })
            ->with('user')
            ->latest('date')
            ->paginate($perPage);

        return response()->json(['data' => $records]);
    }

    public function dailyReport(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'date' => 'required|date',
            'site_id' => 'nullable|exists:sites,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $date = $request->date;

        $userQuery = User::where('status', 'Active');

        if ($request->department_id) {
            $userQuery->whereHas('profile', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        $perPage = $request->per_page ?? 50;
        $users = $userQuery->paginate($perPage);
        $attendances = Attendance::where('date', $date)
            ->when($request->site_id, function ($q) use ($request) {
                $q->where('site_id', $request->site_id);
            })
            ->get()
            ->keyBy('user_id');

        $report = collect($users->items())->map(function ($user) use ($attendances, $date) {
            $record = $attendances->get($user->id);

            return [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'emp_id' => $user->emp_id,
                'department' => optional($user->profile)->department_id,
                'date' => $date,
                'clock_in' => optional($record)->clock_in,
                'clock_out' => optional($record)->clock_out,
                'status' => optional($record)->status ?? 'Absent',
                'verification_status' => optional($record)->verification_status,
                'working_hours' => optional($record)->working_hours,
                'site' => optional(optional($record)->site)->name,
                'shift' => optional(optional($record)->shift)->name,
            ];
        })->values();

        $summary = [
            'total_employees' => $users->count(),
            'present' => $report->where('status', 'Present')->count(),
            'late' => $report->where('status', 'Late')->count(),
            'absent' => $report->where('status', 'Absent')->count(),
            'half_day' => $report->where('status', 'Half Day')->count(),
            'holiday' => $report->where('status', 'Holiday')->count(),
        ];

        return response()->json(['data' => [
            'date' => $date,
            'summary' => $summary,
            'records' => $report,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]]);
    }

    public function monthlyReport(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|between:2000,2100',
            'user_id' => 'nullable|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $startDate = Carbon::createFromDate($request->year, $request->month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $userQuery = User::where('status', 'Active');

        if ($request->department_id) {
            $userQuery->whereHas('profile', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->user_id) {
            $userQuery->where('id', $request->user_id);
        }

        $perPage = $request->per_page ?? 50;
        $users = $userQuery->paginate($perPage);
        $attendances = Attendance::whereBetween('date', [$startDate, $endDate])
            ->get()
            ->groupBy('user_id');

        $report = collect($users->items())->map(function ($user) use ($attendances, $startDate) {
            $userRecords = $attendances->get($user->id, collect());
            $totalDays = $startDate->daysInMonth;
            $presentDays = $userRecords->where('status', 'Present')->count();
            $lateDays = $userRecords->where('status', 'Late')->count();
            $absentDays = $userRecords->where('status', 'Absent')->count();
            $halfDays = $userRecords->where('status', 'Half Day')->count();

            $totalWorkSeconds = $userRecords->sum(function ($r) {
                if ($r->working_hours) {
                    $parts = explode(':', $r->working_hours);
                    return (int)$parts[0] * 3600 + (int)$parts[1] * 60 + (int)($parts[2] ?? 0);
                }
                return 0;
            });

            return [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'emp_id' => $user->emp_id,
                'total_days' => $totalDays,
                'present' => $presentDays,
                'late' => $lateDays,
                'absent' => $absentDays,
                'half_day' => $halfDays,
                'total_working_hours' => gmdate('H:i:s', $totalWorkSeconds),
                'attendance_rate' => $totalDays > 0 ? round((($presentDays + $lateDays + $halfDays) / $totalDays) * 100, 2) : 0,
            ];
        })->values();

        $summary = [
            'month' => $request->month,
            'year' => $request->year,
            'total_employees' => $users->count(),
            'average_attendance_rate' => $report->count() > 0 ? round($report->avg('attendance_rate'), 2) : 0,
        ];

        return response()->json(['data' => [
            'summary' => $summary,
            'records' => $report,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]]);
    }

    public function corrections(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = AttendanceCorrection::with(['attendance', 'requestor']);

        if ($user->role !== 'Admin') {
            $query->where('requestor_id', $user->id)
                  ->orWhereHas('attendance', function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->paginate($request->per_page ?? 20)]);
    }

    public function bulkAttendance(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'records' => 'required|array|min:1',
            'records.*.user_id' => 'required|exists:users,id',
            'records.*.date' => 'required|date',
            'records.*.clock_in' => 'required',
            'records.*.clock_out' => 'nullable',
            'records.*.status' => 'nullable|string|in:Present,Absent,Late,Half Day',
            'records.*.site_id' => 'nullable|exists:sites,id',
            'records.*.notes' => 'nullable|string',
        ]);

        $created = DB::transaction(function () use ($request) {
            $results = [];

            foreach ($request->records as $record) {
                $attendance = Attendance::updateOrCreate(
                    ['user_id' => $record['user_id'], 'date' => $record['date']],
                    [
                        'clock_in' => $record['clock_in'],
                        'clock_out' => $record['clock_out'] ?? null,
                        'site_id' => $record['site_id'] ?? null,
                        'status' => $record['status'] ?? 'Present',
                        'notes' => $record['notes'] ?? null,
                        'marked_by' => $request->user()->id,
                        'verification_status' => 'verified',
                        'source' => 'bulk',
                    ]
                );

                if (!empty($record['clock_out'])) {
                    $this->calculateWorkHours($attendance);
                }

                $results[] = $attendance;
            }

            return $results;
        });

        return response()->json(['data' => $created, 'meta' => ['total' => count($created)]], 201);
    }

    public function checkStatus(Request $request): JsonResponse
    {
        $userId = $request->has('user_id') && $request->user()->role === 'Admin'
            ? $request->user_id
            : $request->user()->id;

        $today = Carbon::today()->toDateString();
        $record = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->with(['site', 'shift'])
            ->first();

        if (!$record) {
            return response()->json(['data' => [
                'clocked_in' => false,
                'clocked_out' => false,
                'status' => 'Not Started',
                'date' => $today,
            ]]);
        }

        return response()->json(['data' => [
            'clocked_in' => (bool) $record->clock_in,
            'clocked_out' => (bool) $record->clock_out,
            'status' => $record->status,
            'clock_in' => $record->clock_in,
            'clock_out' => $record->clock_out,
            'working_hours' => $record->working_hours,
            'site' => optional($record->site)->name,
            'shift' => optional($record->shift)->name,
            'verification_status' => $record->verification_status,
            'date' => $today,
        ]]);
    }

    private function calculateWorkHours(Attendance $attendance): void
    {
        if ($attendance->clock_in && $attendance->clock_out) {
            $clockIn = Carbon::parse($attendance->clock_in);
            $clockOut = Carbon::parse($attendance->clock_out);
            $diff = $clockIn->diff($clockOut);
            $attendance->update(['working_hours' => $diff->format('%H:%I:%S')]);
        }
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371000;

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
