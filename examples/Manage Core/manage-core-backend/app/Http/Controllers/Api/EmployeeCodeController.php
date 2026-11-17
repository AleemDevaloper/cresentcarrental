<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeCodeController extends Controller
{
    public function config(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($request->isMethod('get')) {
            $config = DB::table('employee_code_configs')->first();
            if (!$config) {
                $config = (object)[
                    'prefix' => 'EMP',
                    'format' => 'PREFIX-NUMBER',
                    'mode' => 'auto',
                    'next_number' => 1,
                    'padding' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            return response()->json(['data' => $config]);
        }

        $data = $request->validate([
            'prefix' => 'nullable|string|max:10',
            'format' => 'nullable|string|in:PREFIX-NUMBER,NUMBER-PREFIX,PREFIX-YEAR-NUMBER',
            'mode' => 'nullable|string|in:auto,manual',
            'next_number' => 'nullable|integer|min:1',
            'padding' => 'nullable|integer|min:2|max:10',
        ]);

        $config = DB::table('employee_code_configs')->first();
        $updateData = array_merge([
            'prefix' => $data['prefix'] ?? ($config->prefix ?? 'EMP'),
            'format' => $data['format'] ?? ($config->format ?? 'PREFIX-NUMBER'),
            'mode' => $data['mode'] ?? ($config->mode ?? 'auto'),
            'next_number' => $data['next_number'] ?? ($config->next_number ?? 1),
            'padding' => $data['padding'] ?? ($config->padding ?? 4),
            'updated_at' => now(),
        ]);

        if ($config) {
            DB::table('employee_code_configs')->where('id', $config->id)->update($updateData);
        } else {
            $updateData['created_at'] = now();
            DB::table('employee_code_configs')->insert($updateData);
        }

        return response()->json(['data' => DB::table('employee_code_configs')->first()]);
    }

    public function generate(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $config = DB::table('employee_code_configs')->first();
        if (!$config || $config->mode !== 'auto') {
            return response()->json(['message' => 'Auto-generation is disabled or not configured.'], 422);
        }

        $code = $this->buildCode($config, $config->next_number);

        DB::table('employee_code_configs')->where('id', $config->id)->update([
            'next_number' => $config->next_number + 1,
            'updated_at' => now(),
        ]);

        DB::table('employee_code_histories')->insert([
            'user_id' => $request->user()->id,
            'employee_code' => $code,
            'action' => 'generated',
            'changed_by' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => ['code' => $code]]);
    }

    public function validateCode(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string',
        ]);

        $exists = User::where('emp_id', $data['code'])->exists();
        return response()->json(['data' => ['valid' => !$exists, 'exists' => $exists]]);
    }

    public function lock(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'code' => 'required|string|exists:users,emp_id',
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($data['user_id']);

        $historyId = DB::table('employee_code_histories')->insertGetId([
            'user_id' => $data['user_id'],
            'employee_code' => $data['code'],
            'action' => 'locked',
            'changed_by' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => [
            'code' => $data['code'],
            'user' => $user->name,
            'locked' => true,
        ]]);
    }

    public function history(Request $request): JsonResponse
    {
        $query = DB::table('employee_code_histories')->orderBy('created_at', 'desc');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $history = $query->get();
        return response()->json(['data' => $history]);
    }

    private function buildCode($config, $number): string
    {
        $padded = str_pad($number, $config->padding ?? 4, '0', STR_PAD_LEFT);
        $prefix = $config->prefix ?? 'EMP';

        return match ($config->format ?? 'PREFIX-NUMBER') {
            'NUMBER-PREFIX' => $padded . $prefix,
            'PREFIX-YEAR-NUMBER' => $prefix . now()->format('y') . $padded,
            default => $prefix . $padded,
        };
    }
}
