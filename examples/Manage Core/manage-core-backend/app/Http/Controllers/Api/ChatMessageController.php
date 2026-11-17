<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(ChatSession $session, Request $request)
    {
        $chatRequest = $session->chatRequest;
        $userId = $request->user()->id;

        if ($chatRequest->from_user_id !== $userId && $chatRequest->to_user_id !== $userId) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $clearedAt = $chatRequest->from_user_id === $userId 
            ? $session->from_user_cleared_at 
            : $session->to_user_cleared_at;

        $query = $session->messages()->with(['sender:id,name,email']);

        if ($clearedAt) {
            $query->where('created_at', '>', $clearedAt);
        }

        $messages = $query->get()->map(fn ($m) => [
                'id' => $m->id,
                'senderId' => $m->sender_id,
                'text' => $m->text,
                'createdAt' => $m->created_at,
            ]);

        return response()->json(['data' => $messages]);
    }

    public function clear(ChatSession $session, Request $request)
    {
        $chatRequest = $session->chatRequest;
        $userId = $request->user()->id;

        if ($chatRequest->from_user_id !== $userId && $chatRequest->to_user_id !== $userId) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($chatRequest->from_user_id === $userId) {
            $session->update(['from_user_cleared_at' => now()]);
        } else {
            $session->update(['to_user_cleared_at' => now()]);
        }

        return response()->json(['message' => 'Chat cleared successfully.']);
    }

    public function store(ChatSession $session, Request $request)
    {
        $chatRequest = $session->chatRequest;
        $userId = $request->user()->id;

        if ($chatRequest->from_user_id !== $userId && $chatRequest->to_user_id !== $userId) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($chatRequest->status !== 'accepted') {
            return response()->json(['message' => 'Chat session is not active.'], 422);
        }

        $data = $request->validate([
            'text' => ['required', 'string', 'max:5000'],
        ]);

        $message = ChatMessage::create([
            'session_id' => $session->id,
            'sender_id' => $userId,
            'text' => $data['text'],
        ]);

        return response()->json([
            'id' => $message->id,
            'senderId' => $message->sender_id,
            'text' => $message->text,
            'createdAt' => $message->created_at,
        ], 201);
    }
}
