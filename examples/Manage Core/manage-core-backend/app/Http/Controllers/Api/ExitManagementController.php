<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resignation;
use App\Models\AssetClearance;
use App\Models\HrmsExitClearanceStage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ExitManagementController extends Controller
{
    public function listResignations(): JsonResponse
    {
        return response()->json(['data' => Resignation::with(['user', 'clearanceStages.processedBy'])->latest()->get()]);
    }

    public function storeResignation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'resignation_date' => 'required|date',
            'last_working_day' => 'nullable|date',
            'reason' => 'required|string',
            'notice_period_days' => 'integer|min:0'
        ]);

        DB::beginTransaction();
        try {
            $resignation = Resignation::create($validated + ['status' => 'pending']);
            
            // Auto-create clearance stages
            $departments = ['IT', 'HR', 'Admin', 'Finance', 'Manager'];
            foreach ($departments as $dept) {
                HrmsExitClearanceStage::create([
                    'resignation_id' => $resignation->id,
                    'department' => $dept,
                    'status' => 'pending'
                ]);
            }

            DB::commit();
            return response()->json(['data' => $resignation->load('clearanceStages')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateResignationStatus(Request $request, Resignation $resignation): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'last_working_day' => 'nullable|date',
            'settlement_status' => 'nullable|in:pending,processing,settled',
            'final_settlement_amount' => 'nullable|numeric'
        ]);

        $resignation->update($validated);

        if ($validated['status'] === 'approved' && $resignation->last_working_day) {
            $user = User::find($resignation->user_id);
            $user->update(['exit_date' => $resignation->last_working_day, 'status' => 'Resigned']);
        }

        return response()->json(['data' => $resignation]);
    }

    public function updateClearanceStage(Request $request, HrmsExitClearanceStage $stage): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'comments' => 'nullable|string'
        ]);

        $stage->update($validated + [
            'processed_by' => $request->user()->id,
            'processed_at' => now()
        ]);

        return response()->json(['data' => $stage]);
    }

    public function listClearances(Request $request): JsonResponse
    {
        $query = AssetClearance::with('user');
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        return response()->json(['data' => $query->get()]);
    }

    public function storeClearance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'asset_name' => 'required|string',
            'asset_code' => 'nullable|string',
        ]);

        $clearance = AssetClearance::create($validated + ['status' => 'pending']);
        return response()->json(['data' => $clearance], 201);
    }

    public function updateClearance(Request $request, AssetClearance $clearance): JsonResponse
    {
        $validated = $request->validate([
            'return_date' => 'required|date',
            'condition' => 'required|string',
            'status' => 'required|in:cleared,pending'
        ]);

        $clearance->update($validated);
        return response()->json(['data' => $clearance]);
    }

    public function stats(): JsonResponse
    {
        return response()->json(['data' => [
            'pending_resignations' => Resignation::where('status', 'pending')->count(),
            'pending_clearances' => AssetClearance::where('status', 'pending')->count(),
            'exited_this_month' => User::whereNotNull('exit_date')
                ->whereMonth('exit_date', now()->month)
                ->count(),
        ]]);
    }
}
