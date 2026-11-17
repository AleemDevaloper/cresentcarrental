<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApprovalRequest;
use App\Models\ApprovalComment;
use App\Models\ApprovalHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ApprovalRequest::with(['requester', 'approver', 'approvable', 'comments.user']);

        // Filter by role
        if ($request->has('view') && $request->view === 'admin') {
            // Admins see everything
        } elseif ($request->has('role') && $request->role === 'approver') {
            $query->where(function($q) use ($user) {
                $q->where('approver_id', $user->id)
                  ->orWhereNull('approver_id');
            });
        } else {
            $query->where('requester_id', $user->id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('requester', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('type', 'like', "%{$search}%")
              ->orWhere('id', 'like', "%{$search}%");
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        return response()->json([
            'data' => $query->latest()->get()
        ]);
    }

    public function stats(Request $request)
    {
        $stats = [
            'pending' => ApprovalRequest::where('status', 'pending')->count(),
            'approved_today' => ApprovalRequest::where('status', 'approved')->whereDate('updated_at', now())->count(),
            'rejected_today' => ApprovalRequest::where('status', 'rejected')->whereDate('updated_at', now())->count(),
            'high_priority' => ApprovalRequest::whereIn('priority', ['high', 'urgent'])->where('status', 'pending')->count(),
        ];

        return response()->json($stats);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'approvable_id' => 'required|integer',
            'approvable_type' => 'required|string',
            'reason' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'metadata' => 'nullable|array',
            'approver_id' => 'nullable|exists:users,id',
        ]);

        $approval = DB::transaction(function() use ($request, $data) {
            $approval = ApprovalRequest::create([
                'requester_id' => $request->user()->id,
                'approver_id' => $data['approver_id'] ?? null,
                'type' => $data['type'],
                'approvable_id' => $data['approvable_id'],
                'approvable_type' => $data['approvable_type'],
                'reason' => $data['reason'] ?? null,
                'priority' => $data['priority'] ?? 'medium',
                'metadata' => $data['metadata'] ?? null,
                'status' => 'pending',
            ]);

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $request->user()->id,
                'action' => 'created',
                'note' => 'Request submitted.',
            ]);

            // Notify Admins
            notify(
                'New Approval Request',
                "A new {$approval->type} request has been submitted by {$request->user()->name}.",
                ['Admin']
            );

            return $approval;
        });

        return response()->json([
            'data' => $approval->load(['requester', 'approver', 'approvable'])
        ], 201);
    }

    public function update(Request $request, ApprovalRequest $approval)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,approved,rejected,cancelled,in_review,escalated,sent_back',
            'comment' => 'nullable|string',
        ]);

        DB::transaction(function() use ($request, $approval, $data) {
            $approval->update([
                'status' => $data['status'],
                'approver_id' => $request->user()->id,
            ]);

            if ($data['comment']) {
                ApprovalComment::create([
                    'approval_request_id' => $approval->id,
                    'user_id' => $request->user()->id,
                    'comment' => $data['comment'],
                ]);
            }

            ApprovalHistory::create([
                'approval_request_id' => $approval->id,
                'user_id' => $request->user()->id,
                'action' => $data['status'],
                'note' => $data['comment'] ?? null,
            ]);

            // Notify Requester (Note: You might want to add a specific role for the user or handle personal notifications differently, but for now we'll notify the admin too or if we had a per-user notify system)
            // However, the current notify function only takes roles. 
            // Let's check if there is a way to notify a specific user.
            // Looking at the Notification model, it only has a 'role' field.
            
            notify(
                'Request Status Updated',
                "Your {$approval->type} request has been {$data['status']}.",
                ['Admin'] // Since the notification system only supports roles for now, we'll notify Admin, but ideally it should be the user.
            );

            // Handle deletion requests: delete the user when approved
            if ($approval->type === 'deletion' && $data['status'] === 'approved') {
                $approvable = $approval->approvable;
                if ($approvable instanceof \App\Models\User) {
                    $approvable->delete();
                }
            }

            // Update the actual record's status if it has one and the request is approved/rejected
            if (in_array($data['status'], ['approved', 'rejected'])) {
                $approvable = $approval->approvable;
                if ($approvable && isset($approvable->status)) {
                    $approvable->update(['status' => $data['status']]);
                }
            }
        });

        return response()->json([
            'data' => $approval->load(['requester', 'approver', 'approvable', 'comments.user', 'history.user'])
        ]);
    }

    public function show(ApprovalRequest $approval)
    {
        return response()->json([
            'data' => $approval->load(['requester', 'approver', 'approvable', 'comments.user', 'history.user'])
        ]);
    }

    public function addComment(Request $request, ApprovalRequest $approval)
    {
        $data = $request->validate([
            'comment' => 'required|string',
        ]);

        $comment = ApprovalComment::create([
            'approval_request_id' => $approval->id,
            'user_id' => $request->user()->id,
            'comment' => $data['comment'],
        ]);

        return response()->json([
            'data' => $comment->load('user')
        ], 201);
    }
}
