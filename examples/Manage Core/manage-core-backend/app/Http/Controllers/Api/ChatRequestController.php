<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatRequest;
use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Http\Request;

class ChatRequestController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $incoming = ChatRequest::where('to_user_id', $userId)
            ->with(['fromUser:id,name,email,last_seen_at', 'session'])
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'fromId' => $r->from_user_id,
                'fromUser' => [
                    'id' => $r->fromUser->id, 
                    'name' => $r->fromUser->name, 
                    'email' => $r->fromUser->email,
                    'isOnline' => $r->fromUser->is_online
                ],
                'status' => $r->status,
                'sessionId' => $r->session?->id,
                'createdAt' => $r->created_at,
            ]);

        $outgoing = ChatRequest::where('from_user_id', $userId)
            ->with(['toUser:id,name,email,last_seen_at', 'session'])
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'toId' => $r->to_user_id,
                'toUser' => [
                    'id' => $r->toUser->id, 
                    'name' => $r->toUser->name, 
                    'email' => $r->toUser->email,
                    'isOnline' => $r->toUser->is_online
                ],
                'status' => $r->status,
                'sessionId' => $r->session?->id,
                'createdAt' => $r->created_at,
            ]);

        return response()->json([
            'incoming' => $incoming,
            'outgoing' => $outgoing,
        ]);
    }

    public function disconnect($sessionId)
    {
        $session = ChatSession::findOrFail($sessionId);
        $chatRequest = $session->chatRequest;

        if (!in_array(auth()->id(), [$chatRequest->from_user_id, $chatRequest->to_user_id])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete session and reset request status
        $session->delete();
        $chatRequest->update(['status' => 'rejected']); // Setting to rejected so they can re-send if needed

        return response()->json(['message' => 'Chat disconnected successfully.']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'toUserId' => ['required', 'integer', 'exists:users,id'],
        ]);

        $fromUserId = $request->user()->id;
        $toUserId = $data['toUserId'];

        if ($fromUserId === $toUserId) {
            return response()->json(['message' => 'Cannot send request to yourself.'], 422);
        }

        $existing = ChatRequest::where(function ($q) use ($fromUserId, $toUserId) {
            $q->where('from_user_id', $fromUserId)->where('to_user_id', $toUserId);
        })->orWhere(function ($q) use ($fromUserId, $toUserId) {
            $q->where('from_user_id', $toUserId)->where('to_user_id', $fromUserId);
        })->first();

        if ($existing) {
            if ($existing->status === 'rejected') {
                // If it was rejected, we allow "resetting" it to pending by the new sender
                $existing->update([
                    'from_user_id' => $fromUserId,
                    'to_user_id' => $toUserId,
                    'status' => 'pending',
                ]);

                notify(
                    "New Chat Request",
                    "User sent you a chat request again",
                    ['Admin']
                );

                return response()->json([
                    'id' => $existing->id,
                    'fromId' => $existing->from_user_id,
                    'toId' => $existing->to_user_id,
                    'status' => $existing->status,
                    'createdAt' => $existing->created_at,
                ], 200);
            }
            
            return response()->json(['message' => 'A request or chat already exists with this user.'], 422);
        }

        $request = ChatRequest::create([
            'from_user_id' => $fromUserId,
            'to_user_id' => $toUserId,
            'status' => 'pending',
        ]);

        notify(
            "New Chat Request",
            "User sent you a chat request",
            ['admin']
        );

        return response()->json([
            'id' => $request->id,
            'fromId' => $request->from_user_id,
            'toId' => $request->to_user_id,
            'status' => $request->status,
            'createdAt' => $request->created_at,
        ], 201);
    }

    public function accept($id)
    {
        $chatRequest = ChatRequest::findOrFail($id);

        if ($chatRequest->to_user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You cannot accept this request.',
                'debug' => [
                    'request_to' => $chatRequest->to_user_id,
                    'auth_id' => auth()->id()
                ]
            ], 403);
        }

        if ($chatRequest->status !== 'pending') {
            return response()->json(['message' => 'This request is no longer pending.'], 422);
        }

        $chatRequest->update(['status' => 'accepted']);

        $session = ChatSession::create([
            'chat_request_id' => $chatRequest->id,
        ]);

        notify(
            "Chat Request Accepted",
            "Your chat request was accepted",
            ['admin']
        );

        return response()->json([
            'id' => $chatRequest->id,
            'status' => $chatRequest->status,
            'sessionId' => $session->id,
        ]);
    }

    public function reject($id)
    {
        $chatRequest = ChatRequest::findOrFail($id);

        if ($chatRequest->to_user_id !== auth()->id()) {
            return response()->json(['message' => 'You cannot reject this request.'], 403);
        }

        if ($chatRequest->status !== 'pending') {
            return response()->json(['message' => 'This request is no longer pending.'], 422);
        }

        $chatRequest->update(['status' => 'rejected']);

        return response()->json(['message' => 'Request rejected.']);
    }
}
