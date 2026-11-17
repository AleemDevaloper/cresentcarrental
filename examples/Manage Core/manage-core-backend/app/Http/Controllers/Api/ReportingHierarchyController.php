<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReportingHierarchy;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportingHierarchyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ReportingHierarchy::with(['employee', 'manager', 'department']);

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('manager_id')) {
            $query->where('manager_id', $request->manager_id);
        }

        return response()->json(['data' => $query->latest()->paginate($request->per_page ?? 50)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:users,id',
            'manager_id' => 'required|exists:users,id|different:employee_id',
            'department_id' => 'nullable|exists:departments,id',
            'reporting_type' => 'nullable|string|in:direct,dotted,matrix',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:effective_date',
            'is_primary' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $hierarchy = DB::transaction(function () use ($validated, $request) {
            if ($validated['is_primary'] ?? false) {
                ReportingHierarchy::where('employee_id', $validated['employee_id'])
                    ->where('is_primary', true)
                    ->update(['is_primary' => false]);
            }

            return ReportingHierarchy::create([
                'employee_id' => $validated['employee_id'],
                'manager_id' => $validated['manager_id'],
                'department_id' => $validated['department_id'] ?? null,
                'reporting_type' => $validated['reporting_type'] ?? 'direct',
                'effective_date' => $validated['effective_date'],
                'end_date' => $validated['end_date'] ?? null,
                'is_primary' => $validated['is_primary'] ?? false,
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);
        });

        return response()->json(['data' => $hierarchy->load(['employee', 'manager'])], 201);
    }

    public function show(Request $request, User $user): JsonResponse
    {
        $hierarchies = ReportingHierarchy::where('employee_id', $user->id)
            ->with(['manager', 'department'])
            ->latest()
            ->get();

        $subordinates = ReportingHierarchy::where('manager_id', $user->id)
            ->with(['employee', 'department'])
            ->latest()
            ->get();

        return response()->json(['data' => [
            'user' => $user->load('profile'),
            'managers' => $hierarchies,
            'subordinates' => $subordinates,
            'direct_reports' => $subordinates->where('reporting_type', 'direct')->count(),
            'total_team_size' => $subordinates->count(),
        ]]);
    }

    public function orgChart(Request $request): JsonResponse
    {
        $topLevel = User::whereNull('manager_id')
            ->orWhereDoesntHave('managers')
            ->where('status', 'Active')
            ->with('profile')
            ->get();

        $chart = $topLevel->map(function ($user) {
            return $this->buildOrgTree($user);
        });

        return response()->json(['data' => $chart]);
    }

    public function departmentHierarchy(Request $request): JsonResponse
    {
        $request->validate(['department_id' => 'required|exists:departments,id']);

        $department = Department::with('designations')->findOrFail($request->department_id);

        $hierarchy = ReportingHierarchy::where('department_id', $department->id)
            ->with(['employee', 'manager'])
            ->get()
            ->groupBy(function ($item) {
                return optional($item->manager)->name ?? 'Unassigned';
            })
            ->map(function ($reports, $managerName) {
                return [
                    'manager' => $managerName,
                    'team_size' => $reports->count(),
                    'members' => $reports->pluck('employee.name'),
                ];
            })
            ->values();

        return response()->json(['data' => [
            'department' => $department,
            'hierarchy' => $hierarchy,
        ]]);
    }

    public function successors(Request $request): JsonResponse
    {
        $request->validate(['user_id' => 'required|exists:users,id']);

        $user = User::with('profile')->findOrFail($request->user_id);

        $potentialSuccessors = User::where('status', 'Active')
            ->where('id', '!=', $user->id)
            ->where(function ($q) use ($user) {
                $q->whereHas('profile', function ($p) use ($user) {
                    $p->where('department_id', optional($user->profile)->department_id);
                });
            })
            ->with('profile')
            ->get()
            ->map(function ($candidate) use ($user) {
                $readinessScore = $this->calculateReadinessScore($candidate, $user);
                return [
                    'user_id' => $candidate->id,
                    'name' => $candidate->name,
                    'email' => $candidate->email,
                    'designation' => optional($candidate->profile)->designation_id,
                    'readiness_score' => $readinessScore,
                    'readiness_level' => $readinessScore >= 80 ? 'Ready Now' : ($readinessScore >= 50 ? 'Ready in 1-2 Years' : 'Long Term'),
                ];
            })
            ->sortByDesc('readiness_score')
            ->values();

        return response()->json(['data' => [
            'employee' => ['id' => $user->id, 'name' => $user->name],
            'successors' => $potentialSuccessors,
        ]]);
    }

    private function buildOrgTree(User $user): array
    {
        $subordinates = ReportingHierarchy::where('manager_id', $user->id)
            ->with('employee')
            ->get();

        $children = $subordinates->map(function ($hierarchy) {
            return $this->buildOrgTree($hierarchy->employee);
        });

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'designation' => optional($user->profile)->designation_id,
            'avatar' => $user->avatar,
            'children' => $children,
        ];
    }

    private function calculateReadinessScore(User $candidate, User $position): int
    {
        $score = 50;

        $candidateSkills = collect(optional($candidate->profile)->skills ?? []);
        $positionSkills = collect(optional($position->profile)->skills ?? []);

        if ($candidateSkills->isNotEmpty() && $positionSkills->isNotEmpty()) {
            $matching = $candidateSkills->intersect($positionSkills)->count();
            $score += ($matching / max($positionSkills->count(), 1)) * 20;
        }

        $candidateExp = collect(optional($candidate->profile)->experience ?? []);
        $candidateYears = $candidateExp->sum(function ($exp) {
            $years = ($exp['end_year'] ?? date('Y')) - ($exp['start_year'] ?? date('Y'));
            return max(0, $years);
        });

        $score += min($candidateYears * 2, 15);

        if ($candidate->employee_type === 'permanent') {
            $score += 10;
        }

        if ($candidate->profile && $candidate->profile->certifications) {
            $score += min(count($candidate->profile->certifications) * 2, 5);
        }

        return min(100, max(0, $score));
    }
}
