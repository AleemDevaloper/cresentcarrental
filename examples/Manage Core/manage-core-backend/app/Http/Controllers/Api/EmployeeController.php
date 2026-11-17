<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('emp_id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('department_id') && $request->department_id !== '') {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        if ($request->has('employee_type') && $request->employee_type !== '') {
            $query->where('employee_type', $request->employee_type);
        }

        if ($request->has('manager_id') && $request->manager_id !== '') {
            $query->where('manager_id', $request->manager_id);
        }

        $perPage = $request->per_page ?? 25;
        $employees = $query->with(['profile', 'departments', 'role_ref', 'manager'])
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $employees->items(),
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'last_page' => $employees->lastPage(),
            ],
        ]);
    }

    public function show($id): JsonResponse
    {
        $employee = User::with([
            'profile',
            'departments',
            'role_ref',
            'manager',
            'subordinates',
        ])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found.'], 404);
        }

        return response()->json(['data' => $employee]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:500',
            'organization' => 'nullable|string|max:255',
            'emp_id' => 'nullable|string|unique:users,emp_id',
            'employee_type' => 'nullable|string|in:full_time,part_time,contract,intern',
            'joining_date' => 'nullable|date',
            'probation_end_date' => 'nullable|date',
            'confirmation_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,inactive,archived,suspended,probation',
            'role' => 'nullable|string',
            'role_id' => 'nullable|exists:roles,id',
            'manager_id' => 'nullable|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:50',
            'cnic_passport' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:10',
            'storage_limit_mb' => 'nullable|numeric|min:0',
        ]);

        $employee = DB::transaction(function () use ($validated, $request) {
            if (empty($validated['emp_id'])) {
                $lastEmp = User::whereNotNull('emp_id')
                    ->orderByRaw("CAST(SUBSTRING(emp_id, 3) AS UNSIGNED) DESC")
                    ->first();

                if ($lastEmp && preg_match('/^EM(\d+)$/', $lastEmp->emp_id, $matches)) {
                    $nextNum = (int) $matches[1] + 1;
                } else {
                    $nextNum = 1;
                }
                $validated['emp_id'] = 'EM' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
            }

            if (empty($validated['status'])) {
                $validated['status'] = 'active';
            }

            $validated['password'] = Hash::make($validated['password']);

            $departmentId = $validated['department_id'] ?? null;
            unset($validated['department_id']);

            $employee = User::create($validated);

            if ($departmentId) {
                $employee->department_id = $departmentId;
                $employee->save();
            }

            $employee->profile()->create([]);

            return $employee;
        });

        return response()->json([
            'data' => $employee->load(['profile', 'departments', 'role_ref']),
            'message' => 'Employee created successfully.',
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $employee = User::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:500',
            'organization' => 'nullable|string|max:255',
            'emp_id' => ['nullable', 'string', Rule::unique('users', 'emp_id')->ignore($id)],
            'employee_type' => 'nullable|string|in:full_time,part_time,contract,intern',
            'joining_date' => 'nullable|date',
            'probation_end_date' => 'nullable|date',
            'confirmation_date' => 'nullable|date',
            'exit_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,inactive,archived,suspended,probation',
            'role' => 'nullable|string',
            'role_id' => 'nullable|exists:roles,id',
            'manager_id' => 'nullable|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
            'password' => 'nullable|string|min:6',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:50',
            'cnic_passport' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:10',
            'storage_limit_mb' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($employee, $validated, $request) {
            if (isset($validated['password']) && $validated['password']) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $departmentId = $validated['department_id'] ?? null;
            unset($validated['department_id']);

            $employee->update($validated);

            if ($departmentId) {
                $employee->department_id = $departmentId;
                $employee->save();
            }

            if (!$employee->profile) {
                $employee->profile()->create([]);
            }

            $profileData = collect($validated)->only([
                'bank_name', 'account_number', 'cnic_passport',
                'emergency_contact_name', 'emergency_contact_phone',
                'blood_group',
            ])->filter()->toArray();

            if (!empty($profileData)) {
                $employee->profile->update($profileData);
            }
        });

        return response()->json([
            'data' => $employee->fresh(['profile', 'departments', 'role_ref', 'manager']),
            'message' => 'Employee updated successfully.',
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $employee = User::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found.'], 404);
        }

        $employee->update(['status' => 'inactive']);

        return response()->json([
            'message' => 'Employee deactivated successfully.',
        ]);
    }

    public function archive($id): JsonResponse
    {
        $employee = User::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found.'], 404);
        }

        $employee->update(['status' => 'archived']);

        return response()->json([
            'data' => $employee->fresh(),
            'message' => 'Employee archived successfully.',
        ]);
    }

    public function reactivate($id): JsonResponse
    {
        $employee = User::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found.'], 404);
        }

        $employee->update(['status' => 'active', 'exit_date' => null]);

        return response()->json([
            'data' => $employee->fresh(),
            'message' => 'Employee reactivated successfully.',
        ]);
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $csvContent = file_get_contents($file->getRealPath());
        $rows = array_map('str_getcsv', explode("\n", $csvContent));

        if (count($rows) < 2) {
            return response()->json(['message' => 'CSV file is empty or has no data rows.'], 422);
        }

        $headers = array_map('strtolower', array_map('trim', $rows[0]));
        unset($rows[0]);

        $results = [
            'success' => [],
            'errors' => [],
            'total' => 0,
            'imported' => 0,
            'failed' => 0,
        ];

        DB::transaction(function () use ($rows, $headers, &$results) {
            foreach ($rows as $index => $row) {
                $results['total']++;
                $rowNum = $index + 2;

                if (empty(array_filter($row)) || count($row) < 2) {
                    continue;
                }

                $data = array_combine($headers, $row);
                $data = array_map('trim', $data);

                try {
                    $email = $data['email'] ?? null;
                    $name = $data['name'] ?? null;

                    if (!$email || !$name) {
                        throw new \Exception('Name and email are required.');
                    }

                    if (User::where('email', $email)->exists()) {
                        throw new \Exception("Email '{$email}' already exists.");
                    }

                    $empId = $data['emp_id'] ?? null;
                    if (!$empId) {
                        $lastEmp = User::whereNotNull('emp_id')
                            ->orderByRaw("CAST(SUBSTRING(emp_id, 3) AS UNSIGNED) DESC")
                            ->first();
                        if ($lastEmp && preg_match('/^EM(\d+)$/', $lastEmp->emp_id, $matches)) {
                            $nextNum = (int) $matches[1] + 1;
                        } else {
                            $nextNum = 1;
                        }
                        $empId = 'EM' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
                    } elseif (User::where('emp_id', $empId)->exists()) {
                        throw new \Exception("Employee ID '{$empId}' already exists.");
                    }

                    $password = $data['password'] ?? 'password123';

                    $employee = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make($password),
                        'emp_id' => $empId,
                        'first_name' => $data['first_name'] ?? null,
                        'last_name' => $data['last_name'] ?? null,
                        'phone' => $data['phone'] ?? null,
                        'gender' => $data['gender'] ?? null,
                        'dob' => !empty($data['dob']) ? $data['dob'] : null,
                        'address' => $data['address'] ?? null,
                        'city' => $data['city'] ?? null,
                        'country' => $data['country'] ?? null,
                        'organization' => $data['organization'] ?? null,
                        'employee_type' => $data['employee_type'] ?? 'full_time',
                        'joining_date' => !empty($data['joining_date']) ? $data['joining_date'] : null,
                        'status' => $data['status'] ?? 'active',
                        'role' => $data['role'] ?? null,
                        'bank_name' => $data['bank_name'] ?? null,
                        'account_number' => $data['account_number'] ?? null,
                        'cnic_passport' => $data['cnic_passport'] ?? null,
                        'blood_group' => $data['blood_group'] ?? null,
                        'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
                        'emergency_contact_phone' => $data['emergency_contact_phone'] ?? null,
                    ]);

                    $employee->profile()->create([]);
                    $employee->departments()->associate($data['department_id'] ?? null)->save();

                    $results['success'][] = [
                        'row' => $rowNum,
                        'emp_id' => $empId,
                        'name' => $name,
                        'email' => $email,
                    ];
                    $results['imported']++;
                } catch (\Exception $e) {
                    $results['errors'][] = [
                        'row' => $rowNum,
                        'email' => $data['email'] ?? 'N/A',
                        'error' => $e->getMessage(),
                    ];
                    $results['failed']++;
                }
            }
        });

        return response()->json([
            'data' => $results,
            'message' => "Import complete: {$results['imported']} imported, {$results['failed']} failed out of {$results['total']} rows.",
        ]);
    }

    public function export(Request $request): Response
    {
        $query = User::query();

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('department_id') && $request->department_id !== '') {
            $query->where('department_id', $request->department_id);
        }

        $employees = $query->with(['profile', 'departments'])->latest()->get();

        $callback = function () use ($employees) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'emp_id', 'name', 'first_name', 'last_name', 'email', 'phone',
                'gender', 'dob', 'address', 'city', 'country', 'organization',
                'employee_type', 'joining_date', 'status', 'role', 'department',
                'manager', 'blood_group', 'emergency_contact_name', 'emergency_contact_phone',
                'bank_name', 'account_number', 'cnic_passport',
            ]);

            foreach ($employees as $employee) {
                fputcsv($handle, [
                    $employee->emp_id,
                    $employee->name,
                    $employee->first_name,
                    $employee->last_name,
                    $employee->email,
                    $employee->phone,
                    $employee->gender,
                    $employee->dob?->format('Y-m-d'),
                    $employee->address,
                    $employee->city,
                    $employee->country,
                    $employee->organization,
                    $employee->employee_type,
                    $employee->joining_date?->format('Y-m-d'),
                    $employee->status,
                    $employee->role,
                    $employee->departments?->name,
                    $employee->manager?->name,
                    $employee->blood_group,
                    $employee->emergency_contact_name,
                    $employee->emergency_contact_phone,
                    $employee->bank_name,
                    $employee->account_number,
                    $employee->cnic_passport,
                ]);
            }

            fclose($handle);
        };

        $filename = 'employees_export_' . now()->format('Y-m-d_His') . '.csv';

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
