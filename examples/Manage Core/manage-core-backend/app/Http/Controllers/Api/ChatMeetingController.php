<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMeeting;
use Illuminate\Http\Request;

class ChatMeetingController extends Controller
{
    public function index(Request $request)
    {
        $meetings = ChatMeeting::with('organizer:id,name,email')
            ->latest('scheduled_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'description' => $m->description,
                'organizer' => [
                    'id' => $m->organizer->id,
                    'name' => $m->organizer->name,
                    'email' => $m->organizer->email,
                ],
                'scheduledAt' => $m->scheduled_at,
                'durationMinutes' => $m->duration_minutes,
                'status' => $m->status,
                'meetingUrl' => $m->meeting_url,
                'recordingUrl' => $m->recording_url,
                'createdAt' => $m->created_at,
            ]);

        return response()->json(['data' => $meetings]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'nullable|integer|min:5|max:480',
            'meeting_url' => 'nullable|url|max:500',
        ]);

        $meeting = ChatMeeting::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'organizer_id' => $request->user()->id,
            'scheduled_at' => $data['scheduled_at'],
            'duration_minutes' => $data['duration_minutes'] ?? 30,
            'meeting_url' => $data['meeting_url'] ?? null,
            'status' => 'scheduled',
        ]);

        notify(
            'New Meeting Scheduled',
            "{$request->user()->name} scheduled a meeting: {$meeting->title}",
            ['admin']
        );

        return response()->json([
            'data' => $meeting->load('organizer:id,name,email')
        ], 201);
    }

    public function show(ChatMeeting $meeting)
    {
        return response()->json([
            'data' => $meeting->load('organizer:id,name,email')
        ]);
    }

    public function update(Request $request, ChatMeeting $meeting)
    {
        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the organizer can update.'], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'scheduled_at' => 'sometimes|date',
            'duration_minutes' => 'sometimes|integer|min:5|max:480',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
            'meeting_url' => 'nullable|url|max:500',
        ]);

        $meeting->update($data);

        return response()->json([
            'data' => $meeting->load('organizer:id,name,email')
        ]);
    }

    public function destroy(ChatMeeting $meeting, Request $request)
    {
        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the organizer can cancel.'], 403);
        }

        $meeting->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Meeting cancelled.']);
    }

    public function recording(ChatMeeting $meeting)
    {
        return response()->json([
            'data' => [
                'id' => $meeting->id,
                'recordingUrl' => $meeting->recording_url,
                'status' => $meeting->status,
            ]
        ]);
    }

    public function updateRecording(Request $request, ChatMeeting $meeting)
    {
        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the organizer can update recording.'], 403);
        }

        $data = $request->validate([
            'recording_url' => 'required|url|max:500',
        ]);

        $meeting->update(['recording_url' => $data['recording_url']]);

        return response()->json([
            'data' => [
                'id' => $meeting->id,
                'recordingUrl' => $meeting->recording_url,
            ]
        ]);
    }
}
