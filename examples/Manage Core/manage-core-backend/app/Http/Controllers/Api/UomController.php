<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Uom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Uom::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('symbol', 'like', "%{$search}%");
            });
        }
 if ($request->filled('category')) {
            $category = $request->string('category');
            $query->where('category', $category);
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
            'symbol' => 'nullable|string',
            'category' => 'nullable|in:weight,volume,length,quantity,time,area',
            'is_base' => 'nullable|boolean',
            'conversion_multiplier' => 'nullable|numeric',
            'base_unit' => 'nullable|string',
        ]);

        $item = Uom::create($validated);

        return response()->json(['data' => $item], 201);
    }

    public function show(Uom $uom): JsonResponse
    {
        return response()->json(['data' => $uom]);
    }

    public function update(Request $request, Uom $uom): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'symbol' => 'nullable|string',
            'category' => 'nullable|in:weight,volume,length,quantity,time,area',
            'is_base' => 'nullable|boolean',
            'conversion_multiplier' => 'nullable|numeric',
            'base_unit' => 'nullable|string',
        ]);

        $uom->update($validated);

        return response()->json(['data' => $uom]);
    }

    public function destroy(Uom $uom): JsonResponse
    {
        $uom->delete();

        return response()->json(['data' => ['id' => $uom->id]], 200);
    }
}
