<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with(['department', 'lead', 'manager'])
            ->withCount('members')
            ->get();
            
        return response()->json([
            'data' => $teams
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'lead_id' => 'nullable|exists:users,id',
            'manager_id' => 'nullable|exists:users,id',
            'status' => 'required|in:active,inactive',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        $team = DB::transaction(function() use ($validated) {
            $team = Team::create($validated);
            
            if (isset($validated['member_ids'])) {
                $team->members()->sync($validated['member_ids']);
            }
            
            return $team;
        });

        return response()->json([
            'data' => $team->load(['department', 'lead', 'manager', 'members'])
        ], 201);
    }

    public function show(Team $team)
    {
        return response()->json([
            'data' => $team->load(['department', 'lead', 'manager', 'members'])
        ]);
    }

    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'lead_id' => 'nullable|exists:users,id',
            'manager_id' => 'nullable|exists:users,id',
            'status' => 'sometimes|required|in:active,inactive',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        DB::transaction(function() use ($team, $validated) {
            $team->update($validated);
            
            if (isset($validated['member_ids'])) {
                $team->members()->sync($validated['member_ids']);
            }
        });

        return response()->json([
            'data' => $team->load(['department', 'lead', 'manager', 'members'])
        ]);
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        // Placeholder stats
        return response()->json([
            'total_teams' => Team::count(),
            'active_members' => DB::table('team_user')->distinct('user_id')->count(),
            'open_tasks' => 0, // Need Task relationship
            'completed_tasks' => 0,
            'productivity' => '85%',
        ]);
    }
}
