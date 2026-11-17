<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RehireController extends Controller
{
    public function lookup(Request $request): JsonResponse
    {
        $search = $request->get('q');
        if (!$search || strlen($search) < 2) {
            return response()->json(['data' => []]);
        }

        $employees = User::whereIn('status', ['Resigned', 'Terminated'])
            ->where(function ($q) use ($search) {
                $q->where('email', 'LIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%")
                  ->orWhere('emp_id', 'LIKE', "%{$search}%");
            })
            ->select(['id', 'name', 'email', 'emp_id', 'status', 'exit_date', 'role'])
            ->get();

        return response()->json(['data' => $employees]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'previous_employee_id' => 'required|exists:users,id',
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string',
            'role' => 'required|string',
            'joining_date' => 'required|date',
            'designation' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'remarks' => 'nullable|string',
        ]);

        $rehire = DB::transaction(function() use ($request, $data) {
            $previousEmployee = User::findOrFail($data['previous_employee_id']);

            $newEmployee = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => $data['role'],
                'joining_date' => $data['joining_date'],
                'emp_id' => $this->generateEmpId(),
                'status' => 'Active',
                'password' => bcrypt('welcome'),
            ]);

            $rehireId = DB::table('rehire_records')->insertGetId([
                'employee_id' => $newEmployee->id,
                'previous_employee_id' => $previousEmployee->id,
                'previous_emp_code' => $previousEmployee->emp_id,
                'rehire_date' => $data['joining_date'],
                'status' => 'active',
                'service_continuity' => false,
                'previous_benefits_restored' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return DB::table('rehire_records')->find($rehireId);
        });

        return response()->json(['data' => $rehire], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = DB::table('rehire_records');

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('employee_id', $user->id)
                  ->orWhere('previous_employee_id', $user->id);
        }

        $rehires = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $rehires]);
    }

    public function show($id): JsonResponse
    {
        $rehire = DB::table('rehire_records')->where('id', $id)->first();
        if (!$rehire) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $rehire->previous_employee = User::find($rehire->previous_employee_id);
        $rehire->new_employee = User::find($rehire->employee_id);

        return response()->json(['data' => $rehire]);
    }

    private function generateEmpId(): string
    {
        $prefix = 'EMP';
        $last = User::where('emp_id', 'LIKE', "{$prefix}%")
            ->orderBy('emp_id', 'desc')
            ->first();

        if ($last && preg_match('/(\d+)$/', $last->emp_id, $m)) {
            return $prefix . str_pad((int)$m[1] + 1, 4, '0', STR_PAD_LEFT);
        }

        return $prefix . '0001';
    }
}
