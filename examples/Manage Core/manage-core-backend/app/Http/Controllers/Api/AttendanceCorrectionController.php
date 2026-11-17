<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApprovalRequest;
use App\Models\ApprovalHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AttendanceCorrectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = DB::table('attendance_corrections');

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('type', $request->category);
        }

        $corrections = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $corrections]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|string|in:missing_punch,late_entry,early_exit',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'reason' => 'required|string',
            'attachment' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        $correction = DB::transaction(function() use ($request, $data) {
            $userId = $request->user()->id;

            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $uploadPath = public_path('uploads/attendance-corrections');
                if (!is_dir($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                $filename = now()->format('YmdHis') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
                $attachmentPath = 'uploads/attendance-corrections/' . $filename;
            }

            $id = DB::table('attendance_corrections')->insertGetId([
                'user_id' => $userId,
                'type' => $data['type'],
                'date' => $data['date'],
                'time' => $data['time'],
                'reason' => $data['reason'],
                'attachment_path' => $attachmentPath,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $correction = DB::table('attendance_corrections')->find($id);

            $approval = ApprovalRequest::create([
                'requester_id' => $userId,
                'type' => 'attendance_correction',
                'approvable_id' => $id,
                'approvable_type' => 'attendance_correction',
                'reason' => $data['reason'],
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'pending',
                'metadata' => [
                    'type' => $data['type'],
                    'date' => $data['date'],
                    'time' => $data['time'],
                ]
            ]);

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $userId,
                'action' => 'created',
                'note' => 'Attendance correction submitted for approval.',
            ]);

            if (function_exists('notify')) {
                notify(
                    'New Attendance Correction',
                    "{$request->user()->name} has requested a correction for {$data['date']} ({$data['type']}).",
                    ['Admin', 'HR']
                );
            }

            return $correction;
        });

        return response()->json(['data' => $correction], 201);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        if ($request->user()->role !== 'Admin' && $request->user()->role !== 'HR') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|string|in:approved,rejected,pending',
        ]);

        DB::transaction(function () use ($request, $id, $data) {
            DB::table('attendance_corrections')->where('id', $id)->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);

            $approval = ApprovalRequest::where('approvable_type', 'attendance_correction')
                ->where('approvable_id', $id)
                ->latest()
                ->first();

            if ($approval) {
                $approval->update([
                    'status' => $data['status'],
                    'approver_id' => $request->user()->id,
                ]);

                ApprovalHistory::create([
                    'approval_request_id' => $approval->id,
                    'user_id' => $request->user()->id,
                    'action' => $data['status'],
                    'note' => "Attendance correction marked {$data['status']}.",
                ]);
            }
        });

        $correction = DB::table('attendance_corrections')->find($id);
        return response()->json(['data' => $correction]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $correction = DB::table('attendance_corrections')->find($id);

        if (!$correction) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($correction->user_id !== auth()->id() && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($correction->status !== 'pending' && auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Cannot delete non-pending corrections.'], 422);
        }

        if ($correction->attachment_path && file_exists(public_path($correction->attachment_path))) {
            @unlink(public_path($correction->attachment_path));
        }

        DB::table('attendance_corrections')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }
}
