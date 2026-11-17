<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WmsController
{
    public function dashboard(Request $request): JsonResponse
    {
        $warehouseId = $request->integer('warehouse_id');
        $scope = fn ($query) => $warehouseId ? $query->where('warehouse_id', $warehouseId) : $query;

        return response()->json([
            'data' => [
                'warehouses' => DB::table('warehouses')->where('wms_enabled', true)->count(),
                'receiving_today' => $scope(DB::table('wms_tasks')->where('type', 'receiving'))->whereDate('created_at', today())->count(),
                'pending_putaway' => $scope(DB::table('wms_tasks')->where('type', 'putaway')->whereIn('status', ['pending', 'assigned', 'in_progress']))->count(),
                'pending_picks' => $scope(DB::table('wms_tasks')->where('type', 'pick')->whereIn('status', ['pending', 'assigned', 'in_progress']))->count(),
                'active_waves' => $scope(DB::table('wms_waves')->whereIn('status', ['released', 'in_progress']))->count(),
                'pending_packing' => $scope(DB::table('wms_tasks')->where('type', 'pack')->whereIn('status', ['pending', 'assigned', 'in_progress']))->count(),
                'pending_dispatch' => $scope(DB::table('wms_tasks')->where('type', 'dispatch')->whereIn('status', ['pending', 'assigned', 'in_progress']))->count(),
                'open_exceptions' => $scope(DB::table('wms_exceptions')->where('status', 'open'))->count(),
                'activity' => DB::table('wms_tasks')->select('type', DB::raw('count(*) as total'))
                    ->when($warehouseId, fn ($q) => $q->where('warehouse_id', $warehouseId))
                    ->where('created_at', '>=', now()->subDays(7))->groupBy('type')->get(),
            ],
        ]);
    }

    public function zones(Request $request): JsonResponse
    {
        return $this->paginate('warehouse_zones', $request, ['warehouse_id', 'type', 'status']);
    }

    public function bins(Request $request): JsonResponse
    {
        return $this->paginate('warehouse_bins', $request, ['warehouse_id', 'zone_id', 'type', 'status']);
    }

    public function tasks(Request $request): JsonResponse
    {
        return $this->paginate('wms_tasks', $request, ['warehouse_id', 'type', 'status', 'priority']);
    }

    public function waves(Request $request): JsonResponse
    {
        return $this->paginate('wms_waves', $request, ['warehouse_id', 'status', 'type']);
    }

    public function storeTask(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:receiving,putaway,replenishment,pick,pack,stage,dispatch,count,movement'],
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'source_location_id' => ['nullable', 'integer'],
            'destination_location_id' => ['nullable', 'integer'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'priority' => ['nullable', 'in:low,normal,high,urgent'],
            'source_document' => ['nullable', 'array'],
        ]);
        $id = DB::table('wms_tasks')->insertGetId([
            ...$data,
            'task_number' => 'WT-' . now()->format('YmdHis') . '-' . random_int(100, 999),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['data' => DB::table('wms_tasks')->find($id)], 201);
    }

    public function updateTask(Request $request, int $task): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', 'in:pending,assigned,in_progress,partially_completed,completed,exception,cancelled'],
            'assigned_worker_id' => ['nullable', 'integer'],
            'exception_code' => ['nullable', 'string', 'max:100'],
            'exception_notes' => ['nullable', 'string'],
        ]);
        DB::table('wms_tasks')->where('id', $task)->update([...$data, 'updated_at' => now()]);
        return response()->json(['data' => DB::table('wms_tasks')->find($task)]);
    }

    private function paginate(string $table, Request $request, array $filters): JsonResponse
    {
        $query = DB::table($table)->latest('id');
        foreach ($filters as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }
        $page = $query->paginate(min(max($request->integer('per_page', 25), 1), 100));
        return response()->json(['data' => $page->items(), 'meta' => [
            'total' => $page->total(), 'currentPage' => $page->currentPage(), 'lastPage' => $page->lastPage(),
        ]]);
    }
}
