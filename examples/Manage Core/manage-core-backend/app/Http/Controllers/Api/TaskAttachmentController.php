<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAttachment;
use App\Support\ProjectFileStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskAttachmentController extends Controller
{
    protected $storage;

    public function __construct(ProjectFileStorage $storage)
    {
        $this->storage = $storage;
    }

    public function index(Task $task): JsonResponse
    {
        return response()->json(['data' => $task->attachments()->with('user')->get()]);
    }

    public function store(Request $request, Task $task): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:20480', // 20MB
        ]);

        $file = $request->file('file');
        if (!$file) {
            return response()->json([
                'message' => 'Upload failed: No file received or file exceeded PHP upload limits.',
            ], 400);
        }

        $user = auth()->user();
        $fileSizeMb = $file->getSize() / (1024 * 1024);

        if ($user->storage_limit_mb > 0 && ($user->used_storage_mb + $fileSizeMb) > $user->storage_limit_mb) {
            return response()->json([
                'message' => 'Upload failed: You have reached your storage limit.',
                'errors' => ['file' => ['Storage limit exceeded.']]
            ], 422);
        }

        try {
            $upload = $this->storage->storeUploadedFile($file);

            $attachment = $task->attachments()->create([
                'user_id' => auth()->id(),
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $upload['path'],
                'file_size' => $upload['size'],
                'file_type' => $file->getClientMimeType(),
            ]);

            $task->activityLogs()->create([
                'user_id' => auth()->id(),
                'action' => 'added_attachment',
                'description' => 'Added attachment: ' . $attachment->file_name,
            ]);

            return response()->json(['data' => $attachment], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Task Attachment upload failed: " . $e->getMessage());
            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function listAll(Request $request): JsonResponse
    {
        $query = TaskAttachment::with(['task', 'user']);

        if ($request->filled('project_id')) {
            $query->whereHas('task', fn($q) => $q->where('project_id', $request->project_id));
        }

        if ($request->filled('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        if ($request->filled('task_ids')) {
            $ids = array_map('intval', explode(',', $request->task_ids));
            $ids = array_filter($ids);
            if (!empty($ids)) {
                $query->whereIn('task_id', $ids);
            }
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function download(TaskAttachment $attachment)
    {
        return $this->storage->downloadResponse($attachment->file_path, $attachment->file_name);
    }

    public function content(TaskAttachment $attachment)
    {
        $path = $attachment->file_path;
        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        $ext = strtolower(pathinfo($attachment->file_name, PATHINFO_EXTENSION));
        $textExts = ['txt', 'csv', 'md', 'json', 'xml', 'html', 'htm', 'css', 'js', 'jsx', 'ts', 'tsx', 'php', 'py', 'rb', 'go', 'rs', 'java', 'cpp', 'c', 'h', 'sql', 'yml', 'yaml', 'ini', 'cfg', 'log', 'sh', 'bat', 'ps1', 'env', 'gitignore', 'dockerfile', 'conf'];
        $binaryExts = ['xlsx', 'xls'];

        if (in_array($ext, $binaryExts)) {
            $content = file_get_contents($path);
            if ($content === false) {
                return response()->json(['message' => 'Failed to read file.'], 500);
            }
            return response()->json(['data' => ['content' => base64_encode($content), 'format' => 'base64', 'extension' => $ext]]);
        }

        if (!in_array($ext, $textExts)) {
            return response()->json(['message' => 'File type not viewable as text.'], 422);
        }

        $content = file_get_contents($path);
        if ($content === false) {
            return response()->json(['message' => 'Failed to read file.'], 500);
        }

        return response()->json(['data' => ['content' => $content, 'format' => 'text', 'extension' => $ext]]);
    }

    public function updateContent(Request $request, TaskAttachment $attachment): JsonResponse
    {
        $request->validate([
            'content' => 'required|string',
            'format' => 'nullable|in:text,base64',
        ]);

        $path = $attachment->file_path;
        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        $ext = strtolower(pathinfo($attachment->file_name, PATHINFO_EXTENSION));
        $textExts = ['txt', 'csv', 'md', 'json', 'xml', 'html', 'htm', 'css', 'js', 'jsx', 'ts', 'tsx', 'php', 'py', 'rb', 'go', 'rs', 'java', 'cpp', 'c', 'h', 'sql', 'yml', 'yaml', 'ini', 'cfg', 'log', 'sh', 'bat', 'ps1', 'env', 'gitignore', 'dockerfile', 'conf'];
        $binaryExts = ['xlsx', 'xls'];

        $isBinary = in_array($ext, $binaryExts);
        $isText = in_array($ext, $textExts);

        if (!$isBinary && !$isText) {
            return response()->json(['message' => 'File type not editable.'], 422);
        }

        if ($isBinary) {
            $decoded = base64_decode($request->input('content'), true);
            if ($decoded === false) {
                return response()->json(['message' => 'Invalid base64 content.'], 422);
            }
            $written = file_put_contents($path, $decoded);
        } else {
            $written = file_put_contents($path, $request->input('content'));
        }

        if ($written === false) {
            return response()->json(['message' => 'Failed to write file.'], 500);
        }

        $attachment->task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'edited_attachment',
            'description' => 'Edited attachment: ' . $attachment->file_name,
        ]);

        return response()->json(['data' => $attachment]);
    }

    public function destroy(TaskAttachment $attachment): JsonResponse
    {
        $this->storage->delete($attachment->file_path);
        
        $attachment->task->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'removed_attachment',
            'description' => 'Removed attachment: ' . $attachment->file_name,
        ]);

        $attachment->delete();
        return response()->json(['ok' => true]);
    }
}
