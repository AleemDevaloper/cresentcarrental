<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportConversation;
use App\Models\SupportConversationParticipant;
use App\Models\SupportMessage;
use App\Models\User;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function stats(Request $request)
    {
        $role = $request->user()->role;
        if ($role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $open = SupportConversation::where('status', 'Open')->count();
        $resolved = SupportConversation::where('status', 'Resolved')->count();
        $closed = SupportConversation::where('status', 'Closed')->count();

        $totalCompanyAdmins = User::where('role', 'Admin')
            ->orWhere('role', 'CompanyAdmin')
            ->count();

        return response()->json([
            'open' => $open,
            'resolved' => $resolved,
            'closed' => $closed,
            'totalCompanyAdmins' => $totalCompanyAdmins,
            'totalConversations' => SupportConversation::count(),
        ]);
    }

    public function conversations(Request $request)
    {
        $userId = $request->user()->id;
        $role = $request->user()->role;

        if ($role === 'SuperAdmin' || $role === 'Admin') {
            $conversations = SupportConversation::with([
                'users:id,name,email,role',
                'latestMessage.sender:id,name'
            ])->latest()->get();
        } else {
            $conversationIds = SupportConversationParticipant::where('user_id', $userId)
                ->pluck('conversation_id');
            $conversations = SupportConversation::whereIn('id', $conversationIds)
                ->with(['users:id,name,email,role', 'latestMessage.sender:id,name'])
                ->latest()
                ->get();
        }

        return response()->json([
            'data' => $conversations->map(fn ($c) => [
                'id' => $c->id,
                'subject' => $c->subject,
                'status' => $c->status,
                'users' => $c->users->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                ]),
                'latestMessage' => $c->latestMessage ? [
                    'text' => $c->latestMessage->text,
                    'senderName' => $c->latestMessage->sender?->name,
                    'createdAt' => $c->latestMessage->created_at,
                ] : null,
                'createdAt' => $c->created_at,
            ]),
        ]);
    }

    public function createConversation(Request $request)
    {
        $data = $request->validate([
            'subject' => ['nullable', 'string', 'max:255'],
            'userIds' => ['required', 'array', 'min:1'],
            'userIds.*' => ['integer', 'exists:users,id'],
        ]);

        $currentUser = $request->user();
        $allUserIds = array_unique(array_merge($data['userIds'], [$currentUser->id]));

        $conversation = SupportConversation::create([
            'subject' => $data['subject'] ?? null,
        ]);

        foreach ($allUserIds as $uid) {
            SupportConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $uid,
            ]);
        }

        return response()->json([
            'id' => $conversation->id,
            'subject' => $conversation->subject,
            'createdAt' => $conversation->created_at,
        ], 201);
    }

    public function showConversation($id, Request $request)
    {
        $conversation = SupportConversation::with([
            'users:id,name,email,role',
            'messages.sender:id,name,email,role',
        ])->findOrFail($id);

        $userId = $request->user()->id;
        $isParticipant = $conversation->users->contains('id', $userId);
        $role = $request->user()->role;

        if (!$isParticipant && $role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'id' => $conversation->id,
            'subject' => $conversation->subject,
            'status' => $conversation->status,
            'users' => $conversation->users->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
            ]),
            'messages' => $conversation->messages->map(fn ($m) => [
                'id' => $m->id,
                'senderId' => $m->sender_id,
                'sender' => $m->sender ? [
                    'id' => $m->sender->id,
                    'name' => $m->sender->name,
                    'email' => $m->sender->email,
                    'role' => $m->sender->role,
                ] : null,
                'text' => $m->text,
                'createdAt' => $m->created_at,
            ]),
            'createdAt' => $conversation->created_at,
        ]);
    }

    public function addMessage($id, Request $request)
    {
        $conversation = SupportConversation::with('users')->findOrFail($id);

        $userId = $request->user()->id;
        $isParticipant = $conversation->users->contains('id', $userId);
        $role = $request->user()->role;

        if (!$isParticipant && $role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($conversation->status === 'Closed') {
            return response()->json(['message' => 'Cannot send messages in a closed conversation.'], 422);
        }

        if ($conversation->status === 'Resolved') {
            $conversation->update(['status' => 'Open', 'closed_at' => null]);
        }

        $data = $request->validate([
            'text' => ['required', 'string', 'max:5000'],
        ]);

        $message = SupportMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'text' => $data['text'],
        ]);

        return response()->json([
            'id' => $message->id,
            'senderId' => $message->sender_id,
            'sender' => ['id' => $request->user()->id, 'name' => $request->user()->name, 'role' => $request->user()->role],
            'text' => $message->text,
            'createdAt' => $message->created_at,
        ], 201);
    }

    public function addParticipant($id, Request $request)
    {
        $role = $request->user()->role;
        if ($role !== 'SuperAdmin' && $role !== 'Admin') {
            return response()->json(['message' => 'Only admins can add participants.'], 403);
        }

        $conversation = SupportConversation::findOrFail($id);

        $data = $request->validate([
            'userId' => ['required', 'integer', 'exists:users,id'],
        ]);

        $existing = SupportConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $data['userId'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'User is already a participant.'], 422);
        }

        SupportConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $data['userId'],
        ]);

        return response()->json(['message' => 'Participant added.']);
    }

    public function updateConversationStatus($id, Request $request)
    {
        $conversation = SupportConversation::with('users')->findOrFail($id);

        $userId = $request->user()->id;
        $isParticipant = $conversation->users->contains('id', $userId);
        if (!$isParticipant) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => ['required', 'in:Open,Resolved,Closed'],
        ]);

        $update = ['status' => $data['status']];
        if ($data['status'] === 'Closed' || $data['status'] === 'Resolved') {
            $update['closed_at'] = now();
        } else {
            $update['closed_at'] = null;
        }

        $conversation->update($update);

        return response()->json([
            'id' => $conversation->id,
            'status' => $conversation->status,
        ]);
    }

    public function availableUsers(Request $request)
    {
        $role = $request->user()->role;
        $userId = $request->user()->id;

        $query = User::select('id', 'name', 'email', 'role')->where('id', '!=', $userId);

        if ($role !== 'SuperAdmin' && $role !== 'Admin') {
            $query->whereIn('role', ['SuperAdmin', 'Admin']);
        }

        $users = $query->get()->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
        ]);

        return response()->json(['data' => $users]);
    }
}
