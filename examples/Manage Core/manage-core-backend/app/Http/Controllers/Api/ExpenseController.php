<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ApprovalRequest;
use App\Models\ApprovalHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Expense::query();

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $perPage = $request->per_page ?? 50;
        $expenses = $query->with('user')->latest()->paginate($perPage);
        return response()->json([
            'data' => $expenses->items(),
            'pagination' => [
                'current_page' => $expenses->currentPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
                'last_page' => $expenses->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|in:Travel,Fuel,Medical,Meals,Office,Other',
            'description' => 'nullable|string',
            'expense_date' => 'required|date',
            'receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        $expense = DB::transaction(function() use ($request, $data) {
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $file = $request->file('receipt');
                $uploadPath = public_path('uploads/receipts');
                if (!is_dir($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                $filename = now()->format('YmdHis') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
                $receiptPath = 'uploads/receipts/' . $filename;
            }

            $expense = Expense::create([
                'user_id' => $request->user()->id,
                'amount' => $data['amount'],
                'category' => $data['category'],
                'description' => $data['description'] ?? null,
                'expense_date' => $data['expense_date'],
                'receipt_path' => $receiptPath,
                'status' => 'pending',
            ]);

            // Create Approval Request
            $approval = ApprovalRequest::create([
                'requester_id' => $request->user()->id,
                'type' => 'expense_claim',
                'approvable_id' => $expense->id,
                'approvable_type' => Expense::class,
                'reason' => $data['description'] ?? "Expense Claim for {$data['category']}",
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'pending',
                'metadata' => [
                    'amount' => $data['amount'],
                    'category' => $data['category'],
                    'expense_date' => $data['expense_date']
                ]
            ]);

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $request->user()->id,
                'action' => 'created',
                'note' => 'Expense claim submitted for approval.',
            ]);

            // Notify Admin/HR
            if (function_exists('notify')) {
                notify(
                    'New Expense Claim',
                    "A new expense claim of {$data['amount']} for {$data['category']} has been submitted by {$request->user()->name}.",
                    ['Admin', 'HR']
                );
            }

            return $expense;
        });

        return response()->json(['data' => $expense], 201);
    }

    public function updateStatus(Request $request, Expense $expense): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|string|in:approved,rejected,pending',
        ]);

        DB::transaction(function () use ($request, $expense, $data) {
            $expense->update($data);

            $approval = ApprovalRequest::where('approvable_type', Expense::class)
                ->where('approvable_id', $expense->id)
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
                    'note' => "Expense claim marked {$data['status']}.",
                ]);
            }
        });

        return response()->json(['data' => $expense->fresh('user')]);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        if ($expense->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($expense->status !== 'pending' && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Cannot delete non-pending expense claims.'], 422);
        }

        // Delete receipt file if exists
        if ($expense->receipt_path && file_exists(public_path($expense->receipt_path))) {
            @unlink(public_path($expense->receipt_path));
        }

        $expense->delete();
        return response()->json(['ok' => true]);
    }
}
