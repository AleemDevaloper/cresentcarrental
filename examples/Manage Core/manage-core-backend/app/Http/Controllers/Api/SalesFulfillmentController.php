<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesFulfillmentController
{
    public function orders(Request $request): JsonResponse
    {
        $orders = DB::table('sales_orders')
            ->latest('id')
            ->paginate((int) min(max($request->integer('per_page', 25), 1), 100));

        return response()->json($orders);
    }

    public function storeOrder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_id' => ['nullable', 'integer'],
            'requested_delivery_date' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.unit_price' => ['required', 'numeric', 'gte:0'],
        ]);

        $order = DB::transaction(function () use ($data) {
            $subtotal = collect($data['items'])->sum(fn ($item) => $item['quantity'] * $item['unit_price']);
            $orderId = DB::table('sales_orders')->insertGetId([
                'order_number' => 'SO-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'customer_id' => $data['customer_id'] ?? null,
                'requested_delivery_date' => $data['requested_delivery_date'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($data['items'] as $item) {
                DB::table('sales_order_items')->insert([
                    'sales_order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'ordered_quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return DB::table('sales_orders')->where('id', $orderId)->first();
        });

        return response()->json($order, 201);
    }

    public function deliveries(Request $request): JsonResponse
    {
        return response()->json(DB::table('sales_deliveries')
            ->latest('id')
            ->paginate((int) min(max($request->integer('per_page', 25), 1), 100)));
    }

    public function returns(Request $request): JsonResponse
    {
        return response()->json(DB::table('sales_returns')
            ->latest('id')
            ->paginate((int) min(max($request->integer('per_page', 25), 1), 100)));
    }
}
