<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Brand::query()->when($request->filled('search'), function ($q) use ($request) {
            $term = $request->string('search');
            $q->where('name', 'like', "%{$term}%")->orWhere('manufacturer', 'like', "%{$term}%");
        })->orderBy('name');
        $items = $query->paginate($request->integer('per_page', 15));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage()]]);
    }

    public function store(Request $request): JsonResponse
    {
        $brand = Brand::create($request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
            'manufacturer' => 'nullable|string|max:255',
            'logo_path' => 'nullable|string|max:2048',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $brand], 201);
    }

    public function show(Brand $brand): JsonResponse
    {
        return response()->json(['data' => $brand->load('products')]);
    }

    public function update(Request $request, Brand $brand): JsonResponse
    {
        $brand->update($request->validate([
            'name' => 'sometimes|string|max:255|unique:brands,name,' . $brand->id,
            'manufacturer' => 'nullable|string|max:255',
            'logo_path' => 'nullable|string|max:2048',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'nullable|boolean',
        ]));
        return response()->json(['data' => $brand]);
    }

    public function destroy(Brand $brand): JsonResponse
    {
        $brand->delete();
        return response()->json(['data' => ['id' => $brand->id]]);
    }
}
