<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Models\SignatureAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ESignatureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SignatureRequest::with(['creator', 'signers']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $requests = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $requests->items(),
            'meta' => [
                'total' => $requests->total(),
                'currentPage' => $requests->currentPage(),
                'lastPage' => $requests->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf',
            'expires_at' => 'nullable|date',
            'signers' => 'required|array|min:1',
            'signers.*.email' => 'required|email',
            'signers.*.user_id' => 'nullable|exists:users,id',
            'signers.*.order' => 'integer|min:1',
        ]);

        return DB::transaction(function() use ($request, $validated) {
            $path = $request->file('file')->store('signatures');

            $signatureRequest = SignatureRequest::create([
                'title' => $validated['title'],
                'document_path' => $path,
                'creator_id' => $request->user()->id,
                'status' => 'pending',
                'expires_at' => $validated['expires_at'] ?? null,
            ]);

            foreach ($validated['signers'] as $signerData) {
                $signatureRequest->signers()->create([
                    'user_id' => $signerData['user_id'] ?? null,
                    'email' => $signerData['email'],
                    'signing_order' => $signerData['order'] ?? 1,
                    'status' => 'pending',
                ]);
            }

            $signatureRequest->auditLogs()->create([
                'action' => 'Created',
                'user_id' => $request->user()->id,
                'details' => 'Signature request initiated.',
            ]);

            return response()->json(['data' => $signatureRequest->load('signers')], 201);
        });
    }

    public function sign(Request $request, SignatureSigner $signer): JsonResponse
    {
        if ($signer->status !== 'pending') {
            return response()->json(['message' => 'Already signed or rejected'], 422);
        }

        return DB::transaction(function() use ($request, $signer) {
            $signer->update([
                'status' => 'signed',
                'signed_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $signatureRequest = $signer->request;
            
            $signatureRequest->auditLogs()->create([
                'action' => 'Signed',
                'user_id' => $signer->user_id ?? $request->user()?->id,
                'details' => "Signed by {$signer->email}.",
            ]);

            // Check if all signed
            if (!$signatureRequest->signers()->where('status', '!=', 'signed')->exists()) {
                $signatureRequest->update(['status' => 'completed']);
                $signatureRequest->auditLogs()->create([
                    'action' => 'Completed',
                    'details' => 'All parties have signed.',
                ]);
            }

            return response()->json(['data' => $signer]);
        });
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'pendingRequests' => SignatureRequest::where('status', 'pending')->count(),
                'completedSignatures' => SignatureRequest::where('status', 'completed')->count(),
                'rejectedRequests' => SignatureRequest::where('status', 'rejected')->count(),
                'expiredRequests' => SignatureRequest::where('status', 'expired')->count(),
            ]
        ]);
    }
}
