<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebsiteContactMessage;
use App\Models\WebsiteDemoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteLeadController extends Controller
{
    // ====================
    // Public submission endpoints (marketing website)
    // ====================

    public function storeDemo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'product' => 'nullable|string|max:255',
        ]);

        $lead = WebsiteDemoRequest::create($validated);

        return response()->json([
            'message' => 'Demo request received. Our team will contact you shortly.',
            'data' => $lead,
        ], 201);
    }

    public function storeContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'service' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $lead = WebsiteContactMessage::create($validated);

        return response()->json([
            'message' => 'Thank you for reaching out. We will get back to you soon.',
            'data' => $lead,
        ], 201);
    }

    // ====================
    // Superadmin listing / management
    // ====================

    private function ensureSuperAdmin(): ?JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return null;
    }

    public function listDemoRequests(Request $request): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $query = WebsiteDemoRequest::query()->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('product', 'like', "%{$search}%");
            });
        }
        if ($request->filled('status') && $request->string('status') !== 'all') {
            $query->where('status', $request->string('status'));
        }

        $items = $query->paginate($request->integer('per_page', 50));

        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'total' => $items->total(),
                'new_count' => WebsiteDemoRequest::where('status', 'new')->count(),
                'currentPage' => $items->currentPage(),
                'lastPage' => $items->lastPage(),
            ],
        ]);
    }

    public function listContactMessages(Request $request): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $query = WebsiteContactMessage::query()->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }
        if ($request->filled('status') && $request->string('status') !== 'all') {
            $query->where('status', $request->string('status'));
        }

        $items = $query->paginate($request->integer('per_page', 50));

        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'total' => $items->total(),
                'new_count' => WebsiteContactMessage::where('status', 'new')->count(),
                'currentPage' => $items->currentPage(),
                'lastPage' => $items->lastPage(),
            ],
        ]);
    }

    public function updateDemoRequest(Request $request, $id): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $lead = WebsiteDemoRequest::find($id);
        if (!$lead) return response()->json(['error' => 'Not found'], 404);

        $validated = $request->validate([
            'status' => 'sometimes|in:new,in_progress,handled,archived',
            'notes' => 'sometimes|nullable|string|max:5000',
        ]);
        $lead->update($validated);
        if (in_array($lead->status, ['handled', 'archived']) && !$lead->read_at) {
            $lead->update(['read_at' => now()]);
        }

        return response()->json(['message' => 'Demo request updated', 'data' => $lead]);
    }

    public function updateContactMessage(Request $request, $id): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $lead = WebsiteContactMessage::find($id);
        if (!$lead) return response()->json(['error' => 'Not found'], 404);

        $validated = $request->validate([
            'status' => 'sometimes|in:new,in_progress,handled,archived',
            'notes' => 'sometimes|nullable|string|max:5000',
        ]);
        $lead->update($validated);
        if (in_array($lead->status, ['handled', 'archived']) && !$lead->read_at) {
            $lead->update(['read_at' => now()]);
        }

        return response()->json(['message' => 'Contact message updated', 'data' => $lead]);
    }

    public function deleteDemoRequest($id): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $lead = WebsiteDemoRequest::find($id);
        if (!$lead) return response()->json(['error' => 'Not found'], 404);
        $lead->delete();

        return response()->json(['message' => 'Demo request deleted']);
    }

    public function deleteContactMessage($id): JsonResponse
    {
        if ($resp = $this->ensureSuperAdmin()) return $resp;

        $lead = WebsiteContactMessage::find($id);
        if (!$lead) return response()->json(['error' => 'Not found'], 404);
        $lead->delete();

        return response()->json(['message' => 'Contact message deleted']);
    }
}
