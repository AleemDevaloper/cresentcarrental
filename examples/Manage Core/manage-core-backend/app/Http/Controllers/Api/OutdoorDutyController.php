<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OutdoorDuty;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OutdoorDutyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = OutdoorDuty::query();

        $user = $request->user();
        if ($user->role !== 'Admin' && $user->role !== 'HR' && $user->role !== 'super_admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id') && $request->user_id !== '') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from !== '') {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to !== '') {
            $query->where('date', '<=', $request->date_to);
        }

        $perPage = $request->per_page ?? 25;
        $duties = $query->with(['user', 'approver'])->latest()->paginate($perPage);

        return response()->json([
            'data' => $duties->items(),
            'pagination' => [
                'current_page' => $duties->currentPage(),
                'per_page' => $duties->perPage(),
                'total' => $duties->total(),
                'last_page' => $duties->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'purpose' => 'required|string|max:500',
            'location' => 'nullable|string|max:255',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',
            'notes' => 'nullable|string|max:1000',
        ]);

        $duty = DB::transaction(function () use ($validated, $request) {
            return OutdoorDuty::create([
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'purpose' => $validated['purpose'],
                'location' => $validated['location'] ?? null,
                'start_time' => $validated['start_time'] ?? null,
                'end_time' => $validated['end_time'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
            ]);
        });

        return response()->json([
            'data' => $duty->load(['user', 'approver']),
            'message' => 'Outdoor duty request submitted successfully.',
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $duty = OutdoorDuty::find($id);

        if (!$duty) {
            return response()->json(['message' => 'Outdoor duty not found.'], 404);
        }

        $user = $request->user();
        $isAdmin = in_array($user->role, ['Admin', 'HR', 'super_admin']);

        if (!$isAdmin && $duty->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!$isAdmin && $duty->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit non-pending outdoor duty.'], 422);
        }

        $validated = $request->validate([
            'date' => 'sometimes|required|date',
            'purpose' => 'sometimes|required|string|max:500',
            'location' => 'nullable|string|max:255',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:pending,approved,rejected',
        ]);

        if ($isAdmin && isset($validated['status'])) {
            $duty->update([
                'status' => $validated['status'],
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
            unset($validated['status']);
        }

        $duty->update($validated);

        return response()->json([
            'data' => $duty->fresh(['user', 'approver']),
            'message' => 'Outdoor duty updated successfully.',
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $duty = OutdoorDuty::find($id);

        if (!$duty) {
            return response()->json(['message' => 'Outdoor duty not found.'], 404);
        }

        $user = $request->user();
        $isAdmin = in_array($user->role, ['Admin', 'HR', 'super_admin']);

        if (!$isAdmin && $duty->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!$isAdmin && $duty->status !== 'pending') {
            return response()->json(['message' => 'Cannot delete non-pending outdoor duty.'], 422);
        }

        $duty->delete();

        return response()->json([
            'message' => 'Outdoor duty deleted successfully.',
        ]);
    }
}
