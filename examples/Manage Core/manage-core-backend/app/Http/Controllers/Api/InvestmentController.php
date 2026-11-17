<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\InvestmentPortfolio;
use App\Models\InvestmentReturn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Investment::with(['portfolio']);

        if ($portfolioId = $request->input('portfolio_id')) {
            $query->where('portfolio_id', $portfolioId);
        }

        $investments = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $investments->items(),
            'meta' => [
                'total' => $investments->total(),
                'currentPage' => $investments->currentPage(),
                'lastPage' => $investments->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'portfolio_id' => 'required|exists:investment_portfolios,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'principal_amount' => 'required|numeric',
            'investment_date' => 'required|date',
            'status' => 'nullable|string|in:active,liquidated,matured',
        ]);

        $investment = Investment::create($validated + ['current_value' => $validated['principal_amount']]);

        return response()->json(['data' => $investment->load('portfolio')], 201);
    }

    public function addReturn(Request $request, Investment $investment): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'entry_date' => 'required|date',
            'type' => 'required|string',
        ]);

        $return = $investment->returns()->create($validated);

        return response()->json(['data' => $return], 201);
    }

    public function portfolios(): JsonResponse
    {
        return response()->json(['data' => InvestmentPortfolio::withCount('investments')->get()]);
    }

    public function stats(): JsonResponse
    {
        $totalInvested = Investment::sum('principal_amount');
        $currentValue = Investment::sum('current_value');
        $totalReturns = InvestmentReturn::sum('amount');
        
        $roi = $totalInvested > 0 ? (($currentValue + $totalReturns - $totalInvested) / $totalInvested) * 100 : 0;

        return response()->json([
            'data' => [
                'totalInvested' => $totalInvested,
                'portfolioValue' => $currentValue,
                'totalReturns' => $totalReturns,
                'roi' => round($roi, 2) . '%',
            ]
        ]);
    }
}
