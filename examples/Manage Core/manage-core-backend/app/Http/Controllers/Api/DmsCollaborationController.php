<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DmsDocument;
use App\Models\DmsDiscussion;
use App\Models\DmsDiscussionReply;
use App\Models\DmsCollaborationTask;
use App\Models\DmsAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DmsCollaborationController extends Controller
{
    public function discussions($documentId): JsonResponse
    {
        try {
            $discussions = DmsDiscussion::where('document_id', $documentId)
                ->with(['user', 'replies.user'])
                ->latest()
                ->get()
                ->map(function ($discussion) {
                    return [
                        'id' => $discussion->id,
                        'title' => $discussion->title,
                        'content' => $discussion->content,
                        'user' => $discussion->user?->name,
                        'user_avatar' => null,
                        'is_resolved' => $discussion->is_resolved,
                        'resolved_by' => $discussion->resolver?->name,
                        'resolved_at' => $discussion->resolved_at,
                        'replies_count' => $discussion->replies->count(),
                        'replies' => $discussion->replies->map(function ($reply) {
                            return [
                                'id' => $reply->id,
                                'content' => $reply->content,
                                'user' => $reply->user?->name,
                                'user_avatar' => null,
                                'created_at' => $reply->created_at,
                            ];
                        }),
                        'created_at' => $discussion->created_at,
                    ];
                });

            return response()->json(['data' => $discussions]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function createDiscussion(Request $request, $documentId): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            $document = DmsDocument::findOrFail($documentId);

            $discussion = DmsDiscussion::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'title' => $request->title,
                'content' => $request->content,
            ]);

            DmsAuditLog::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'action' => 'discussion_created',
                'details' => ['title' => $request->title],
                'ip_address' => $request->ip(),
            ]);

            $discussion->load('user');

            return response()->json([
                'data' => [
                    'id' => $discussion->id,
                    'title' => $discussion->title,
                    'content' => $discussion->content,
                    'user' => $discussion->user?->name,
                    'replies' => [],
                    'replies_count' => 0,
                    'created_at' => $discussion->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function addReply(Request $request, $discussionId): JsonResponse
    {
        try {
            $request->validate(['content' => 'required|string']);

            $discussion = DmsDiscussion::findOrFail($discussionId);

            $reply = DmsDiscussionReply::create([
                'discussion_id' => $discussionId,
                'user_id' => auth()->id(),
                'content' => $request->content,
            ]);

            DmsAuditLog::create([
                'document_id' => $discussion->document_id,
                'user_id' => auth()->id(),
                'action' => 'discussion_reply_added',
                'details' => ['discussion_id' => $discussionId],
                'ip_address' => $request->ip(),
            ]);

            $reply->load('user');

            return response()->json([
                'data' => [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'user' => $reply->user?->name,
                    'created_at' => $reply->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function tasks($documentId): JsonResponse
    {
        try {
            $tasks = DmsCollaborationTask::where('document_id', $documentId)
                ->with(['assignee', 'creator'])
                ->latest()
                ->get()
                ->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'priority' => $task->priority,
                        'status' => $task->status,
                        'assignee' => $task->assignee?->name,
                        'created_by' => $task->creator?->name,
                        'due_date' => $task->due_date,
                        'completed_at' => $task->completed_at,
                        'created_at' => $task->created_at,
                    ];
                });

            return response()->json(['data' => $tasks]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function createTask(Request $request, $documentId): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'priority' => 'nullable|string|in:low,medium,high,critical',
                'status' => 'nullable|string|in:pending,in_progress,completed',
                'assigned_to' => 'nullable|exists:users,id',
                'due_date' => 'nullable|date',
            ]);

            $document = DmsDocument::findOrFail($documentId);

            $task = DmsCollaborationTask::create([
                'document_id' => $documentId,
                'assigned_to' => $request->assigned_to,
                'created_by' => auth()->id(),
                'title' => $request->title,
                'description' => $request->description,
                'priority' => $request->priority ?? 'medium',
                'status' => $request->status ?? 'pending',
                'due_date' => $request->due_date,
            ]);

            DmsAuditLog::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'action' => 'collaboration_task_created',
                'details' => ['title' => $request->title, 'assigned_to' => $request->assigned_to],
                'ip_address' => $request->ip(),
            ]);

            $task->load(['assignee', 'creator']);

            return response()->json([
                'data' => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'assignee' => $task->assignee?->name,
                    'created_by' => $task->creator?->name,
                    'due_date' => $task->due_date,
                    'created_at' => $task->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateTask(Request $request, $taskId): JsonResponse
    {
        try {
            $task = DmsCollaborationTask::findOrFail($taskId);

            $request->validate([
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'priority' => 'nullable|string|in:low,medium,high,critical',
                'status' => 'nullable|string|in:pending,in_progress,completed',
                'assigned_to' => 'nullable|exists:users,id',
                'due_date' => 'nullable|date',
            ]);

            $data = $request->only(['title', 'description', 'priority', 'status', 'assigned_to', 'due_date']);

            if ($request->status === 'completed' && $task->status !== 'completed') {
                $data['completed_at'] = now();
            } elseif ($request->status !== 'completed') {
                $data['completed_at'] = null;
            }

            $task->update(array_filter($data, fn($value) => $value !== null));

            DmsAuditLog::create([
                'document_id' => $task->document_id,
                'user_id' => auth()->id(),
                'action' => 'collaboration_task_updated',
                'details' => ['task_id' => $taskId, 'changes' => array_keys($data)],
                'ip_address' => $request->ip(),
            ]);

            $task->load(['assignee', 'creator']);

            return response()->json([
                'data' => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'assignee' => $task->assignee?->name,
                    'created_by' => $task->creator?->name,
                    'due_date' => $task->due_date,
                    'completed_at' => $task->completed_at,
                    'created_at' => $task->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
