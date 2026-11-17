<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StorageLimitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->user()->role;

        $query = User::query();
        if ($role !== 'SuperAdmin') {
            $query->where('role', '!=', 'SuperAdmin');
        }

        $users = $query->get()->map(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'usedSpace' => $user->used_storage_mb,
                'totalSpace' => $user->storage_limit_mb,
                'unit' => 'MB',
            ];
        });

        return response()->json([
            'data' => $users,
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'storage_limit_mb' => 'required|integer|min:0',
        ]);

        $user->update([
            'storage_limit_mb' => $data['storage_limit_mb'],
        ]);

        return response()->json([
            'message' => 'Storage limit updated successfully.',
            'data' => [
                'id' => $user->id,
                'storage_limit_mb' => $user->storage_limit_mb,
            ],
        ]);
    }
}
