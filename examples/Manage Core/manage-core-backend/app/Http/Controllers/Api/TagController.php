<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Tag::all()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $tag = Tag::create($data);
        return response()->json(['data' => $tag], 201);
    }

    public function show(Tag $tag): JsonResponse
    {
        return response()->json(['data' => $tag]);
    }

    public function update(Request $request, Tag $tag): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $tag->update($data);
        return response()->json(['data' => $tag]);
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $tag->delete();
        return response()->json(['ok' => true]);
    }
}
