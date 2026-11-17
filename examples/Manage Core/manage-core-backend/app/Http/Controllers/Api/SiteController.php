<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Site;
use App\Models\SiteAssignment;
use App\Models\SiteGeoFence;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Site::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('address', 'like', '%' . $request->search . '%');
            });
        }

        $sites = $query->withCount(['attendances', 'activeAssignments'])->latest()->get();
        return response()->json(['data' => $sites]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius' => 'nullable|integer|min:10',
            'qr_code' => 'nullable|string|unique:sites,qr_code',
            'status' => 'string|in:active,inactive',
            'timezone' => 'nullable|string|max:64',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['qr_code'])) {
            $validated['qr_code'] = Str::random(32);
        }

        $site = Site::create($validated);
        return response()->json(['data' => $site], 201);
    }

    public function show(Site $site): JsonResponse
    {
        return response()->json(['data' => $site->load(['geoFences', 'assignments.user', 'biometricDevices'])]);
    }

    public function update(Request $request, Site $site): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius' => 'nullable|integer|min:10',
            'status' => 'string|in:active,inactive',
            'timezone' => 'nullable|string|max:64',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $site->update($validated);
        return response()->json(['data' => $site->fresh()]);
    }

    public function destroy(Site $site): JsonResponse
    {
        if ($site->attendances()->exists()) {
            return response()->json(['message' => 'Cannot delete site with associated attendance records.'], 422);
        }

        $site->delete();
        return response()->json(null, 204);
    }

    public function assignSite(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'site_id' => 'required|exists:sites,id',
            'assigned_from' => 'required|date',
            'assigned_until' => 'nullable|date|after_or_equal:assigned_from',
            'is_primary' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $assignments = DB::transaction(function () use ($request) {
            $site = Site::findOrFail($request->site_id);
            $created = [];

            foreach ($request->user_ids as $userId) {
                if ($request->is_primary) {
                    SiteAssignment::where('user_id', $userId)
                        ->where('is_primary', true)
                        ->update(['is_primary' => false]);
                }

                $assignment = SiteAssignment::create([
                    'user_id' => $userId,
                    'site_id' => $site->id,
                    'assigned_from' => $request->assigned_from,
                    'assigned_until' => $request->assigned_until,
                    'is_primary' => $request->is_primary ?? false,
                    'notes' => $request->notes,
                    'assigned_by' => $request->user()->id,
                ]);

                $created[] = $assignment;
            }

            return $created;
        });

        return response()->json(['data' => $assignments], 201);
    }

    public function assignments(Request $request, Site $site): JsonResponse
    {
        $query = $site->assignments()->with('user');

        if ($request->has('active')) {
            $query->whereNull('end_date')
                  ->orWhere('end_date', '>=', Carbon::today());
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function geoFences(Request $request, Site $site): JsonResponse
    {
        return response()->json(['data' => $site->geoFences()->latest()->get()]);
    }

    public function storeGeoFence(Request $request, Site $site): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:circle,polygon,geofence',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|integer|min:10',
            'coordinates' => 'nullable|json',
            'is_active' => 'boolean',
            'restricted_entry' => 'boolean',
            'restricted_exit' => 'boolean',
            'time_restrictions' => 'nullable|json',
        ]);

        $geoFence = $site->geoFences()->create($validated);
        return response()->json(['data' => $geoFence], 201);
    }

    public function updateGeoFence(Request $request, SiteGeoFence $geoFence): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|in:circle,polygon,geofence',
            'latitude' => 'numeric|between:-90,90',
            'longitude' => 'numeric|between:-180,180',
            'radius' => 'nullable|integer|min:10',
            'coordinates' => 'nullable|json',
            'is_active' => 'boolean',
            'restricted_entry' => 'boolean',
            'restricted_exit' => 'boolean',
            'time_restrictions' => 'nullable|json',
        ]);

        $geoFence->update($validated);
        return response()->json(['data' => $geoFence->fresh()]);
    }

    public function deleteGeoFence(SiteGeoFence $geoFence): JsonResponse
    {
        $geoFence->delete();
        return response()->json(null, 204);
    }

    public function qrCode(Request $request, Site $site): JsonResponse
    {
        $site->update([
            'qr_code' => Str::random(32),
            'qr_generated_at' => now(),
        ]);

        return response()->json(['data' => [
            'site_id' => $site->id,
            'site_name' => $site->name,
            'qr_code' => $site->qr_code,
            'qr_generated_at' => $site->qr_generated_at,
        ]]);
    }

    public function validateQR(Request $request): JsonResponse
    {
        $request->validate([
            'qr_code' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $site = Site::where('qr_code', $request->qr_code)->first();

        if (!$site) {
            return response()->json(['message' => 'Invalid QR code.'], 404);
        }

        if ($site->status !== 'active') {
            return response()->json(['message' => 'Site is inactive.'], 403);
        }

        $result = [
            'valid' => true,
            'site' => $site,
            'within_radius' => null,
            'distance' => null,
        ];

        if ($request->latitude && $request->longitude && $site->latitude && $site->longitude) {
            $distance = $this->calculateDistance(
                $site->latitude, $site->longitude,
                $request->latitude, $request->longitude
            );

            $result['distance'] = round($distance, 2);
            $result['within_radius'] = $distance <= ($site->radius ?? 100);
        }

        return response()->json(['data' => $result]);
    }

    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|integer|min:50|max:50000',
        ]);

        $latitude = $request->latitude;
        $longitude = $request->longitude;
        $maxRadius = $request->radius ?? 1000;

        $sites = Site::where('status', 'active')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($site) use ($latitude, $longitude, $maxRadius) {
                $distance = $this->calculateDistance(
                    $latitude, $longitude,
                    $site->latitude, $site->longitude
                );

                $site->distance = round($distance, 2);
                $site->within_range = $distance <= $maxRadius;
                return $site;
            })
            ->where('within_range', true)
            ->sortBy('distance')
            ->values();

        return response()->json(['data' => $sites]);
    }

    public function stats(Request $request, Site $site): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();

        $attendances = $site->attendances()
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $total = $attendances->count();
        $present = $attendances->where('status', 'Present')->count();
        $late = $attendances->where('status', 'Late')->count();
        $absent = $attendances->where('status', 'Absent')->count();
        $halfDay = $attendances->where('status', 'Half Day')->count();

        $activeAssignments = $site->assignments()
            ->whereNull('end_date')
            ->orWhere('end_date', '>=', Carbon::today())
            ->count();

        return response()->json(['data' => [
            'site_id' => $site->id,
            'site_name' => $site->name,
            'period' => ['start' => $startDate->toDateString(), 'end' => $endDate->toDateString()],
            'total_records' => $total,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'half_day' => $halfDay,
            'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
            'active_assignments' => $activeAssignments,
        ]]);
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
