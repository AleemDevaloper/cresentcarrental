<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmCalendarEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmCalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmCalendarEvent::query();
        if ($request->filled('start')) $query->where('start_at', '>=', $request->input('start'));
        if ($request->filled('end')) $query->where('start_at', '<=', $request->input('end'));
        if ($request->filled('owner_id')) $query->where('owner_id', $request->input('owner_id'));
        if ($request->filled('type')) $query->where('type', $request->input('type'));
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        if ($request->filled('related_type')) $query->where('related_type', $request->input('related_type'));
        $items = $query->orderBy('start_at')->get();
        return response()->json(['success' => true, 'data' => $items]);
    }

    public function monthView(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $start = \Carbon\Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        // Combine calendar events with activities
        $events = CrmCalendarEvent::whereBetween('start_at', [$start, $end])->get();
        $activities = \App\Models\CrmActivity::whereBetween('due_date', [$start, $end])
            ->whereNotNull('due_date')->get();
        $tasks = \App\Models\CrmTask::whereBetween('due_date', [$start, $end])
            ->whereNotNull('due_date')->get();
        $followUps = \App\Models\CrmFollowUp::whereBetween('due_at', [$start, $end])
            ->whereIn('status', ['pending', 'due'])->get();

        $combined = collect();
        foreach ($events as $e) {
            $combined->push([
                'id' => $e->id,
                'type' => 'event',
                'title' => $e->title,
                'start_at' => $e->start_at,
                'end_at' => $e->end_at,
                'status' => $e->status,
                'color' => $e->color,
            ]);
        }
        foreach ($activities as $a) {
            $combined->push([
                'id' => $a->id,
                'type' => 'activity',
                'title' => $a->subject,
                'start_at' => $a->due_date,
                'status' => $a->status,
                'color' => '#6366f1',
                'activity_type' => $a->type,
            ]);
        }
        foreach ($tasks as $t) {
            $combined->push([
                'id' => $t->id,
                'type' => 'task',
                'title' => $t->title,
                'start_at' => $t->due_date,
                'status' => $t->status,
                'color' => '#f59e0b',
            ]);
        }
        foreach ($followUps as $f) {
            $combined->push([
                'id' => $f->id,
                'type' => 'follow_up',
                'title' => $f->subject,
                'start_at' => $f->due_at,
                'status' => $f->status,
                'color' => '#10b981',
            ]);
        }

        return response()->json(['success' => true, 'data' => $combined->sortBy('start_at')->values()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|in:meeting,call,event,task,reminder',
            'status' => 'nullable|in:scheduled,completed,cancelled',
            'start_at' => 'required|date',
            'end_at' => 'nullable|date',
            'all_day' => 'nullable|boolean',
            'location' => 'nullable|string',
            'timezone' => 'nullable|string',
            'color' => 'nullable|string',
            'owner_id' => 'nullable|integer',
            'related_type' => 'nullable|string',
            'related_id' => 'nullable|integer',
            'attendees' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);
        $validated['created_by'] = auth()->id();
        $event = CrmCalendarEvent::create($validated);
        return response()->json(['success' => true, 'data' => $event], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $event = CrmCalendarEvent::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|in:scheduled,completed,cancelled',
            'start_at' => 'sometimes|date',
            'end_at' => 'nullable|date',
            'all_day' => 'nullable|boolean',
            'location' => 'nullable|string',
            'color' => 'nullable|string',
            'attendees' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);
        $event->update($validated);
        return response()->json(['success' => true, 'data' => $event->fresh()]);
    }

    public function destroy($id): JsonResponse
    {
        $event = CrmCalendarEvent::findOrFail($id);
        $event->delete();
        return response()->json(['success' => true, 'message' => 'Event deleted']);
    }
}