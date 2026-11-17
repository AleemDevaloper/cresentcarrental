<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmTag;
use App\Models\CrmTaggable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmTagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmTag::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }
        if ($request->filled('category')) $query->where('category', $request->input('category'));
        $query->withCount('taggables');
        $items = $query->paginate($request->input('per_page', 50));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $tags = CrmTag::where('is_active', true)->orderBy('name')->get();
        return response()->json(['success' => true, 'data' => $tags]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        $validated['created_by'] = auth()->id();
        $tag = CrmTag::create($validated);
        return response()->json(['success' => true, 'data' => $tag], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $tag = CrmTag::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'color' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);
        if (!empty($validated['name'])) $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        $tag->update($validated);
        return response()->json(['success' => true, 'data' => $tag->fresh()]);
    }

    public function destroy($id): JsonResponse
    {
        $tag = CrmTag::findOrFail($id);
        CrmTaggable::where('tag_id', $tag->id)->delete();
        $tag->delete();
        return response()->json(['success' => true, 'message' => 'Tag deleted']);
    }

    public function attach(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tag_id' => 'required|integer',
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
        ]);
        $tag = CrmTag::findOrFail($validated['tag_id']);
        $tag->taggables()->firstOrCreate([
            'taggable_type' => $validated['entity_type'],
            'taggable_id' => $validated['entity_id'],
        ], ['created_by' => auth()->id()]);
        return response()->json(['success' => true]);
    }

    public function detach(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tag_id' => 'required|integer',
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
        ]);
        CrmTaggable::where('tag_id', $validated['tag_id'])
            ->where('taggable_type', $validated['entity_type'])
            ->where('taggable_id', $validated['entity_id'])
            ->delete();
        return response()->json(['success' => true]);
    }
}