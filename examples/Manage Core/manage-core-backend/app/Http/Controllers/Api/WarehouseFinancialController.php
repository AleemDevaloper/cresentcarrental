<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WarehouseFinance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WarehouseFinancialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Warehouse::with(['manager']);

        $warehouses = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $warehouses->items(),
            'meta' => [
                'total' => $warehouses->total(),
                'currentPage' => $warehouses->currentPage(),
                'lastPage' => $warehouses->lastPage(),
            ]
        ]);
    }

    public function show(Warehouse $warehouse): JsonResponse
    {
        return response()->json(['data' => $warehouse->load(['manager', 'finances'])]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:active,inactive',
        ]);

        $warehouse = Warehouse::create($validated);

        return response()->json(['data' => $warehouse], 201);
    }

    public function addFinance(Request $request, Warehouse $warehouse): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:expense,revenue',
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'entry_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $finance = $warehouse->finances()->create($validated);

        return response()->json(['data' => $finance], 201);
    }

    public function stats(): JsonResponse
    {
        $totalCost = WarehouseFinance::where('type', 'expense')->sum('amount');
        $totalRevenue = WarehouseFinance::where('type', 'revenue')->sum('amount');
        
        $profitability = $totalRevenue - $totalCost;

        return response()->json([
            'data' => [
                'totalWarehouseCost' => $totalCost,
                'warehouseRevenue' => $totalRevenue,
                'warehouseProfitability' => $profitability,
                'totalWarehouses' => Warehouse::count(),
            ]
        ]);
    }
}
