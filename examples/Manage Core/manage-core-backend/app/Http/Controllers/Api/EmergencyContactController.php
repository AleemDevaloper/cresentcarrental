<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmergencyContact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmergencyContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = EmergencyContact::query();

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json(['data' => $query->orderBy('priority')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'priority' => 'nullable|integer|min:1|max:10',
            'is_primary' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $contact = DB::transaction(function () use ($validated, $request) {
            if ($validated['is_primary'] ?? false) {
                EmergencyContact::where('user_id', $validated['user_id'])
                    ->where('is_primary', true)
                    ->update(['is_primary' => false, 'priority' => 99]);
            }

            $maxPriority = EmergencyContact::where('user_id', $validated['user_id'])->max('priority');
            $validated['priority'] = $validated['priority'] ?? ($maxPriority ? $maxPriority + 1 : 1);

            return EmergencyContact::create([
                'user_id' => $validated['user_id'],
                'name' => $validated['name'],
                'relationship' => $validated['relationship'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
                'priority' => $validated['priority'],
                'is_primary' => $validated['is_primary'] ?? false,
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json(['data' => $contact], 201);
    }

    public function update(Request $request, EmergencyContact $emergencyContact): JsonResponse
    {
        if ($emergencyContact->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'relationship' => 'string|max:100',
            'phone' => 'string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'priority' => 'integer|min:1|max:10',
            'is_primary' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $emergencyContact, $request) {
            if (($validated['is_primary'] ?? false) && !$emergencyContact->is_primary) {
                EmergencyContact::where('user_id', $emergencyContact->user_id)
                    ->where('is_primary', true)
                    ->update(['is_primary' => false, 'priority' => 99]);
            }

            $emergencyContact->update($validated);
        });

        return response()->json(['data' => $emergencyContact->fresh()]);
    }

    public function destroy(EmergencyContact $emergencyContact): JsonResponse
    {
        if ($emergencyContact->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $emergencyContact->delete();
        return response()->json(null, 204);
    }

    public function setPriority(Request $request, EmergencyContact $emergencyContact): JsonResponse
    {
        if ($emergencyContact->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate(['priority' => 'required|integer|min:1|max:10']);

        DB::transaction(function () use ($request, $emergencyContact) {
            $conflict = EmergencyContact::where('user_id', $emergencyContact->user_id)
                ->where('priority', $request->priority)
                ->where('id', '!=', $emergencyContact->id)
                ->first();

            if ($conflict) {
                $conflict->update(['priority' => $emergencyContact->priority]);
            }

            $emergencyContact->update(['priority' => $request->priority]);
        });

        $ordered = EmergencyContact::where('user_id', $emergencyContact->user_id)
            ->orderBy('priority')
            ->get()
            ->each(function ($contact, $index) {
                $contact->update(['priority' => $index + 1]);
            });

        return response()->json(['data' => $ordered]);
    }
}
