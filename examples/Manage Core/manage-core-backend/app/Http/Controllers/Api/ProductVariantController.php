<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        return response()->json(['data' => $product->variants()->orderBy('name')->get()]);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $variant = $product->variants()->create($request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:product_variants,sku',
            'barcode' => 'nullable|string|max:255',
            'attributes' => 'nullable|array',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $variant], 201);
    }

    public function update(Request $request, ProductVariant $productVariant): JsonResponse
    {
        $productVariant->update($request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|max:255|unique:product_variants,sku,' . $productVariant->id,
            'barcode' => 'nullable|string|max:255',
            'attributes' => 'nullable|array',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $productVariant]);
    }

    public function destroy(ProductVariant $productVariant): JsonResponse
    {
        $productVariant->delete();
        return response()->json(['data' => ['id' => $productVariant->id]]);
    }
}
