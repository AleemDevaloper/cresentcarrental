<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CrmDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmDocument::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('original_name', 'like', "%{$search}%");
            });
        }
        if ($request->filled('related_type')) $query->where('related_type', $request->input('related_type'));
        if ($request->filled('related_id')) $query->where('related_id', $request->input('related_id'));
        $items = $query->with('uploader:id,name')->orderBy('id', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:51200',
            'name' => 'nullable|string',
            'related_type' => 'nullable|string',
            'related_id' => 'nullable|integer',
            'description' => 'nullable|string',
            'visibility' => 'nullable|in:private,team,public',
        ]);
        $file = $request->file('file');
        $path = $file->store('crm/documents/' . date('Y/m'), 'public');
        $doc = CrmDocument::create([
            'name' => $request->input('name') ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $path,
            'disk' => 'public',
            'related_type' => $request->input('related_type'),
            'related_id' => $request->input('related_id'),
            'visibility' => $request->input('visibility', 'private'),
            'description' => $request->input('description'),
            'uploaded_by' => auth()->id(),
        ]);
        return response()->json(['success' => true, 'data' => $doc], 201);
    }

    public function show($id): JsonResponse
    {
        $doc = CrmDocument::with('uploader:id,name')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $doc]);
    }

    public function download($id)
    {
        $doc = CrmDocument::findOrFail($id);
        if (!Storage::disk($doc->disk)->exists($doc->path)) {
            abort(404);
        }
        return Storage::disk($doc->disk)->download($doc->path, $doc->original_name);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $doc = CrmDocument::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'visibility' => 'nullable|in:private,team,public',
            'description' => 'nullable|string',
        ]);
        $doc->update($validated);
        return response()->json(['success' => true, 'data' => $doc->fresh()]);
    }

    public function destroy($id): JsonResponse
    {
        $doc = CrmDocument::findOrFail($id);
        Storage::disk($doc->disk)->delete($doc->path);
        $doc->delete();
        return response()->json(['success' => true, 'message' => 'Document deleted']);
    }
}