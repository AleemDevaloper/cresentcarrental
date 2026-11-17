<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::with('designations')->get();
        return response()->json(['data' => $departments]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'nullable|string|max:20',
            'head_of_department' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $department = Department::create($data);

        return response()->json(['data' => $department], 201);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'nullable|string|max:20',
            'head_of_department' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $department->update($data);

        return response()->json(['data' => $department]);
    }

    public function destroy(Department $department): JsonResponse
    {
        $department->delete();
        return response()->json(['ok' => true]);
    }

    public function storeDesignation(Request $request, Department $department): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:50',
            'salary_band' => 'nullable|string|max:100',
            'performance_score' => 'nullable|integer|min:0|max:100',
            'reports_to' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $designation = $department->designations()->create($data);

        return response()->json(['data' => $designation], 201);
    }

    public function updateDesignation(Request $request, Designation $designation): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:50',
            'salary_band' => 'nullable|string|max:100',
            'performance_score' => 'nullable|integer|min:0|max:100',
            'reports_to' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $designation->update($data);

        return response()->json(['data' => $designation]);
    }

    public function destroyDesignation(Designation $designation): JsonResponse
    {
        $designation->delete();
        return response()->json(['ok' => true]);
    }
}
