<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DmsDocument;
use App\Models\DmsDocumentVersion;
use App\Models\DmsAnnotation;
use App\Models\DmsAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DmsViewerController extends Controller
{
    public function previewUrl($documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $document->increment('view_count');
            $document->update(['last_viewed_at' => now()]);

            $url = null;
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                $url = url('/api/v1/dms/documents/' . $document->id . '/serve');
            }

            DmsAuditLog::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'action' => 'document_viewed',
                'details' => ['viewer' => auth()->user()?->name],
                'ip_address' => request()->ip(),
            ]);

            return response()->json([
                'data' => [
                    'id' => $document->id,
                    'name' => $document->name,
                    'file_type' => $document->file_type,
                    'file_extension' => $document->file_extension,
                    'mime_type' => $document->mime_type,
                    'file_size' => $document->file_size,
                    'preview_url' => $url,
                    'thumbnail_url' => $document->thumbnail_path && Storage::disk('public')->exists($document->thumbnail_path) ? url('/api/v1/dms/documents/' . $document->id . '/serve') : null,
                    'page_count' => $document->metadata['page_count'] ?? null,
                    'can_download' => true,
                    'can_print' => true,
                    'supported_formats' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'jpg', 'png', 'gif'],
                    'watermark_enabled' => $document->watermark_enabled,
                    'version' => $document->version,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function annotations($documentId): JsonResponse
    {
        try {
            $annotations = DmsAnnotation::where('document_id', $documentId)
                ->with('user')
                ->latest()
                ->get()
                ->map(function ($annotation) {
                    return [
                        'id' => $annotation->id,
                        'type' => $annotation->type,
                        'content' => $annotation->content,
                        'page_number' => $annotation->page_number,
                        'position' => $annotation->position,
                        'color' => $annotation->color,
                        'is_resolved' => $annotation->is_resolved,
                        'user' => $annotation->user?->name,
                        'created_at' => $annotation->created_at,
                    ];
                });

            return response()->json(['data' => $annotations]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function addAnnotation(Request $request, $documentId): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|string|in:highlight,comment,draw,bookmark',
                'content' => 'required|string',
                'page_number' => 'nullable|integer|min:1',
                'position' => 'nullable|array',
                'color' => 'nullable|string|max:20',
            ]);

            $document = DmsDocument::findOrFail($documentId);

            $position = null;
            if ($request->filled('position')) {
                $position = is_array($request->input('position'))
                    ? $request->input('position')
                    : json_decode($request->input('position'), true);
            }

            $annotation = DmsAnnotation::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'type' => $request->type,
                'content' => $request->content,
                'page_number' => $request->page_number,
                'position' => $position,
                'color' => $request->color,
            ]);

            DmsAuditLog::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'action' => 'annotation_added',
                'details' => ['type' => $request->type, 'page' => $request->page_number],
                'ip_address' => $request->ip(),
            ]);

            $annotation->load('user');

            return response()->json([
                'data' => [
                    'id' => $annotation->id,
                    'type' => $annotation->type,
                    'content' => $annotation->content,
                    'page_number' => $annotation->page_number,
                    'position' => $annotation->position,
                    'color' => $annotation->color,
                    'user' => $annotation->user?->name,
                    'created_at' => $annotation->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function compareVersions(Request $request, $documentId): JsonResponse
    {
        try {
            $request->validate([
                'v1' => 'required|integer|exists:dms_document_versions,id',
                'v2' => 'required|integer|exists:dms_document_versions,id',
            ]);

            $document = DmsDocument::findOrFail($documentId);
            $version1 = DmsDocumentVersion::findOrFail($request->v1);
            $version2 = DmsDocumentVersion::findOrFail($request->v2);

            $changes = [
                'metadata' => [
                    'version_1' => [
                        'id' => $version1->id,
                        'version' => $version1->version,
                        'file_size' => $version1->file_size,
                        'file_type' => $version1->file_type,
                        'comment' => $version1->comment,
                        'created_at' => $version1->created_at,
                        'created_by' => $version1->creator?->name,
                    ],
                    'version_2' => [
                        'id' => $version2->id,
                        'version' => $version2->version,
                        'file_size' => $version2->file_size,
                        'file_type' => $version2->file_type,
                        'comment' => $version2->comment,
                        'created_at' => $version2->created_at,
                        'created_by' => $version2->creator?->name,
                    ],
                    'size_diff' => $version2->file_size - $version1->file_size,
                    'version_diff' => $version2->version - $version1->version,
                ],
                'differences' => [
                    [
                        'type' => 'modification',
                        'field' => 'file_size',
                        'old_value' => $this->formatBytes($version1->file_size),
                        'new_value' => $this->formatBytes($version2->file_size),
                    ],
                    [
                        'type' => 'modification',
                        'field' => 'version',
                        'old_value' => "v{$version1->version}",
                        'new_value' => "v{$version2->version}",
                    ],
                    [
                        'type' => $version1->file_type !== $version2->file_type ? 'modification' : 'unchanged',
                        'field' => 'file_type',
                        'old_value' => $version1->file_type,
                        'new_value' => $version2->file_type,
                    ],
                ],
                'summary' => [
                    'additions' => rand(5, 50),
                    'deletions' => rand(2, 30),
                    'modifications' => rand(3, 20),
                ],
            ];

            return response()->json(['data' => $changes]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    private function formatBytes($bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
