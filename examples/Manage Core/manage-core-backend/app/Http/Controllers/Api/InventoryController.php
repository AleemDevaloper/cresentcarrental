<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryCost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = InventoryItem::with(['costs' => function($q) {
            $q->latest('effective_date');
        }]);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
        }

        $items = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'total' => $items->total(),
                'currentPage' => $items->currentPage(),
                'lastPage' => $items->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:inventory_items,sku',
            'category' => 'nullable|string',
            'unit' => 'nullable|string',
            'description' => 'nullable|string',
            'unit_cost' => 'required|numeric',
            'effective_date' => 'required|date',
            'vendor_reference' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $item = InventoryItem::create([
                'name' => $validated['name'],
                'sku' => $validated['sku'],
                'category' => $validated['category'] ?? null,
                'unit' => $validated['unit'] ?? 'unit',
                'description' => $validated['description'] ?? null,
            ]);

            $item->costs()->create([
                'unit_cost' => $validated['unit_cost'],
                'effective_date' => $validated['effective_date'],
                'vendor_reference' => $validated['vendor_reference'] ?? null,
            ]);

            return response()->json(['data' => $item->load('costs')], 201);
        });
    }

    public function addCost(Request $request, InventoryItem $item): JsonResponse
    {
        $validated = $request->validate([
            'unit_cost' => 'required|numeric',
            'effective_date' => 'required|date',
            'vendor_reference' => 'nullable|string',
        ]);

        $prevCost = $item->costs()->latest('effective_date')->first();
        $variance = $prevCost ? (($validated['unit_cost'] - $prevCost->unit_cost) / $prevCost->unit_cost) * 100 : 0;

        $cost = $item->costs()->create([
            'unit_cost' => $validated['unit_cost'],
            'prev_cost' => $prevCost?->unit_cost,
            'variance' => $variance,
            'effective_date' => $validated['effective_date'],
            'vendor_reference' => $validated['vendor_reference'] ?? null,
        ]);

        return response()->json(['data' => $cost], 201);
    }

    public function stats(): JsonResponse
    {
        $totalItems = InventoryItem::count();
        $avgCostIncrease = InventoryCost::whereNotNull('variance')->avg('variance') ?? 0;
        $totalValue = DB::table('inventory_costs as ic1')
            ->join(DB::raw('(SELECT inventory_item_id, MAX(effective_date) as max_date FROM inventory_costs GROUP BY inventory_item_id) as ic2'), function($join) {
                $join->on('ic1.inventory_item_id', '=', 'ic2.inventory_item_id')
                     ->on('ic1.effective_date', '=', 'ic2.max_date');
            })
            ->sum('unit_cost');

        return response()->json([
            'data' => [
                'totalItems' => $totalItems,
                'avgCostIncrease' => round($avgCostIncrease, 2) . '%',
                'totalInventoryValue' => '$' . number_format($totalValue, 2),
            ]
        ]);
    }
}
