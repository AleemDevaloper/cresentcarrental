<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        $milestones = $project->milestones()->latest()->get();
        return response()->json(['data' => $milestones]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        if (isset($data['due_date']) && $data['due_date'] === '') {
            $data['due_date'] = null;
        }
        if (isset($data['status']) && $data['status'] === '') {
            $data['status'] = null;
        }

        $milestone = $project->milestones()->create($data);

        return response()->json(['data' => $milestone], 201);
    }

    public function show(Milestone $milestone): JsonResponse
    {
        return response()->json(['data' => $milestone]);
    }

    public function update(Request $request, Milestone $milestone): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        if (array_key_exists('due_date', $data) && $data['due_date'] === '') {
            $data['due_date'] = null;
        }
        if (array_key_exists('status', $data) && $data['status'] === '') {
            $data['status'] = null;
        }

        $milestone->update($data);

        return response()->json(['data' => $milestone]);
    }

    public function destroy(Milestone $milestone): JsonResponse
    {
        $milestone->delete();
        return response()->json(['ok' => true]);
    }
}
