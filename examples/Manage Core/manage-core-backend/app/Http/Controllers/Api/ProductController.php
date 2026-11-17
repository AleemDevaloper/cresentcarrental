<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function dashboard(): JsonResponse
    {
        return response()->json(['data' => [
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'inactive_products' => Product::where('status', 'inactive')->count(),
            'draft_products' => Product::where('status', 'draft')->count(),
            'products_with_variants' => Product::has('variants')->count(),
            'without_sku' => Product::where(function ($q) {
                $q->whereNull('sku')->orWhere('sku', '');
            })->count(),
            'without_barcode' => Product::where(function ($q) {
                $q->whereNull('ean')->whereNull('alternate_barcode');
            })->count(),
            'batch_controlled' => Product::where('track_batch', true)->count(),
            'serial_controlled' => Product::where('track_serial', true)->count(),
            'services' => Product::where('product_type', 'service')->count(),
            'physical_products' => Product::whereNotIn('product_type', ['service', 'digital'])->count(),
            'stock_units' => (float) DB::table('inventory_stocks')->sum('on_hand'),
        ]]);
    }

    public function search(Request $request): JsonResponse
    {
        $term = trim((string) $request->input('q', ''));
        abort_if($term === '', 422, 'A search term is required.');
        $like = '%' . $term . '%';
        $items = Product::with(['category', 'brand', 'variants'])
            ->where(function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('sku', 'like', $like)
                    ->orWhere('product_code', 'like', $like)
                    ->orWhere('ean', 'like', $like)
                    ->orWhere('alternate_barcode', 'like', $like)
                    ->orWhereHas('variants', fn ($variant) => $variant->where('sku', 'like', $like)->orWhere('barcode', 'like', $like));
            })
            ->limit(25)->get();
        return response()->json(['data' => $items]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('product_code', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        if ($categoryId = $request->integer('category_id')) {
            $query->where('category_id', $categoryId);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
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
            'product_code' => 'required|string|unique:products,product_code',
            'name' => 'required|string',
            'sku' => 'nullable|string|unique:products,sku',
            'ean' => 'nullable|string|unique:products,ean',
            'alternate_barcode' => 'nullable|string|unique:products,alternate_barcode',
            'category_id' => 'nullable|exists:product_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'material_type' => 'nullable|string',
            'product_type' => 'nullable|in:stockable,consumable,service,bundle,kit,serialized,batch,digital',
            'default_unit' => 'nullable|string',
            'purchase_cost' => 'nullable|numeric',
            'sales_price' => 'nullable|numeric',
            'wholesale_price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'minimum_price' => 'nullable|numeric|min:0',
            'maximum_price' => 'nullable|numeric|min:0',
            'initial_stock' => 'nullable|integer',
            'min_stock' => 'nullable|integer',
            'max_stock' => 'nullable|integer',
            'reorder_point' => 'nullable|integer',
            'safety_stock' => 'nullable|numeric|min:0',
            'reorder_quantity' => 'nullable|numeric|min:0',
            'track_inventory' => 'nullable|boolean',
            'track_batch' => 'nullable|boolean',
            'track_serial' => 'nullable|boolean',
            'track_expiry' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'warehouse' => 'nullable|string',
            'bin_location' => 'nullable|string',
            'costing_method' => 'nullable|string',
            'abc_class' => 'nullable|string',
            'status' => 'nullable|in:draft,active,inactive,archived,discontinued,blocked',
        ]);

        $item = Product::create($validated);

        return response()->json(['data' => $item->load(['category', 'brand', 'variants'])], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['data' => $product->load(['category', 'brand', 'variants'])]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'product_code' => 'sometimes|string|unique:products,product_code,' . $product->id,
            'name' => 'sometimes|string',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'ean' => 'nullable|string|unique:products,ean,' . $product->id,
            'alternate_barcode' => 'nullable|string|unique:products,alternate_barcode,' . $product->id,
            'category_id' => 'nullable|exists:product_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'material_type' => 'nullable|string',
            'product_type' => 'nullable|in:stockable,consumable,service,bundle,kit,serialized,batch,digital',
            'default_unit' => 'nullable|string',
            'purchase_cost' => 'nullable|numeric',
            'sales_price' => 'nullable|numeric',
            'wholesale_price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'minimum_price' => 'nullable|numeric|min:0',
            'maximum_price' => 'nullable|numeric|min:0',
            'initial_stock' => 'nullable|integer',
            'min_stock' => 'nullable|integer',
            'max_stock' => 'nullable|integer',
            'reorder_point' => 'nullable|integer',
            'safety_stock' => 'nullable|numeric|min:0',
            'reorder_quantity' => 'nullable|numeric|min:0',
            'track_inventory' => 'nullable|boolean',
            'track_batch' => 'nullable|boolean',
            'track_serial' => 'nullable|boolean',
            'track_expiry' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'warehouse' => 'nullable|string',
            'bin_location' => 'nullable|string',
            'costing_method' => 'nullable|string',
            'abc_class' => 'nullable|string',
            'status' => 'nullable|in:draft,active,inactive,archived,discontinued,blocked',
        ]);

        $product->update($validated);

        return response()->json(['data' => $product->load(['category', 'brand', 'variants'])]);
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->stockLedger()->exists() || $product->variants()->exists()) {
            $product->update(['status' => 'archived']);
            return response()->json(['data' => ['id' => $product->id, 'status' => 'archived']]);
        }
        $product->delete();

        return response()->json(['data' => ['id' => $product->id]], 200);
    }
}
