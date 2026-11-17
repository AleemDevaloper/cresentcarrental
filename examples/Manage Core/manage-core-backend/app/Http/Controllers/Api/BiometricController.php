<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\BiometricDevice;
use App\Models\BiometricPunchLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BiometricController extends Controller
{
    public function listDevices(): JsonResponse
    {
        $devices = BiometricDevice::with('site')
            ->withCount('punchLogs')
            ->latest()
            ->get();

        return response()->json(['data' => $devices]);
    }

    public function storeDevice(Request $request): JsonResponse
    {
        $this->authorizeAdminOrHr($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'vendor' => 'nullable|string|max:100',
            'device_code' => 'required|string|max:100|unique:biometric_devices,device_code',
            'serial_number' => 'nullable|string|max:150',
            'ip_address' => 'nullable|ip',
            'port' => 'nullable|integer|min:1|max:65535',
            'site_id' => 'nullable|exists:sites,id',
            'timezone' => 'nullable|string|max:100',
            'status' => 'nullable|in:active,inactive,maintenance',
        ]);

        $device = BiometricDevice::create($validated + [
            'vendor' => $validated['vendor'] ?? 'ZKTeco',
            'port' => $validated['port'] ?? 4370,
            'timezone' => $validated['timezone'] ?? 'Asia/Karachi',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json(['data' => $device->load('site')], 201);
    }

    public function updateDevice(Request $request, BiometricDevice $device): JsonResponse
    {
        $this->authorizeAdminOrHr($request);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'vendor' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:150',
            'ip_address' => 'nullable|ip',
            'port' => 'nullable|integer|min:1|max:65535',
            'site_id' => 'nullable|exists:sites,id',
            'timezone' => 'nullable|string|max:100',
            'status' => 'nullable|in:active,inactive,maintenance',
        ]);

        $device->update($validated);

        return response()->json(['data' => $device->fresh('site')]);
    }

    public function listPunchLogs(Request $request): JsonResponse
    {
        $query = BiometricPunchLog::with(['device.site', 'user', 'attendance'])->latest('punch_time');

        if ($request->filled('device_id')) {
            $query->where('biometric_device_id', $request->device_id);
        }

        if ($request->filled('sync_status')) {
            $query->where('sync_status', $request->sync_status);
        }

        if ($request->filled('date')) {
            $query->whereDate('punch_time', $request->date);
        }

        return response()->json(['data' => $query->limit(200)->get()]);
    }

    public function importPunches(Request $request): JsonResponse
    {
        $this->authorizeAdminOrHr($request);

        $validated = $request->validate([
            'device_id' => 'required|exists:biometric_devices,id',
            'punches' => 'required|array|min:1',
            'punches.*.employee_code' => 'required|string|max:100',
            'punches.*.punch_time' => 'required|date',
            'punches.*.punch_type' => 'nullable|in:auto,in,out,break,unknown',
            'punches.*.verify_mode' => 'nullable|string|max:100',
            'punches.*.work_code' => 'nullable|string|max:100',
            'punches.*.raw_payload' => 'nullable|array',
        ]);

        $device = BiometricDevice::findOrFail($validated['device_id']);
        $created = collect();

        DB::transaction(function () use ($validated, $device, &$created) {
            foreach ($validated['punches'] as $punch) {
                $user = User::where('emp_id', $punch['employee_code'])
                    ->orWhere('id', $punch['employee_code'])
                    ->first();

                $log = BiometricPunchLog::firstOrCreate(
                    [
                        'biometric_device_id' => $device->id,
                        'employee_code' => $punch['employee_code'],
                        'punch_time' => Carbon::parse($punch['punch_time']),
                    ],
                    [
                        'user_id' => $user?->id,
                        'punch_type' => $punch['punch_type'] ?? 'auto',
                        'verify_mode' => $punch['verify_mode'] ?? null,
                        'work_code' => $punch['work_code'] ?? null,
                        'source' => 'zkteco',
                        'raw_payload' => $punch['raw_payload'] ?? $punch,
                    ]
                );

                $created->push($this->syncPunchToAttendance($log->fresh('device')));
            }

            $device->update(['last_sync_at' => now()]);
        });

        return response()->json([
            'message' => "{$created->count()} punch log(s) received.",
            'data' => $created->values(),
        ], 201);
    }

    public function syncDevice(Request $request, BiometricDevice $device): JsonResponse
    {
        $this->authorizeAdminOrHr($request);

        $logs = $device->punchLogs()
            ->whereIn('sync_status', ['pending', 'failed'])
            ->oldest('punch_time')
            ->get()
            ->map(fn (BiometricPunchLog $log) => $this->syncPunchToAttendance($log));

        $device->update(['last_sync_at' => now()]);

        return response()->json([
            'message' => "{$logs->count()} punch log(s) synced.",
            'data' => $logs,
        ]);
    }

    private function syncPunchToAttendance(BiometricPunchLog $log): BiometricPunchLog
    {
        $user = $log->user ?: User::where('emp_id', $log->employee_code)
            ->orWhere('id', $log->employee_code)
            ->first();

        if (!$user) {
            $log->update([
                'sync_status' => 'failed',
                'sync_notes' => 'No employee matched this biometric employee code.',
            ]);

            return $log->fresh(['device.site', 'user', 'attendance']);
        }

        $punchTime = Carbon::parse($log->punch_time);
        $date = $punchTime->toDateString();
        $time = $punchTime->toTimeString();

        $attendance = Attendance::firstOrCreate(
            ['user_id' => $user->id, 'date' => $date],
            [
                'site_id' => $log->device?->site_id,
                'status' => 'Present',
                'verification_status' => 'verified',
                'verification_notes' => 'Created from biometric device punch.',
                'device_info' => $log->device?->device_code,
            ]
        );

        $updates = [
            'site_id' => $attendance->site_id ?: $log->device?->site_id,
            'verification_status' => 'verified',
            'verification_notes' => trim(($attendance->verification_notes ? $attendance->verification_notes . ' ' : '') . 'Synced from biometric punch log.'),
            'device_info' => $log->device?->device_code,
        ];

        if ($log->punch_type === 'in' || !$attendance->clock_in || $time < $attendance->clock_in) {
            $updates['clock_in'] = $time;
        }

        if ($log->punch_type === 'out' || ($attendance->clock_in && $time > $attendance->clock_in)) {
            $updates['clock_out'] = $time;
        }

        $attendance->update($updates);

        $log->update([
            'user_id' => $user->id,
            'attendance_id' => $attendance->id,
            'sync_status' => 'synced',
            'sync_notes' => 'Synced to attendance.',
        ]);

        return $log->fresh(['device.site', 'user', 'attendance']);
    }

    public function listMappings(Request $request): JsonResponse
    {
        $search = $request->get('search');
        $users = User::when($search, fn($q) => $q->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('emp_id', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        }))->orderBy('name')->get(['id', 'name', 'emp_id', 'email']);

        $devices = BiometricDevice::pluck('name', 'id');
        $deviceCodes = BiometricDevice::pluck('device_code', 'id');
        $lastPunches = BiometricPunchLog::select('user_id', 'biometric_device_id', 'employee_code')
            ->whereIn('user_id', $users->pluck('id')->filter())
            ->latest('punch_time')
            ->get()
            ->groupBy('user_id')
            ->map(fn($group) => $group->first());

        $data = $users->map(function ($user) use ($devices, $deviceCodes, $lastPunches) {
            $last = $lastPunches->get($user->id);
            return [
                'id' => $user->id,
                'name' => $user->name,
                'emp_id' => $user->emp_id,
                'email' => $user->email,
                'biometric_device_id' => $last?->biometric_device_id,
                'biometric_device_name' => $last ? ($devices[$last->biometric_device_id] ?? null) : null,
                'biometric_device_code' => $last ? ($deviceCodes[$last->biometric_device_id] ?? null) : null,
                'biometric_pin' => $last?->employee_code,
            ];
        });

        $stats = [
            'total' => $users->count(),
            'mapped' => $data->filter(fn($u) => $u['biometric_device_id'])->count(),
            'unmapped' => $data->filter(fn($u) => !$u['biometric_device_id'])->count(),
        ];

        return response()->json(['data' => $data, 'stats' => $stats]);
    }

    public function updateMapping(Request $request, User $user): JsonResponse
    {
        $this->authorizeAdminOrHr($request);

        $validated = $request->validate([
            'emp_id' => 'nullable|string|max:100',
            'biometric_device_id' => 'nullable|exists:biometric_devices,id',
            'pin' => 'nullable|string|max:50',
        ]);

        if (isset($validated['emp_id'])) {
            $user->update(['emp_id' => $validated['emp_id']]);
        }

        return response()->json(['data' => $user->fresh()]);
    }

    public function getPunchStats(Request $request): JsonResponse
    {
        $total = BiometricPunchLog::count();
        $synced = BiometricPunchLog::where('sync_status', 'synced')->count();
        $failed = BiometricPunchLog::where('sync_status', 'failed')->count();
        $pending = BiometricPunchLog::where('sync_status', 'pending')->count();
        $matchRate = $total > 0 ? round(($synced / $total) * 100, 1) : 0;

        return response()->json([
            'data' => [
                'total' => $total,
                'synced' => $synced,
                'failed' => $failed,
                'pending' => $pending,
                'match_rate' => $matchRate,
            ],
        ]);
    }

    private function authorizeAdminOrHr(Request $request): void
    {
        abort_unless(in_array($request->user()->role, ['Admin', 'HR'], true), 403, 'Unauthorized.');
    }
}
