<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatChannel;
use App\Models\ChatChannelMember;
use App\Models\ChatChannelMessage;
use App\Models\ChatFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ChatChannelController extends Controller
{
    // ── Channels ──────────────────────────────────────────

    public function index(Request $request)
    {
        $user = $request->user();

        $channels = ChatChannel::where('is_active', true)
            ->where(function ($q) use ($user) {
                $q->where('type', 'public')
                  ->orWhereHas('members', fn ($m) => $m->where('user_id', $user->id));
            })
            ->withCount(['messages', 'members'])
            ->with(['creator:id,name,email'])
            ->latest()
            ->get();

        return response()->json(['data' => $channels]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:public,private,direct',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        return DB::transaction(function () use ($request, $data) {
            $channel = ChatChannel::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'type' => $data['type'],
                'created_by' => $request->user()->id,
            ]);

            ChatChannelMember::create([
                'channel_id' => $channel->id,
                'user_id' => $request->user()->id,
                'role' => 'admin',
            ]);

            if (!empty($data['member_ids'])) {
                foreach ($data['member_ids'] as $memberId) {
                    if ($memberId !== $request->user()->id) {
                        ChatChannelMember::create([
                            'channel_id' => $channel->id,
                            'user_id' => $memberId,
                            'role' => 'member',
                        ]);
                    }
                }
            }

            return response()->json([
                'data' => $channel->load(['creator:id,name,email', 'members.user:id,name,email'])
            ], 201);
        });
    }

    public function show(ChatChannel $channel)
    {
        return response()->json([
            'data' => $channel->load([
                'creator:id,name,email',
                'members.user:id,name,email',
                'messages.user:id,name,email',
            ])
        ]);
    }

    public function update(Request $request, ChatChannel $channel)
    {
        $member = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $request->user()->id)
            ->where('role', 'admin')
            ->first();

        if (!$member) {
            return response()->json(['message' => 'Only channel admins can update.'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
        ]);

        $channel->update($data);

        return response()->json(['data' => $channel]);
    }

    public function destroy(ChatChannel $channel, Request $request)
    {
        $member = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $request->user()->id)
            ->where('role', 'admin')
            ->first();

        if (!$member) {
            return response()->json(['message' => 'Only channel admins can delete.'], 403);
        }

        $channel->update(['is_active' => false]);

        return response()->json(['message' => 'Channel deactivated.']);
    }

    // ── Members ───────────────────────────────────────────

    public function addMember(Request $request, ChatChannel $channel)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|in:admin,member',
        ]);

        $existing = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $data['user_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'User is already a member.'], 422);
        }

        $member = ChatChannelMember::create([
            'channel_id' => $channel->id,
            'user_id' => $data['user_id'],
            'role' => $data['role'] ?? 'member',
        ]);

        return response()->json([
            'data' => $member->load('user:id,name,email')
        ], 201);
    }

    public function removeMember(ChatChannel $channel, $userId)
    {
        $member = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $userId)
            ->first();

        if (!$member) {
            return response()->json(['message' => 'Member not found.'], 404);
        }

        $member->delete();

        return response()->json(['message' => 'Member removed.']);
    }

    // ── Messages ──────────────────────────────────────────

    public function messages(Request $request, ChatChannel $channel)
    {
        $isMember = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (!$isMember && $channel->type !== 'public') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $messages = $channel->messages()
            ->with(['user:id,name,email', 'replies.user:id,name,email'])
            ->whereNull('parent_id')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'userId' => $m->user_id,
                'user' => $m->user ? ['id' => $m->user->id, 'name' => $m->user->name, 'email' => $m->user->email] : null,
                'content' => $m->content,
                'type' => $m->type,
                'parentId' => $m->parent_id,
                'replies' => $m->replies->map(fn ($r) => [
                    'id' => $r->id,
                    'userId' => $r->user_id,
                    'user' => $r->user ? ['id' => $r->user->id, 'name' => $r->user->name, 'email' => $r->user->email] : null,
                    'content' => $r->content,
                    'type' => $r->type,
                    'createdAt' => $r->created_at,
                ]),
                'createdAt' => $m->created_at,
            ]);

        return response()->json(['data' => $messages]);
    }

    public function storeMessage(Request $request, ChatChannel $channel)
    {
        $member = ChatChannelMember::where('channel_id', $channel->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$member && $channel->type !== 'public') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'content' => 'required|string|max:5000',
            'type' => 'nullable|in:text,file,image,system',
            'parent_id' => 'nullable|exists:chat_channel_messages,id',
        ]);

        $message = ChatChannelMessage::create([
            'channel_id' => $channel->id,
            'user_id' => $request->user()->id,
            'content' => $data['content'],
            'type' => $data['type'] ?? 'text',
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        if ($member) {
            $member->update(['last_read_at' => now()]);
        }

        return response()->json([
            'data' => $message->load('user:id,name,email')
        ], 201);
    }

    // ── Search ────────────────────────────────────────────

    public function search(Request $request)
    {
        $data = $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $query = $data['q'];
        $userId = $request->user()->id;

        $messages = ChatChannelMessage::whereHas('channel', function ($q) use ($userId) {
            $q->where('type', 'public')
              ->orWhereHas('members', fn ($m) => $m->where('user_id', $userId));
        })
        ->where('content', 'like', "%{$query}%")
        ->with(['user:id,name,email', 'channel:id,name'])
        ->latest()
        ->limit(50)
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'content' => $m->content,
            'type' => $m->type,
            'user' => ['id' => $m->user->id, 'name' => $m->user->name],
            'channel' => ['id' => $m->channel->id, 'name' => $m->channel->name],
            'createdAt' => $m->created_at,
        ]);

        return response()->json(['data' => $messages]);
    }

    // ── File Upload / Download ────────────────────────────

    public function upload(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|file|max:20480',
            'channel_id' => 'nullable|exists:chat_channels,id',
        ]);

        $file = $request->file('file');
        $path = $file->store('chat-files', 'public');

        $chatFile = ChatFile::create([
            'user_id' => $request->user()->id,
            'channel_id' => $data['channel_id'] ?? null,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'file_type' => $file->getMimeType(),
        ]);

        return response()->json([
            'data' => [
                'id' => $chatFile->id,
                'fileName' => $chatFile->file_name,
                'filePath' => $chatFile->file_path,
                'fileSize' => $chatFile->file_size,
                'fileType' => $chatFile->file_type,
                'url' => Storage::disk('public')->url($path),
            ]
        ], 201);
    }

    public function files(Request $request)
    {
        $files = ChatFile::where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($f) => [
                'id' => $f->id,
                'fileName' => $f->file_name,
                'filePath' => $f->file_path,
                'fileSize' => $f->file_size,
                'fileType' => $f->file_type,
                'channelId' => $f->channel_id,
                'url' => Storage::disk('public')->url($f->file_path),
                'createdAt' => $f->created_at,
            ]);

        return response()->json(['data' => $files]);
    }

    // ── Presence ──────────────────────────────────────────

    public function presence(Request $request)
    {
        $request->validate(['last_seen_at' => 'nullable|date']);

        $request->user()->update([
            'last_seen_at' => $request->input('last_seen_at') ?? now(),
        ]);

        $onlineUsers = User::where('last_seen_at', '>', now()->subMinutes(5))
            ->get(['id', 'name', 'email', 'last_seen_at'])
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'isOnline' => true,
                'lastSeenAt' => $u->last_seen_at,
            ]);

        return response()->json(['data' => $onlineUsers]);
    }

    public function getPresence()
    {
        $onlineUsers = User::where('last_seen_at', '>', now()->subMinutes(5))
            ->get(['id', 'name', 'email', 'last_seen_at'])
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'isOnline' => true,
                'lastSeenAt' => $u->last_seen_at,
            ]);

        return response()->json(['data' => $onlineUsers]);
    }

    // ── Collaboration Metrics ─────────────────────────────

    public function collaborationMetrics(Request $request)
    {
        $userId = $request->user()->id;

        $metrics = [
            'total_channels' => ChatChannel::where('is_active', true)
                ->where('type', 'public')
                ->orWhereHas('members', fn ($q) => $q->where('user_id', $userId))
                ->count(),
            'total_messages_today' => ChatChannelMessage::where('user_id', $userId)
                ->whereDate('created_at', now()->toDateString())
                ->count(),
            'total_messages_all_time' => ChatChannelMessage::where('user_id', $userId)
                ->count(),
            'active_users_today' => ChatChannelMessage::whereDate('created_at', now()->toDateString())
                ->distinct('user_id')
                ->count('user_id'),
            'channels_joined' => ChatChannelMember::where('user_id', $userId)->count(),
            'files_uploaded' => ChatFile::where('user_id', $userId)->count(),
            'meetings_organized' => \App\Models\ChatMeeting::where('organizer_id', $userId)->count(),
        ];

        return response()->json(['data' => $metrics]);
    }

    // ── Approvals (channel-specific) ──────────────────────

    public function approvals(Request $request)
    {
        $userId = $request->user()->id;

        if ($request->isMethod('post')) {
            $data = $request->validate([
                'channel_id' => 'required|exists:chat_channels,id',
                'type' => 'required|string',
                'reason' => 'nullable|string',
                'priority' => 'nullable|in:low,medium,high,urgent',
            ]);

            $approval = \App\Models\ApprovalRequest::create([
                'requester_id' => $userId,
                'type' => $data['type'],
                'approvable_id' => $data['channel_id'],
                'approvable_type' => ChatChannel::class,
                'reason' => $data['reason'] ?? null,
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'pending',
            ]);

            return response()->json(['data' => $approval], 201);
        }

        $approvals = \App\Models\ApprovalRequest::where('approvable_type', ChatChannel::class)
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)
                  ->orWhere('approver_id', $userId);
            })
            ->with(['requester:id,name,email', 'approver:id,name,email'])
            ->latest()
            ->get();

        return response()->json(['data' => $approvals]);
    }

    public function updateApproval(Request $request, $id)
    {
        $approval = \App\Models\ApprovalRequest::where('approvable_type', ChatChannel::class)
            ->findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'comment' => 'nullable|string',
        ]);

        $approval->update([
            'status' => $data['status'],
            'approver_id' => $request->user()->id,
        ]);

        if (!empty($data['comment'])) {
            \App\Models\ApprovalComment::create([
                'approval_request_id' => $approval->id,
                'user_id' => $request->user()->id,
                'comment' => $data['comment'],
            ]);
        }

        \App\Models\ApprovalHistory::create([
            'approval_request_id' => $approval->id,
            'user_id' => $request->user()->id,
            'action' => $data['status'],
            'note' => $data['comment'] ?? null,
        ]);

        return response()->json(['data' => $approval->load(['requester', 'approver'])]);
    }
}
