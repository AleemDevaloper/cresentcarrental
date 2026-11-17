<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankDetail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BankDetailController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = BankDetail::with('user');

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'bank_name' => 'required|string|max:255',
            'account_title' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'iban' => 'nullable|string|max:34',
            'branch_code' => 'nullable|string|max:20',
            'branch_name' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:11',
            'salary_transfer_method' => 'nullable|string|in:direct_deposit,wire_transfer,cheque,cash',
            'is_primary' => 'boolean',
        ]);

        $bankDetail = DB::transaction(function () use ($validated, $request) {
            if ($validated['is_primary'] ?? false) {
                BankDetail::where('user_id', $validated['user_id'])
                    ->where('is_primary', true)
                    ->update(['is_primary' => false]);
            }

            return BankDetail::create([
                'user_id' => $validated['user_id'],
                'bank_name' => $validated['bank_name'],
                'account_title' => $validated['account_title'],
                'account_number' => $validated['account_number'],
                'iban' => $validated['iban'] ?? null,
                'branch_code' => $validated['branch_code'] ?? null,
                'branch_name' => $validated['branch_name'] ?? null,
                'swift_code' => $validated['swift_code'] ?? null,
                'salary_transfer_method' => $validated['salary_transfer_method'] ?? 'direct_deposit',
                'is_primary' => $validated['is_primary'] ?? false,
                'added_by' => $request->user()->id,
            ]);
        });

        return response()->json(['data' => $bankDetail->load('user')], 201);
    }

    public function update(Request $request, BankDetail $bankDetail): JsonResponse
    {
        if ($bankDetail->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'bank_name' => 'string|max:255',
            'account_title' => 'string|max:255',
            'account_number' => 'string|max:50',
            'iban' => 'nullable|string|max:34',
            'branch_code' => 'nullable|string|max:20',
            'branch_name' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:11',
            'salary_transfer_method' => 'nullable|string|in:direct_deposit,wire_transfer,cheque,cash',
            'is_primary' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $bankDetail, $request) {
            if (($validated['is_primary'] ?? false) && !$bankDetail->is_primary) {
                BankDetail::where('user_id', $bankDetail->user_id)
                    ->where('is_primary', true)
                    ->update(['is_primary' => false]);
            }

            $bankDetail->update($validated);
        });

        return response()->json(['data' => $bankDetail->fresh()]);
    }

    public function destroy(BankDetail $bankDetail): JsonResponse
    {
        if ($bankDetail->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $bankDetail->delete();
        return response()->json(null, 204);
    }

    public function setPrimary(Request $request, BankDetail $bankDetail): JsonResponse
    {
        if ($bankDetail->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        DB::transaction(function () use ($bankDetail) {
            BankDetail::where('user_id', $bankDetail->user_id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);

            $bankDetail->update(['is_primary' => true]);
        });

        return response()->json(['data' => $bankDetail->fresh()]);
    }

    public function verify(Request $request, BankDetail $bankDetail): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'verification_status' => 'required|string|in:verified,rejected',
            'verification_notes' => 'nullable|string',
        ]);

        $bankDetail->update([
            'verification_status' => $validated['verification_status'],
            'verification_notes' => $validated['verification_notes'] ?? null,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        return response()->json(['data' => $bankDetail->fresh()]);
    }

    public function history(Request $request, BankDetail $bankDetail): JsonResponse
    {
        if ($bankDetail->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(['data' => $bankDetail->auditLogs()->latest()->get()]);
    }
}
