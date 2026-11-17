<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MFG\ProductionOrder;
use App\Models\MFG\BillOfMaterial;
use App\Models\MFG\BomItem;
use App\Models\MFG\WorkOrder;
use App\Models\MFG\MaterialConsumption;
use App\Models\MFG\MachineUtilization;
use App\Models\InventoryStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MfgController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalProductionOrders = ProductionOrder::count();
        $activeProductionOrders = ProductionOrder::whereIn('status', ['draft', 'in_progress'])->count();
        $completedProductionOrders = ProductionOrder::where('status', 'completed')->count();
        $cancelledProductionOrders = ProductionOrder::where('status', 'cancelled')->count();

        $totalWorkOrders = WorkOrder::count();
        $workInProgress = WorkOrder::where('status', 'in_progress')->count();
        $pendingWorkOrders = WorkOrder::where('status', 'pending')->count();
        $completedWorkOrders = WorkOrder::where('status', 'completed')->count();

        $totalBoms = BillOfMaterial::where('status', 'active')->count();

        $totalEstimatedCost = ProductionOrder::sum('estimated_cost');
        $totalActualCost = ProductionOrder::sum('actual_cost');
        $avgEfficiency = WorkOrder::where('quantity_to_produce', '>', 0)
            ->selectRaw('CASE WHEN SUM(quantity_to_produce) > 0 THEN (SUM(quantity_produced) / SUM(quantity_to_produce)) * 100 ELSE 0 END as avg_eff')
            ->value('avg_eff') ?? 0;

        $todayMachineStats = MachineUtilization::where('date', Carbon::today())->first();
        $avgUtilization = MachineUtilization::where('date', '>=', Carbon::now()->subDays(7))->avg('utilization_percent') ?? 0;
        $avgMachineEfficiency = MachineUtilization::where('date', '>=', Carbon::now()->subDays(7))->avg('efficiency') ?? 0;

        $totalOutputUnits = WorkOrder::where('status', 'completed')->sum('quantity_produced');
        $totalScrapped = WorkOrder::sum('quantity_scrapped');

        $totalMaterialCost = MaterialConsumption::sum('total_cost');

        return response()->json([
            'data' => [
                'production_orders' => [
                    'total' => $totalProductionOrders,
                    'active' => $activeProductionOrders,
                    'completed' => $completedProductionOrders,
                    'cancelled' => $cancelledProductionOrders,
                ],
                'work_orders' => [
                    'total' => $totalWorkOrders,
                    'in_progress' => $workInProgress,
                    'pending' => $pendingWorkOrders,
                    'completed' => $completedWorkOrders,
                ],
                'boms' => [
                    'active' => $totalBoms,
                ],
                'costs' => [
                    'total_estimated' => round($totalEstimatedCost, 2),
                    'total_actual' => round($totalActualCost, 2),
                    'total_material' => round($totalMaterialCost, 2),
                    'variance' => round($totalActualCost - $totalEstimatedCost, 2),
                ],
                'production' => [
                    'total_output_units' => (int) $totalOutputUnits,
                    'total_scrapped' => (int) $totalScrapped,
                    'efficiency' => round($avgEfficiency, 2),
                ],
                'machines' => [
                    'avg_utilization' => round($avgUtilization, 2),
                    'avg_efficiency' => round($avgMachineEfficiency, 2),
                    'today' => $todayMachineStats,
                ],
            ],
        ]);
    }

    // ─── Production Orders ───────────────────────────────────────────────

    public function listProductionOrders(Request $request): JsonResponse
    {
        $query = ProductionOrder::with(['product', 'creator', 'assignee']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        $perPage = $request->per_page ?? 50;
        $orders = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
            ],
        ]);
    }

    public function getProductionOrder($id): JsonResponse
    {
        $order = ProductionOrder::with(['product', 'creator', 'assignee', 'workOrders.bom'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Production order not found'], 404);
        }

        return response()->json(['data' => $order]);
    }

    public function createProductionOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'quantity' => 'required|numeric|min:0.0001',
            'unit' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'estimated_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $validated['order_number'] = 'PO-' . strtoupper(uniqid());
        $validated['created_by'] = $request->user()->id;
        $validated['status'] = $validated['status'] ?? 'draft';
        $validated['priority'] = $validated['priority'] ?? 'medium';
        $validated['unit'] = $validated['unit'] ?? 'pcs';
        $validated['actual_cost'] = 0;

        $order = ProductionOrder::create($validated);

        return response()->json(['data' => $order->load(['product', 'creator', 'assignee'])], 201);
    }

    public function updateProductionOrder(Request $request, $id): JsonResponse
    {
        $order = ProductionOrder::find($id);

        if (!$order) {
            return response()->json(['message' => 'Production order not found'], 404);
        }

        $validated = $request->validate([
            'product_name' => 'sometimes|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'quantity' => 'sometimes|numeric|min:0.0001',
            'unit' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'actual_end_date' => 'nullable|date',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $order->update($validated);

        return response()->json(['data' => $order->fresh()->load(['product', 'creator', 'assignee'])]);
    }

    public function deleteProductionOrder($id): JsonResponse
    {
        $order = ProductionOrder::find($id);

        if (!$order) {
            return response()->json(['message' => 'Production order not found'], 404);
        }

        if ($order->workOrders()->exists()) {
            return response()->json(['message' => 'Cannot delete production order with associated work orders.'], 422);
        }

        $order->delete();
        return response()->json(null, 204);
    }

    // ─── Bills of Materials ──────────────────────────────────────────────

    public function listBoms(Request $request): JsonResponse
    {
        $query = BillOfMaterial::with(['product', 'creator', 'items']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('bom_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->per_page ?? 50;
        $boms = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $boms->items(),
            'pagination' => [
                'current_page' => $boms->currentPage(),
                'per_page' => $boms->perPage(),
                'total' => $boms->total(),
                'last_page' => $boms->lastPage(),
            ],
        ]);
    }

    public function getBom($id): JsonResponse
    {
        $bom = BillOfMaterial::with(['product', 'creator', 'items', 'workOrders'])->find($id);

        if (!$bom) {
            return response()->json(['message' => 'BOM not found'], 404);
        }

        return response()->json(['data' => $bom]);
    }

    public function createBom(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'version' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        $bom = DB::transaction(function () use ($validated, $request) {
            $bomCode = 'BOM-' . strtoupper(uniqid());
            $totalCost = 0;

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $item['total_cost'] = $item['quantity'] * $item['unit_cost'];
                    $totalCost += $item['total_cost'];
                    $item['unit'] = $item['unit'] ?? 'pcs';
                }
            }

            $bom = BillOfMaterial::create([
                'bom_code' => $bomCode,
                'name' => $validated['name'],
                'product_name' => $validated['product_name'],
                'product_id' => $validated['product_id'] ?? null,
                'version' => $validated['version'] ?? '1.0',
                'status' => 'active',
                'description' => $validated['description'] ?? null,
                'total_cost' => $totalCost,
                'created_by' => $request->user()->id,
            ]);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $bom->items()->create([
                        'item_name' => $item['item_name'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? 'pcs',
                        'unit_cost' => $item['unit_cost'],
                        'total_cost' => $item['quantity'] * $item['unit_cost'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            }

            return $bom->load(['items', 'creator']);
        });

        return response()->json(['data' => $bom], 201);
    }

    public function updateBom(Request $request, $id): JsonResponse
    {
        $bom = BillOfMaterial::find($id);

        if (!$bom) {
            return response()->json(['message' => 'BOM not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'product_name' => 'sometimes|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'version' => 'nullable|string|max:50',
            'status' => 'nullable|in:active,inactive',
            'description' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|integer',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.0001',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        $bom = DB::transaction(function () use ($validated, $bom, $request) {
            $totalCost = 0;

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $itemCost = $item['quantity'] * $item['unit_cost'];
                    $totalCost += $itemCost;
                }
            }

            $bom->update([
                'name' => $validated['name'] ?? $bom->name,
                'product_name' => $validated['product_name'] ?? $bom->product_name,
                'product_id' => $validated['product_id'] ?? $bom->product_id,
                'version' => $validated['version'] ?? $bom->version,
                'status' => $validated['status'] ?? $bom->status,
                'description' => $validated['description'] ?? $bom->description,
                'total_cost' => $totalCost,
            ]);

            if (isset($validated['items'])) {
                $existingIds = collect($validated['items'])->pluck('id')->filter()->toArray();
                $bom->items()->whereNotIn('id', $existingIds)->delete();

                foreach ($validated['items'] as $item) {
                    $itemData = [
                        'item_name' => $item['item_name'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? 'pcs',
                        'unit_cost' => $item['unit_cost'],
                        'total_cost' => $item['quantity'] * $item['unit_cost'],
                        'notes' => $item['notes'] ?? null,
                    ];

                    if (!empty($item['id'])) {
                        $bom->items()->where('id', $item['id'])->update($itemData);
                    } else {
                        $bom->items()->create($itemData);
                    }
                }
            }

            return $bom->fresh()->load(['items', 'creator']);
        });

        return response()->json(['data' => $bom]);
    }

    public function deleteBom($id): JsonResponse
    {
        $bom = BillOfMaterial::find($id);

        if (!$bom) {
            return response()->json(['message' => 'BOM not found'], 404);
        }

        if ($bom->workOrders()->exists()) {
            return response()->json(['message' => 'Cannot delete BOM with associated work orders.'], 422);
        }

        DB::transaction(function () use ($bom) {
            $bom->items()->delete();
            $bom->delete();
        });

        return response()->json(null, 204);
    }

    // ─── Work Orders ─────────────────────────────────────────────────────

    public function listWorkOrders(Request $request): JsonResponse
    {
        $query = WorkOrder::with(['productionOrder', 'bom', 'assignee', 'creator']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('work_order_number', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('production_order_id')) {
            $query->where('production_order_id', $request->production_order_id);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        $perPage = $request->per_page ?? 50;
        $orders = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
            ],
        ]);
    }

    public function getWorkOrder($id): JsonResponse
    {
        $order = WorkOrder::with(['productionOrder', 'bom.items', 'assignee', 'creator', 'materialConsumptions'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Work order not found'], 404);
        }

        return response()->json(['data' => $order]);
    }

    public function createWorkOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'production_order_id' => 'nullable|exists:mfg_production_orders,id',
            'bom_id' => 'nullable|exists:mfg_boms,id',
            'status' => 'nullable|in:pending,in_progress,on_hold,completed,cancelled',
            'quantity_to_produce' => 'required|numeric|min:0.0001',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'material_consumptions' => 'nullable|array',
            'material_consumptions.*.item_name' => 'required|string|max:255',
            'material_consumptions.*.planned_quantity' => 'required|numeric|min:0',
            'material_consumptions.*.unit' => 'nullable|string|max:50',
            'material_consumptions.*.unit_cost' => 'required|numeric|min:0',
            'material_consumptions.*.notes' => 'nullable|string',
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $workOrderNumber = 'WO-' . strtoupper(uniqid());

            $workOrder = WorkOrder::create([
                'work_order_number' => $workOrderNumber,
                'production_order_id' => $validated['production_order_id'] ?? null,
                'bom_id' => $validated['bom_id'] ?? null,
                'status' => $validated['status'] ?? 'pending',
                'quantity_to_produce' => $validated['quantity_to_produce'],
                'quantity_produced' => 0,
                'quantity_scrapped' => 0,
                'start_date' => $validated['start_date'] ?? null,
                'end_date' => $validated['end_date'] ?? null,
                'assigned_to' => $validated['assigned_to'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);

            if (!empty($validated['material_consumptions'])) {
                foreach ($validated['material_consumptions'] as $mc) {
                    $mc['unit'] = $mc['unit'] ?? 'pcs';
                    $mc['actual_quantity'] = 0;
                    $mc['total_cost'] = $mc['planned_quantity'] * $mc['unit_cost'];
                    $workOrder->materialConsumptions()->create($mc);
                }
            }

            return $workOrder->load(['productionOrder', 'bom', 'assignee', 'creator', 'materialConsumptions']);
        });

        return response()->json(['data' => $order], 201);
    }

    public function updateWorkOrder(Request $request, $id): JsonResponse
    {
        $order = WorkOrder::find($id);

        if (!$order) {
            return response()->json(['message' => 'Work order not found'], 404);
        }

        $validated = $request->validate([
            'production_order_id' => 'nullable|exists:mfg_production_orders,id',
            'bom_id' => 'nullable|exists:mfg_boms,id',
            'status' => 'nullable|in:pending,in_progress,on_hold,completed,cancelled',
            'quantity_to_produce' => 'sometimes|numeric|min:0.0001',
            'quantity_produced' => 'nullable|numeric|min:0',
            'quantity_scrapped' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'actual_end_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'material_consumptions' => 'nullable|array',
            'material_consumptions.*.id' => 'nullable|integer',
            'material_consumptions.*.item_name' => 'required|string|max:255',
            'material_consumptions.*.planned_quantity' => 'required|numeric|min:0',
            'material_consumptions.*.actual_quantity' => 'nullable|numeric|min:0',
            'material_consumptions.*.unit' => 'nullable|string|max:50',
            'material_consumptions.*.unit_cost' => 'required|numeric|min:0',
            'material_consumptions.*.notes' => 'nullable|string',
        ]);

        $order = DB::transaction(function () use ($validated, $order) {
            if (isset($validated['status']) && $validated['status'] === 'completed' && !$order->actual_end_date) {
                $validated['actual_end_date'] = Carbon::today()->toDateString();
            }

            $order->update(collect($validated)->except('material_consumptions')->toArray());

            if (isset($validated['material_consumptions'])) {
                $existingIds = collect($validated['material_consumptions'])->pluck('id')->filter()->toArray();
                $order->materialConsumptions()->whereNotIn('id', $existingIds)->delete();

                foreach ($validated['material_consumptions'] as $mc) {
                    $planned = $mc['planned_quantity'];
                    $actual = $mc['actual_quantity'] ?? 0;
                    $unitCost = $mc['unit_cost'];
                    $variance = $actual - $planned;

                    $mcData = [
                        'item_name' => $mc['item_name'],
                        'planned_quantity' => $planned,
                        'actual_quantity' => $actual,
                        'unit' => $mc['unit'] ?? 'pcs',
                        'unit_cost' => $unitCost,
                        'total_cost' => $actual * $unitCost,
                        'variance' => $variance,
                        'notes' => $mc['notes'] ?? null,
                    ];

                    if (!empty($mc['id'])) {
                        $order->materialConsumptions()->where('id', $mc['id'])->update($mcData);
                    } else {
                        $order->materialConsumptions()->create($mcData);
                    }
                }
            }

            return $order->fresh()->load(['productionOrder', 'bom', 'assignee', 'creator', 'materialConsumptions']);
        });

        return response()->json(['data' => $order]);
    }

    public function deleteWorkOrder($id): JsonResponse
    {
        $order = WorkOrder::find($id);

        if (!$order) {
            return response()->json(['message' => 'Work order not found'], 404);
        }

        DB::transaction(function () use ($order) {
            $order->materialConsumptions()->delete();
            $order->delete();
        });

        return response()->json(null, 204);
    }

    // ─── Machine Utilization ─────────────────────────────────────────────

    public function machineUtilization(Request $request): JsonResponse
    {
        $query = MachineUtilization::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('machine_name', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->has('machine_name')) {
            $query->where('machine_name', $request->machine_name);
        }

        $perPage = $request->per_page ?? 50;
        $records = $query->latest('date')->paginate($perPage);

        return response()->json([
            'data' => $records->items(),
            'pagination' => [
                'current_page' => $records->currentPage(),
                'per_page' => $records->perPage(),
                'total' => $records->total(),
                'last_page' => $records->lastPage(),
            ],
        ]);
    }

    // ─── Material Consumption ────────────────────────────────────────────

    public function materialConsumption(Request $request): JsonResponse
    {
        $query = MaterialConsumption::with('workOrder');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->has('work_order_id')) {
            $query->where('work_order_id', $request->work_order_id);
        }

        if ($request->has('item_name')) {
            $query->where('item_name', 'like', "%{$request->item_name}%");
        }

        $perPage = $request->per_page ?? 50;
        $records = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $records->items(),
            'pagination' => [
                'current_page' => $records->currentPage(),
                'per_page' => $records->perPage(),
                'total' => $records->total(),
                'last_page' => $records->lastPage(),
            ],
        ]);
    }

    // ─── Production Timeline ─────────────────────────────────────────────

    public function productionTimeline(Request $request): JsonResponse
    {
        $productionOrders = ProductionOrder::select('id', 'order_number', 'product_name', 'status', 'priority', 'start_date', 'end_date', 'actual_end_date')
            ->whereNotNull('start_date')
            ->orderBy('start_date')
            ->get()
            ->map(function ($po) {
                return [
                    'id' => $po->id,
                    'type' => 'production_order',
                    'title' => $po->order_number . ' - ' . $po->product_name,
                    'status' => $po->status,
                    'priority' => $po->priority,
                    'start_date' => $po->start_date?->toDateString(),
                    'end_date' => $po->end_date?->toDateString(),
                    'actual_end_date' => $po->actual_end_date?->toDateString(),
                ];
            });

        $workOrders = WorkOrder::select('id', 'work_order_number', 'status', 'quantity_to_produce', 'quantity_produced', 'start_date', 'end_date', 'actual_end_date')
            ->whereNotNull('start_date')
            ->orderBy('start_date')
            ->get()
            ->map(function ($wo) {
                return [
                    'id' => $wo->id,
                    'type' => 'work_order',
                    'title' => $wo->work_order_number,
                    'status' => $wo->status,
                    'start_date' => $wo->start_date?->toDateString(),
                    'end_date' => $wo->end_date?->toDateString(),
                    'actual_end_date' => $wo->actual_end_date?->toDateString(),
                    'quantity_to_produce' => $wo->quantity_to_produce,
                    'quantity_produced' => $wo->quantity_produced,
                ];
            });

        $timeline = $productionOrders->concat($workOrders)->sortBy('start_date')->values();

        return response()->json(['data' => $timeline]);
    }

    // ─── Low Stock Alerts ────────────────────────────────────────────────

    public function lowStockAlerts(Request $request): JsonResponse
    {
        try {
            $alerts = InventoryStock::with(['product', 'warehouse'])
                ->whereColumn('on_hand', '<=', DB::raw('COALESCE((SELECT reorder_point FROM products WHERE products.id = inventory_stocks.product_id), 0)'))
                ->where('on_hand', '>', 0)
                ->get()
                ->map(function ($stock) {
                    return [
                        'product_name' => $stock->product?->name ?? 'Unknown',
                        'sku' => $stock->product?->sku ?? null,
                        'warehouse' => $stock->warehouse?->name ?? 'Unknown',
                        'on_hand' => $stock->on_hand,
                        'reserved' => $stock->reserved,
                        'available' => $stock->available,
                        'reorder_point' => $stock->product?->reorder_point ?? 0,
                        'status' => $stock->on_hand <= ($stock->product?->min_stock ?? 0) ? 'critical' : 'low',
                    ];
                });

            return response()->json(['data' => $alerts]);
        } catch (\Exception $e) {
            return response()->json(['data' => [], 'message' => 'Inventory stock data not available']);
        }
    }
}
