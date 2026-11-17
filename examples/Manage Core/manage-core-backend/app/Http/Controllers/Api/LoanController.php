<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\EmiSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Loan::with(['user']);

        if ($search = $request->input('search')) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('lender_name', 'like', "%{$search}%");
        }

        $loans = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $loans->items(),
            'meta' => [
                'total' => $loans->total(),
                'currentPage' => $loans->currentPage(),
                'lastPage' => $loans->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'lender_name' => 'required|string',
            'loan_type' => 'required|string',
            'amount' => 'required|numeric',
            'interest_rate' => 'required|numeric',
            'repayment_months' => 'required|integer',
            'start_date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        return DB::transaction(function() use ($validated) {
            // Simple EMI calculation (Monthly Reducing Balance)
            $principal = $validated['amount'];
            $rate = ($validated['interest_rate'] / 100) / 12;
            $n = $validated['repayment_months'];
            
            if ($rate > 0) {
                $emi = ($principal * $rate * pow(1 + $rate, $n)) / (pow(1 + $rate, $n) - 1);
            } else {
                $emi = $principal / $n;
            }

            $loan = Loan::create($validated + [
                'emi_amount' => $emi,
                'outstanding_balance' => $principal,
                'status' => 'active'
            ]);

            // Generate EMI Schedule
            $currentPrincipal = $principal;
            for ($i = 1; $i <= $n; $i++) {
                $interestComp = $currentPrincipal * $rate;
                $principalComp = $emi - $interestComp;
                $currentPrincipal -= $principalComp;

                $loan->emiSchedules()->create([
                    'emi_number' => $i,
                    'due_date' => Carbon::parse($validated['start_date'])->addMonths($i),
                    'principal_component' => $principalComp,
                    'interest_component' => $interestComp,
                    'total_amount' => $emi,
                    'status' => 'pending'
                ]);
            }

            return response()->json(['data' => $loan->load('emiSchedules')], 201);
        });
    }

    public function payEmi(Request $request, EmiSchedule $emi): JsonResponse
    {
        if ($emi->status === 'paid') {
            return response()->json(['message' => 'EMI already paid'], 422);
        }

        return DB::transaction(function() use ($emi) {
            $emi->update([
                'status' => 'paid',
                'paid_at' => now()
            ]);

            $loan = $emi->loan;
            $loan->decrement('outstanding_balance', $emi->principal_component);

            if ($loan->outstanding_balance <= 0) {
                $loan->update(['status' => 'closed', 'outstanding_balance' => 0]);
            }

            return response()->json(['data' => $emi]);
        });
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'activeLoans' => Loan::where('status', 'active')->count(),
                'totalOutstanding' => Loan::sum('outstanding_balance'),
                'monthlyLiability' => Loan::where('status', 'active')->sum('emi_amount'),
                'upcomingEmis' => EmiSchedule::where('status', 'pending')
                    ->whereBetween('due_date', [now(), now()->addDays(30)])
                    ->count(),
            ]
        ]);
    }
}
