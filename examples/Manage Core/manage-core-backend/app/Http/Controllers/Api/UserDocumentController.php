<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDocument;
use App\Support\ProjectFileStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserDocumentController extends Controller
{
    public function index(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user->documents()->latest()->get(),
        ]);
    }

    public function store(Request $request, User $user, ProjectFileStorage $storage): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // 10MB limit
            'type' => 'nullable|string|max:100',
        ]);

        $fileData = $storage->storeUploadedFile($request->file('file'));

        $document = $user->documents()->create([
            'name' => $request->name,
            'file_path' => $fileData['path'],
            'file_size' => $fileData['size'],
            'type' => $request->type,
        ]);

        return response()->json(['data' => $document], 201);
    }

    public function destroy(UserDocument $document, ProjectFileStorage $storage): JsonResponse
    {
        $storage->delete($document->file_path);
        $document->delete();

        return response()->json(['ok' => true]);
    }

    public function download(UserDocument $document, ProjectFileStorage $storage)
    {
        if (!$storage->exists($document->file_path)) {
            return response()->json(['message' => 'File not found on server.'], 404);
        }

        return $storage->downloadResponse($document->file_path, $document->name);
    }
}
