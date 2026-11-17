<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductCategory::with(['parent', 'children']);

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $items = $query->orderBy('name')->paginate($request->integer('per_page', 15));

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
            'name' => 'required|string',
            'code' => 'required|string|unique:product_categories,code',
            'parent_id' => 'nullable|exists:product_categories,id',
            'default_valuation' => 'nullable|in:fifo,lifo,weighted_avg,standard',
        ]);

        $item = ProductCategory::create($validated);

        return response()->json(['data' => $item->load(['parent', 'children'])], 201);
    }

    public function show(ProductCategory $productCategory): JsonResponse
    {
        return response()->json(['data' => $productCategory->load(['parent', 'children'])]);
    }

    public function update(Request $request, ProductCategory $productCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'code' => 'sometimes|string|unique:product_categories,code,' . $productCategory->id,
            'parent_id' => 'nullable|exists:product_categories,id',
            'default_valuation' => 'nullable|in:fifo,lifo,weighted_avg,standard',
        ]);

        $productCategory->update($validated);

        return response()->json(['data' => $productCategory->load(['parent', 'children'])]);
    }

    public function destroy(ProductCategory $productCategory): JsonResponse
    {
        $productCategory->delete();

        return response()->json(['data' => ['id' => $productCategory->id]], 200);
    }
}
