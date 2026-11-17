<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DmsDocument;
use App\Models\DmsFolder;
use App\Models\DmsDocumentVersion;
use App\Models\DmsDocumentSignature;
use App\Models\DmsDocumentApproval;
use App\Models\DmsAuditLog;
use App\Models\DmsDocumentComment;
use App\Models\DmsDocumentShare;
use App\Models\DmsTemplate;
use App\Support\SqlHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DmsController extends Controller
{
    public function stats(): JsonResponse
    {
        try {
            $totalDocuments = DmsDocument::count();
            $activeDocuments = DmsDocument::where('is_archived', false)
                ->where('status', '!=', 'draft')
                ->count();
            $pendingApprovals = DmsDocumentApproval::where('status', 'pending')->count();
            $signedDocuments = DmsDocument::where('signature_status', 'signed')->count();
            $expiredDocuments = DmsDocument::whereNotNull('expires_at')
                ->where('expires_at', '<', now())
                ->count();
            $storageBytes = DmsDocument::sum('file_size');
            $storageUsed = $this->formatBytes($storageBytes);
            $sharedDocuments = DmsDocumentShare::where('is_revoked', false)->count();
            $documentRequests = DmsDocumentApproval::where('status', 'pending')->count();

            $recentDocuments = DmsDocument::with(['folder', 'owner'])
                ->latest()
                ->take(10)
                ->get();

            $storageByType = DmsDocument::select('file_type', DB::raw('SUM(file_size) as total_size'))
                ->whereNotNull('file_type')
                ->groupBy('file_type')
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => $item->file_type,
                        'size_bytes' => (int) $item->total_size,
                        'size_formatted' => $this->formatBytes($item->total_size),
                    ];
                });

            $trend = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $dayName = now()->subDays($i)->format('D');
                $count = DmsDocument::whereDate('created_at', $date)->count();
                $trend[] = [
                    'day' => $dayName,
                    'date' => $date,
                    'count' => $count,
                ];
            }

            return response()->json([
                'data' => [
                    'totalDocuments' => $totalDocuments,
                    'activeDocuments' => $activeDocuments,
                    'pendingApprovals' => $pendingApprovals,
                    'signedDocuments' => $signedDocuments,
                    'expiredDocuments' => $expiredDocuments,
                    'storageUsed' => $storageUsed,
                    'storageBytes' => $storageBytes,
                    'sharedDocuments' => $sharedDocuments,
                    'documentRequests' => $documentRequests,
                    'recentDocuments' => $recentDocuments,
                    'storageByType' => $storageByType,
                    'trend' => $trend,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function folders(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $folders = DmsFolder::withCount('documents')
                ->with(['owner', 'parent'])
                ->withSum('documents', 'file_size')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->paginate($perPage);

            $folderItems = $folders->getCollection()->map(function ($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'slug' => $folder->slug,
                    'description' => $folder->description,
                    'color' => $folder->color,
                    'icon' => $folder->icon,
                    'access_level' => $folder->access_level,
                    'department' => $folder->department,
                    'is_archived' => $folder->is_archived,
                    'sort_order' => $folder->sort_order,
                    'parent_id' => $folder->parent_id,
                    'parent_name' => $folder->parent?->name,
                    'owner_id' => $folder->owner_id,
                    'owner_name' => $folder->owner?->name,
                    'documents_count' => $folder->documents_count,
                    'storage_used' => $this->formatBytes($folder->documents_sum_file_size ?? 0),
                    'created_by' => $folder->created_by,
                    'updated_at' => $folder->updated_at,
                    'created_at' => $folder->created_at,
                ];
            });

            return response()->json([
                'data' => $folderItems->values()->all(),
                'pagination' => [
                    'current_page' => $folders->currentPage(),
                    'per_page' => $folders->perPage(),
                    'total' => $folders->total(),
                    'last_page' => $folders->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeFolder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|exists:dms_folders,id',
                'color' => 'nullable|string|max:20',
                'icon' => 'nullable|string|max:50',
                'access_level' => 'nullable|string|max:50',
                'department' => 'nullable|string|max:100',
                'sort_order' => 'nullable|integer',
            ]);

            $folder = DmsFolder::create([
                'tenant_id' => auth()->user()?->tenant_id,
                'parent_id' => $validated['parent_id'] ?? null,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'color' => $validated['color'] ?? null,
                'icon' => $validated['icon'] ?? null,
                'access_level' => $validated['access_level'] ?? 'private',
                'department' => $validated['department'] ?? null,
                'sort_order' => $validated['sort_order'] ?? 0,
                'owner_id' => auth()->id(),
                'created_by' => auth()->id(),
            ]);

            return response()->json(['data' => $folder], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateFolder(Request $request, $id): JsonResponse
    {
        try {
            $folder = DmsFolder::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|exists:dms_folders,id',
                'color' => 'nullable|string|max:20',
                'icon' => 'nullable|string|max:50',
                'access_level' => 'nullable|string|max:50',
                'department' => 'nullable|string|max:100',
                'is_archived' => 'nullable|boolean',
                'sort_order' => 'nullable|integer',
            ]);

            if (isset($validated['name'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $folder->update($validated);

            return response()->json(['data' => $folder]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function deleteFolder($id): JsonResponse
    {
        try {
            $folder = DmsFolder::with('documents.versions')->findOrFail($id);

            $folder->documents->each(function ($doc) {
                if ($doc->file_path && Storage::disk('public')->exists($doc->file_path)) {
                    Storage::disk('public')->delete($doc->file_path);
                }
                $doc->versions->each(function ($v) {
                    if ($v->file_path && Storage::disk('public')->exists($v->file_path)) {
                        Storage::disk('public')->delete($v->file_path);
                    }
                });
            });

            $folder->documents()->delete();
            $folder->delete();

            return response()->json(['message' => 'Folder and contents deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documents(Request $request): JsonResponse
    {
        try {
            $query = DmsDocument::with(['folder', 'owner', 'creator']);

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            if ($request->filled('folder_id')) {
                if ($request->input('folder_id') === 'none') {
                    $query->whereNull('folder_id');
                } else {
                    $query->where('folder_id', $request->input('folder_id'));
                }
            }

            if ($request->filled('type')) {
                $query->where('file_type', $request->input('type'));
            }

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->filled('owner_id')) {
                $query->where('owner_id', $request->input('owner_id'));
            }

            if ($request->filled('department')) {
                $query->where('department', $request->input('department'));
            }

            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->input('date_from'));
            }

            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->input('date_to'));
            }

            if ($request->filled('tags')) {
                $tags = explode(',', $request->input('tags'));
                $query->where(function ($q) use ($tags) {
                    foreach ($tags as $tag) {
                        $q->where('tags', 'like', "%{$tag}%");
                    }
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $allowedSorts = ['name', 'created_at', 'updated_at', 'file_size', 'status', 'view_count'];
            if (!in_array($sortBy, $allowedSorts)) {
                $sortBy = 'created_at';
            }
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');

            $perPage = $request->input('per_page', 15);
            $documents = $query->paginate($perPage);

            return response()->json([
                'data' => $documents->items(),
                'pagination' => [
                    'current_page' => $documents->currentPage(),
                    'per_page' => $documents->perPage(),
                    'total' => $documents->total(),
                    'last_page' => $documents->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeDocument(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'folder_id' => 'nullable|exists:dms_folders,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'nullable|file|max:102400',
                'file_type' => 'nullable|string|max:100',
                'file_extension' => 'nullable|string|max:20',
                'department' => 'nullable|string|max:100',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'metadata' => 'nullable|array',
                'confidentiality' => 'nullable|string|max:50',
                'retention_policy' => 'nullable|string|max:100',
                'retention_until' => 'nullable|date',
                'expires_at' => 'nullable|date',
                'project_id' => 'nullable|integer',
                'client_id' => 'nullable|integer',
                'status' => 'nullable|string|max:50',
                'is_template' => 'nullable|boolean',
            ]);

            $data = [
                'tenant_id' => auth()->user()?->tenant_id,
                'folder_id' => $validated['folder_id'] ?? null,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'file_type' => $validated['file_type'] ?? null,
                'file_extension' => $validated['file_extension'] ?? null,
                'department' => $validated['department'] ?? null,
                'tags' => $validated['tags'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
                'confidentiality' => $validated['confidentiality'] ?? 'internal',
                'retention_policy' => $validated['retention_policy'] ?? null,
                'retention_until' => $validated['retention_until'] ?? null,
                'expires_at' => $validated['expires_at'] ?? null,
                'project_id' => $validated['project_id'] ?? null,
                'client_id' => $validated['client_id'] ?? null,
                'status' => $validated['status'] ?? 'draft',
                'version' => 1,
                'owner_id' => auth()->id(),
                'created_by' => auth()->id(),
                'is_template' => $validated['is_template'] ?? false,
            ];

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = 'dms/' . date('Y/m') . '/' . $filename;
                Storage::disk('public')->putFileAs('dms/' . date('Y/m'), $file, $filename);

                $data['file_path'] = $path;
                $data['file_type'] = $data['file_type'] ?? $file->getClientOriginalExtension();
                $data['file_extension'] = $file->getClientOriginalExtension();
                $data['file_size'] = $file->getSize();
                $data['mime_type'] = $file->getMimeType();
            }

            $document = DmsDocument::create($data);

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'created',
                'details' => ['name' => $document->name],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['data' => $document->append('preview_url')], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function showDocument($id): JsonResponse
    {
        try {
            $document = DmsDocument::with([
                'folder',
                'versions.creator',
                'signatures.signer',
                'approvals.approver',
                'comments.user',
                'comments.replies.user',
                'shares.sharedBy',
                'shares.sharedWithUser',
                'auditLogs.user',
                'owner',
                'creator',
            ])->findOrFail($id);

            $document->increment('view_count');
            $document->update(['last_viewed_at' => now()]);

            return response()->json(['data' => $document->append('preview_url')]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateDocument(Request $request, $id): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($id);

            $validated = $request->validate([
                'folder_id' => 'nullable|exists:dms_folders,id',
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'department' => 'nullable|string|max:100',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'metadata' => 'nullable|array',
                'confidentiality' => 'nullable|string|max:50',
                'status' => 'nullable|string|max:50',
                'is_archived' => 'nullable|boolean',
                'watermark_enabled' => 'nullable|boolean',
                'download_limit' => 'nullable|integer',
                'expires_at' => 'nullable|date',
                'retention_policy' => 'nullable|string|max:100',
                'retention_until' => 'nullable|date',
            ]);

            if (isset($validated['name'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $document->update($validated);

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'updated',
                'details' => ['updated_fields' => array_keys($validated)],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['data' => $document->fresh()->append('preview_url')]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function downloadDocument($id): StreamedResponse|JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($id);

            if (!$document->file_path || !Storage::disk('public')->exists($document->file_path)) {
                return response()->json(['message' => 'File not found'], 404);
            }

            $document->increment('download_count');

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'downloaded',
                'details' => ['name' => $document->name],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return Storage::disk('public')->download($document->file_path, $document->name);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function serveFile($id): StreamedResponse|JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($id);

            if (!$document->file_path || !Storage::disk('public')->exists($document->file_path)) {
                return response()->json(['message' => 'File not found'], 404);
            }

            $document->increment('view_count');
            $document->update(['last_viewed_at' => now()]);

            return Storage::disk('public')->response($document->file_path);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function deleteDocument($id): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($id);

            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            $document->versions()->each(function ($version) {
                if ($version->file_path && Storage::disk('public')->exists($version->file_path)) {
                    Storage::disk('public')->delete($version->file_path);
                }
            });

            $document->delete();

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'deleted',
                'details' => ['name' => $document->name],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return response()->json(['message' => 'Document deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentVersions(Request $request, $documentId): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $versions = DmsDocumentVersion::where('document_id', $documentId)
                ->with('creator')
                ->orderBy('version', 'desc')
                ->paginate($perPage);

            return response()->json([
                'data' => $versions->items(),
                'pagination' => [
                    'current_page' => $versions->currentPage(),
                    'per_page' => $versions->perPage(),
                    'total' => $versions->total(),
                    'last_page' => $versions->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeDocumentVersion(Request $request, $documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $request->validate([
                'file' => 'required|file|max:102400',
                'comment' => 'nullable|string|max:1000',
            ]);

            $file = $request->file('file');
            $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('dms/' . date('Y/m'), $file, $filename);

            $newVersion = ($document->versions()->max('version') ?? 0) + 1;

            $version = DmsDocumentVersion::create([
                'document_id' => $document->id,
                'version' => $newVersion,
                'file_path' => 'dms/' . date('Y/m') . '/' . $filename,
                'file_size' => $file->getSize(),
                'file_type' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'comment' => $request->input('comment'),
                'created_by' => auth()->id(),
            ]);

            $document->update([
                'file_path' => $version->file_path,
                'file_size' => $file->getSize(),
                'version' => $newVersion,
            ]);

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'version_created',
                'details' => ['version' => $newVersion],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['data' => $version], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function restoreDocumentVersion($documentId, $versionId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);
            $version = DmsDocumentVersion::where('document_id', $documentId)
                ->findOrFail($versionId);

            $document->update([
                'file_path' => $version->file_path,
                'file_size' => $version->file_size,
                'version' => $version->version,
            ]);

            DmsAuditLog::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'action' => 'version_restored',
                'details' => ['version' => $version->version],
            ]);

            return response()->json(['message' => 'Version restored successfully', 'data' => $document]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentSignatures($documentId): JsonResponse
    {
        try {
            $signatures = DmsDocumentSignature::where('document_id', $documentId)
                ->with(['signer', 'document'])
                ->orderBy('signing_order')
                ->get();

            return response()->json(['data' => $signatures]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeSignature(Request $request, $documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $validated = $request->validate([
                'signer_id' => 'nullable|exists:users,id',
                'signer_email' => 'required_without:signer_id|email',
                'signer_name' => 'required_without:signer_id|string|max:255',
                'signature_type' => 'nullable|string|max:50',
                'signing_order' => 'nullable|integer|min:1',
            ]);

            $signature = DmsDocumentSignature::create([
                'document_id' => $document->id,
                'signer_id' => $validated['signer_id'] ?? null,
                'signer_email' => $validated['signer_email'],
                'signer_name' => $validated['signer_name'],
                'signature_type' => $validated['signature_type'] ?? 'electronic',
                'signing_order' => $validated['signing_order'] ?? 1,
                'status' => 'pending',
                'sent_at' => now(),
            ]);

            return response()->json(['data' => $signature], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateSignatureStatus(Request $request, $id): JsonResponse
    {
        try {
            $signature = DmsDocumentSignature::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|string|in:signed,declined,pending',
                'signature_data' => 'nullable|string',
            ]);

            $updates = ['status' => $validated['status']];
            if ($validated['status'] === 'signed') {
                $updates['signed_at'] = now();
                $updates['signature_data'] = $validated['signature_data'] ?? null;
                $updates['ip_address'] = $request->ip();
                $updates['user_agent'] = $request->userAgent();

                DmsDocument::where('id', $signature->document_id)
                    ->update(['signature_status' => 'signed']);
            }

            $signature->update($updates);

            return response()->json(['data' => $signature->fresh()]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentApprovals($documentId): JsonResponse
    {
        try {
            $approvals = DmsDocumentApproval::where('document_id', $documentId)
                ->with(['approver', 'document'])
                ->orderBy('approval_order')
                ->get();

            return response()->json(['data' => $approvals]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeApproval(Request $request, $documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $validated = $request->validate([
                'approver_id' => 'nullable|exists:users,id',
                'approver_email' => 'required_without:approver_id|email',
                'stage' => 'nullable|string|max:100',
                'approval_order' => 'nullable|integer|min:1',
            ]);

            $approval = DmsDocumentApproval::create([
                'document_id' => $document->id,
                'approver_id' => $validated['approver_id'] ?? null,
                'approver_email' => $validated['approver_email'],
                'stage' => $validated['stage'] ?? 'review',
                'status' => 'pending',
                'approval_order' => $validated['approval_order'] ?? 1,
            ]);

            $document->update(['approval_status' => 'pending']);

            return response()->json(['data' => $approval], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateApprovalStatus(Request $request, $id): JsonResponse
    {
        try {
            $approval = DmsDocumentApproval::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|string|in:approved,rejected,pending,escalated',
                'comment' => 'nullable|string',
                'escalated_to' => 'nullable|exists:users,id',
            ]);

            $updates = ['status' => $validated['status'], 'comment' => $validated['comment'] ?? null];
            if ($validated['status'] === 'approved') {
                $updates['approved_at'] = now();
            } elseif ($validated['status'] === 'rejected') {
                $updates['rejected_at'] = now();
            } elseif ($validated['status'] === 'escalated') {
                $updates['escalated_to'] = $validated['escalated_to'] ?? null;
            }

            $approval->update($updates);

            $allApproved = DmsDocumentApproval::where('document_id', $approval->document_id)
                ->where('status', '!=', 'approved')
                ->count() === 0;
            if ($allApproved) {
                DmsDocument::where('id', $approval->document_id)
                    ->update(['approval_status' => 'approved']);
            } elseif ($validated['status'] === 'rejected') {
                DmsDocument::where('id', $approval->document_id)
                    ->update(['approval_status' => 'rejected']);
            }

            return response()->json(['data' => $approval->fresh()]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentComments(Request $request, $documentId): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $comments = DmsDocumentComment::where('document_id', $documentId)
                ->whereNull('parent_id')
                ->with(['user', 'replies.user', 'replies.resolver'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $comments->getCollection()->transform(function ($comment) {
                $comment->replies = $comment->replies->sortBy('created_at')->values();
                return $comment;
            });

            return response()->json([
                'data' => $comments->items(),
                'pagination' => [
                    'current_page' => $comments->currentPage(),
                    'per_page' => $comments->perPage(),
                    'total' => $comments->total(),
                    'last_page' => $comments->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeComment(Request $request, $documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $validated = $request->validate([
                'content' => 'required|string',
                'parent_id' => 'nullable|exists:dms_document_comments,id',
                'mentions' => 'nullable|array',
                'mentions.*' => 'integer|exists:users,id',
            ]);

            $comment = DmsDocumentComment::create([
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'content' => $validated['content'],
                'parent_id' => $validated['parent_id'] ?? null,
                'mentions' => $validated['mentions'] ?? null,
            ]);

            $comment->load('user');

            return response()->json(['data' => $comment], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function deleteComment($id): JsonResponse
    {
        try {
            $comment = DmsDocumentComment::findOrFail($id);
            $comment->replies()->delete();
            $comment->delete();

            return response()->json(['message' => 'Comment deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentShares(Request $request, $documentId): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $shares = DmsDocumentShare::where('document_id', $documentId)
                ->with(['sharedBy', 'sharedWithUser', 'document'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'data' => $shares->items(),
                'pagination' => [
                    'current_page' => $shares->currentPage(),
                    'per_page' => $shares->perPage(),
                    'total' => $shares->total(),
                    'last_page' => $shares->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeShare(Request $request, $documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $validated = $request->validate([
                'shared_with_user_id' => 'nullable|exists:users,id',
                'shared_with_email' => 'required_without:shared_with_user_id|email',
                'access_level' => 'nullable|string|in:view,edit,comment',
                'expires_at' => 'nullable|date|after:now',
                'max_downloads' => 'nullable|integer|min:1',
                'password' => 'nullable|string|min:4',
            ]);

            $share = DmsDocumentShare::create([
                'document_id' => $document->id,
                'shared_by' => auth()->id(),
                'shared_with_user_id' => $validated['shared_with_user_id'] ?? null,
                'shared_with_email' => $validated['shared_with_email'],
                'access_level' => $validated['access_level'] ?? 'view',
                'share_token' => Str::random(64),
                'password' => $validated['password'] ? bcrypt($validated['password']) : null,
                'expires_at' => $validated['expires_at'] ?? null,
                'max_downloads' => $validated['max_downloads'] ?? null,
            ]);

            $share->load(['sharedBy', 'sharedWithUser']);

            return response()->json(['data' => $share], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function revokeShare($id): JsonResponse
    {
        try {
            $share = DmsDocumentShare::findOrFail($id);
            $share->update(['is_revoked' => true]);

            return response()->json(['message' => 'Share revoked successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function accessSharedDocument($token): JsonResponse
    {
        try {
            $share = DmsDocumentShare::where('share_token', $token)
                ->where('is_revoked', false)
                ->firstOrFail();

            if ($share->expires_at && $share->expires_at < now()) {
                return response()->json(['message' => 'Share link has expired'], 410);
            }

            $document = DmsDocument::with(['folder', 'owner'])->findOrFail($share->document_id);

            $share->increment('download_count');
            $share->update(['last_accessed_at' => now()]);

            return response()->json([
                'data' => [
                    'document' => $document,
                    'share' => $share,
                    'access_level' => $share->access_level,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function documentAuditLogs(Request $request, $documentId): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $logs = DmsAuditLog::where('document_id', $documentId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'data' => $logs->items(),
                'pagination' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function auditLogs(Request $request): JsonResponse
    {
        try {
            $query = DmsAuditLog::with(['user', 'document', 'folder']);

            if ($request->filled('action')) {
                $query->where('action', $request->input('action'));
            }

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->input('user_id'));
            }

            if ($request->filled('document_id')) {
                $query->where('document_id', $request->input('document_id'));
            }

            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->input('date_from'));
            }

            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->input('date_to'));
            }

            $query->latest();

            $perPage = $request->input('per_page', 25);
            $logs = $query->paginate($perPage);

            return response()->json([
                'data' => $logs->items(),
                'pagination' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function templates(Request $request): JsonResponse
    {
        try {
            $perPage = $request->per_page ?? 50;
            $templates = DmsTemplate::with('creator')
                ->orderBy('name')
                ->paginate($perPage);

            $templateItems = $templates->getCollection()->map(function ($template) {
                    return [
                        'id' => $template->id,
                        'name' => $template->name,
                        'slug' => $template->slug,
                        'description' => $template->description,
                        'category' => $template->category,
                        'file_path' => $template->file_path,
                        'thumbnail_path' => $template->thumbnail_path,
                        'fields' => $template->fields,
                        'tags' => $template->tags,
                        'is_public' => $template->is_public,
                        'usage_count' => $template->usage_count,
                        'created_by' => $template->created_by,
                        'creator_name' => $template->creator?->name,
                        'created_at' => $template->created_at,
                        'updated_at' => $template->updated_at,
                    ];
                });

            return response()->json([
                'data' => $templateItems->values()->all(),
                'pagination' => [
                    'current_page' => $templates->currentPage(),
                    'per_page' => $templates->perPage(),
                    'total' => $templates->total(),
                    'last_page' => $templates->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function storeTemplate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'content' => 'nullable|string',
                'fields' => 'nullable|array',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'is_public' => 'nullable|boolean',
                'file' => 'nullable|file|max:102400',
            ]);

            $data = [
                'tenant_id' => auth()->user()?->tenant_id,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'category' => $validated['category'] ?? null,
                'content' => $validated['content'] ?? null,
                'fields' => $validated['fields'] ?? null,
                'tags' => $validated['tags'] ?? null,
                'is_public' => $validated['is_public'] ?? false,
                'created_by' => auth()->id(),
            ];

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('dms/templates/' . date('Y/m'), $file, $filename);
                $data['file_path'] = 'dms/templates/' . date('Y/m') . '/' . $filename;
            }

            $template = DmsTemplate::create($data);
            $template->load('creator');

            return response()->json(['data' => $template], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateTemplate(Request $request, $id): JsonResponse
    {
        try {
            $template = DmsTemplate::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'content' => 'nullable|string',
                'fields' => 'nullable|array',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'is_public' => 'nullable|boolean',
                'file' => 'nullable|file|max:102400',
            ]);

            if (isset($validated['name'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('dms/templates/' . date('Y/m'), $file, $filename);
                $validated['file_path'] = 'dms/templates/' . date('Y/m') . '/' . $filename;
            }

            $template->update($validated);
            $template->load('creator');

            return response()->json(['data' => $template]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function deleteTemplate($id): JsonResponse
    {
        try {
            $template = DmsTemplate::findOrFail($id);
            $template->delete();

            return response()->json(['message' => 'Template deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('q', '');
            if (empty($query)) {
                return response()->json(['data' => [
                    'documents' => [],
                    'folders' => [],
                ]]);
            }

            $documents = DmsDocument::with(['folder', 'owner'])
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
                      ->orWhere('tags', 'like', "%{$query}%");
                })
                ->limit(20)
                ->get();

            $folders = DmsFolder::with(['owner', 'parent'])
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();

            return response()->json([
                'data' => [
                    'documents' => $documents,
                    'folders' => $folders,
                    'query' => $query,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function analytics(): JsonResponse
    {
        try {
            $totalDocuments = DmsDocument::count();
            $totalFolders = DmsFolder::count();
            $totalVersions = DmsDocumentVersion::count();
            $totalShares = DmsDocumentShare::where('is_revoked', false)->count();
            $totalSignatures = DmsDocumentSignature::count();

            $documentGrowth = DmsDocument::select(
                DB::raw(SqlHelper::monthGroup('created_at') . ' as month'),
                DB::raw('COUNT(*) as count')
            )
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $storageByDepartment = DmsDocument::select('department', DB::raw('SUM(file_size) as total_size'))
                ->whereNotNull('department')
                ->groupBy('department')
                ->get()
                ->map(function ($item) {
                    return [
                        'department' => $item->department,
                        'size_bytes' => (int) $item->total_size,
                        'size_formatted' => $this->formatBytes($item->total_size),
                    ];
                });

            $fileTypeDistribution = DmsDocument::select('file_type', DB::raw('COUNT(*) as count'))
                ->whereNotNull('file_type')
                ->groupBy('file_type')
                ->orderBy('count', 'desc')
                ->get();

            $mostAccessed = DmsDocument::orderBy('view_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'view_count', 'download_count']);

            $approvalStats = [
                'pending' => DmsDocumentApproval::where('status', 'pending')->count(),
                'approved' => DmsDocumentApproval::where('status', 'approved')->count(),
                'rejected' => DmsDocumentApproval::where('status', 'rejected')->count(),
                'escalated' => DmsDocumentApproval::where('status', 'escalated')->count(),
            ];

            $userActivity = DmsAuditLog::select('user_id', DB::raw('COUNT(*) as activity_count'))
                ->with('user')
                ->groupBy('user_id')
                ->orderBy('activity_count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($log) {
                    return [
                        'user_id' => $log->user_id,
                        'user_name' => $log->user?->name,
                        'activity_count' => $log->activity_count,
                    ];
                });

            return response()->json([
                'data' => [
                    'overview' => [
                        'totalDocuments' => $totalDocuments,
                        'totalFolders' => $totalFolders,
                        'totalVersions' => $totalVersions,
                        'totalShares' => $totalShares,
                        'totalSignatures' => $totalSignatures,
                    ],
                    'documentGrowth' => $documentGrowth,
                    'storageByDepartment' => $storageByDepartment,
                    'fileTypeDistribution' => $fileTypeDistribution,
                    'mostAccessed' => $mostAccessed,
                    'approvalStats' => $approvalStats,
                    'userActivity' => $userActivity,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function upload(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|max:102400',
            ]);

            $file = $request->file('file');
            $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = 'dms/' . date('Y/m') . '/' . $filename;

            Storage::disk('public')->putFileAs('dms/' . date('Y/m'), $file, $filename);

            return response()->json([
                'data' => [
                    'filename' => $filename,
                    'path' => $path,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension(),
                    'original_name' => $file->getClientOriginalName(),
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    private function formatBytes($bytes, $precision = 2): string
    {
        $bytes = (int) $bytes;
        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $exp = min(floor(log($bytes, 1024)), count($units) - 1);

        return round($bytes / (1024 ** $exp), $precision) . ' ' . $units[$exp];
    }
}
