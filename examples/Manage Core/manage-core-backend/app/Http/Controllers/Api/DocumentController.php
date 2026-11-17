<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = UserDocument::with('user');

        if ($user->role !== 'Admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('type')) {
            $query->where('document_type', $request->type);
        }

        if ($request->has('verification_status')) {
            $query->where('verification_status', $request->verification_status);
        }

        $documents = $query->latest()->paginate($request->per_page ?? 20);
        return response()->json(['data' => $documents]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'document_type' => 'required|string|max:255',
            'file' => 'required|file|max:10240',
            'expiry_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $document = DB::transaction(function () use ($request, $validated) {
            $file = $request->file('file');
            $filePath = $file->store('documents/' . $validated['user_id'], 'public');
            $fileSize = $file->getSize();
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();

            return UserDocument::create([
                'user_id' => $validated['user_id'],
                'document_type' => $validated['document_type'],
                'file_path' => $filePath,
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'file_size' => $fileSize,
                'expiry_date' => $validated['expiry_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'tags' => $validated['tags'] ?? null,
                'uploaded_by' => $request->user()->id,
                'verification_status' => 'pending',
                'version' => 1,
            ]);
        });

        return response()->json(['data' => $document->load('user')], 201);
    }

    public function show(UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(['data' => $document->load(['user', 'versions'])]);
    }

    public function update(Request $request, UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($document->is_locked) {
            return response()->json(['message' => 'Document is locked and cannot be edited.'], 422);
        }

        $validated = $request->validate([
            'document_type' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('documents/' . $document->user_id, 'public');

            // Archive current version
            $document->versions()->create([
                'file_path' => $document->file_path,
                'original_name' => $document->original_name,
                'file_size' => $document->file_size,
                'mime_type' => $document->mime_type,
                'version' => $document->version,
            ]);

            $document->file_path = $filePath;
            $document->original_name = $file->getClientOriginalName();
            $document->mime_type = $file->getMimeType();
            $document->file_size = $file->getSize();
            $document->increment('version');
        }

        $document->fill($validated)->save();
        return response()->json(['data' => $document->fresh()->load('versions')]);
    }

    public function destroy(UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(null, 204);
    }

    public function verify(Request $request, UserDocument $document): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'verification_status' => 'required|string|in:verified,rejected,pending',
            'verification_notes' => 'nullable|string',
        ]);

        $document->update([
            'verification_status' => $validated['verification_status'],
            'verification_notes' => $validated['verification_notes'] ?? null,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        return response()->json(['data' => $document->fresh()]);
    }

    public function lock(Request $request, UserDocument $document): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $document->update(['is_locked' => !$document->is_locked]);
        return response()->json(['data' => $document->fresh()]);
    }

    public function share(Request $request, UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'permission' => 'nullable|string|in:view,download',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $document->sharedWith()->syncWithoutDetaching(
            collect($validated['user_ids'])->mapWithKeys(function ($userId) use ($validated) {
                return [$userId => [
                    'permission' => $validated['permission'] ?? 'view',
                    'expires_at' => $validated['expires_at'] ?? null,
                    'shared_by' => auth()->id(),
                ]];
            })->toArray()
        );

        return response()->json(['data' => $document->fresh()->load('sharedWith')]);
    }

    public function download(UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            $shared = $document->sharedWith()->where('user_id', auth()->id())->first();
            if (!$shared || ($shared->pivot->permission === 'view')) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->original_name);
    }

    public function bulkUpload(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'files' => 'required|array|min:1|max:10',
            'files.*' => 'required|file|max:10240',
            'document_type' => 'required|string|max:255',
        ]);

        $documents = DB::transaction(function () use ($request) {
            $created = [];

            foreach ($request->file('files') as $file) {
                $filePath = $file->store('documents/' . $request->user_id, 'public');

                $created[] = UserDocument::create([
                    'user_id' => $request->user_id,
                    'document_type' => $request->document_type,
                    'file_path' => $filePath,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'uploaded_by' => $request->user()->id,
                    'verification_status' => 'pending',
                    'version' => 1,
                ]);
            }

            return $created;
        });

        return response()->json(['data' => $documents, 'meta' => ['total' => count($documents)]], 201);
    }

    public function history(Request $request, UserDocument $document): JsonResponse
    {
        if ($document->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(['data' => [
            'document' => $document,
            'versions' => $document->versions()->latest('version')->get(),
            'shares' => $document->sharedWith()->withPivot(['permission', 'expires_at', 'created_at'])->get(),
        ]]);
    }
}
