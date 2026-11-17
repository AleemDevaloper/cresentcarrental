<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DmsDocument;
use App\Models\DmsAiAnalysis;
use App\Models\DmsAuditLog;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DmsAiController extends Controller
{
    public function __construct(protected AiService $ai) {}

    public function classification($documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);
            $analysis = DmsAiAnalysis::where('document_id', $documentId)
                ->where('type', 'classification')
                ->latest()
                ->first();

            if (!$analysis) {
                $res = $this->ai->classifyDocument($document->name, $document->description, null);
                $result = $res['parsed'] ?? [
                    'category' => 'Other',
                    'subcategory' => null,
                    'tags' => ['auto-classified'],
                    'summary' => 'Document classified.',
                ];

                $analysis = DmsAiAnalysis::create([
                    'document_id' => $documentId,
                    'type' => 'classification',
                    'result' => $result,
                    'confidence' => 0.85,
                    'status' => 'completed',
                    'completed_at' => now(),
                    'analyzed_by' => auth()->id(),
                ]);
            }

            return response()->json(['data' => $analysis]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function analyze($documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);

            $metadata = [
                'file_type' => $document->file_type,
                'file_size' => $document->file_size,
                'status' => $document->status,
                'confidentiality' => $document->confidentiality,
                'created_at' => $document->created_at?->toIso8601String(),
                'owner' => $document->owner?->name ?? 'Unknown',
            ];

            $res = $this->ai->analyzeDocument($document->name, $document->description, null, $metadata);
            $result = $res['parsed'] ?? [
                'ocr_text' => 'Analysis unavailable.',
                'extracted_fields' => ['document_type' => $document->file_type, 'author' => 'Unknown'],
                'entities' => [],
                'sentiment' => 'neutral',
                'complexity_score' => 0.5,
            ];

            $analysis = DmsAiAnalysis::updateOrCreate(
                ['document_id' => $documentId, 'type' => 'full_analysis'],
                [
                    'result' => $result,
                    'confidence' => 0.85,
                    'status' => 'completed',
                    'completed_at' => now(),
                    'analyzed_by' => auth()->id(),
                ]
            );

            DmsAuditLog::create([
                'document_id' => $documentId,
                'user_id' => auth()->id(),
                'action' => 'ai_analysis',
                'details' => ['type' => 'full_analysis'],
                'ip_address' => request()->ip(),
            ]);

            return response()->json(['data' => $analysis]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function summary($documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);
            $analysis = DmsAiAnalysis::where('document_id', $documentId)
                ->where('type', 'summary')
                ->latest()
                ->first();

            if (!$analysis) {
                $metadata = [
                    'file_type' => $document->file_type,
                    'status' => $document->status,
                    'confidentiality' => $document->confidentiality,
                    'version_count' => $document->versions()->count(),
                    'view_count' => $document->view_count,
                    'created_at' => $document->created_at?->toIso8601String(),
                    'owner' => $document->owner?->name ?? 'Unknown',
                ];

                $res = $this->ai->generateSummary($document->name, $document->description, null, $metadata);
                $result = $res['parsed'] ?? [
                    'summary' => "Document: {$document->name}",
                    'key_points' => [],
                    'word_count' => 0,
                    'reading_time_minutes' => 1,
                ];

                $analysis = DmsAiAnalysis::create([
                    'document_id' => $documentId,
                    'type' => 'summary',
                    'result' => $result,
                    'confidence' => 0.85,
                    'status' => 'completed',
                    'completed_at' => now(),
                    'analyzed_by' => auth()->id(),
                ]);
            }

            return response()->json(['data' => $analysis]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function duplicates(): JsonResponse
    {
        try {
            $tenantId = auth()->user()?->tenant_id;
            $documents = DmsDocument::where('tenant_id', $tenantId)
                ->select('name', DB::raw('COUNT(*) as count'), DB::raw('GROUP_CONCAT(id) as document_ids'))
                ->groupBy('name')
                ->having('count', '>', 1)
                ->get()
                ->map(function ($group) {
                    $ids = explode(',', $group->document_ids);
                    $docs = DmsDocument::whereIn('id', $ids)->get();
                    return [
                        'name' => $group->name,
                        'count' => (int) $group->count,
                        'documents' => $docs->map(function ($doc) {
                            return [
                                'id' => $doc->id,
                                'name' => $doc->name,
                                'file_size' => $doc->file_size,
                                'file_type' => $doc->file_type,
                                'created_at' => $doc->created_at,
                                'owner' => $doc->owner?->name,
                            ];
                        }),
                        'total_size_bytes' => $docs->sum('file_size'),
                        'similarity' => 1.0,
                    ];
                });

            return response()->json(['data' => $documents]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function recommendations(): JsonResponse
    {
        try {
            $tenantId = auth()->user()?->tenant_id;
            $userId = auth()->id();

            $statuses = ['published', 'approved', 'submitted', 'active', 'in_review', 'completed'];
            $recentDocs = DmsDocument::where(function ($q) use ($statuses) {
                    $q->whereIn('status', $statuses)
                      ->orWhereNull('status');
                })
                ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
                ->where(function ($q) use ($userId) {
                    $q->where('owner_id', '!=', $userId)->orWhereNull('owner_id');
                })
                ->latest()
                ->take(5)
                ->get();

            $recommendations = $recentDocs->map(function ($doc) {
                $reason = 'Recently updated and likely relevant to your work.';
                try {
                    $reason = $this->ai->generateInsight(
                        'Document recommendation',
                        json_encode(['name' => $doc->name, 'type' => $doc->file_type, 'owner' => $doc->owner?->name])
                    );
                } catch (\Throwable $e) {
                    $reason = 'Recently updated and likely relevant to your work.';
                }
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'file_type' => $doc->file_type,
                    'reason' => $reason,
                    'relevance_score' => 0.85,
                    'owner' => $doc->owner?->name,
                    'created_at' => $doc->created_at,
                ];
            });

            $stats = [
                'total_analyzed' => DmsAiAnalysis::where('status', 'completed')->count(),
                'avg_confidence' => round(DmsAiAnalysis::where('status', 'completed')->avg('confidence') ?? 0, 2),
                'pending_analyses' => DmsAiAnalysis::where('status', 'pending')->count(),
            ];

            return response()->json([
                'data' => [
                    'recommendations' => $recommendations->values(),
                    'stats' => $stats,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate(['query' => 'required|string|min:2']);
            $query = $request->input('query');

            $dbResults = DmsDocument::where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhere('tags', 'LIKE', "%{$query}%");
            })
            ->with(['folder', 'owner'])
            ->latest()
            ->take(20)
            ->get()
            ->map(fn($doc) => [
                'id' => $doc->id,
                'name' => $doc->name,
                'file_type' => $doc->file_type,
                'folder' => $doc->folder?->name,
                'owner' => $doc->owner?->name,
                'created_at' => $doc->created_at,
            ]);

            $aiRes = $this->ai->semanticSearch($query, $dbResults->toArray());
            $ranked = $aiRes['parsed']['results'] ?? [];

            $idMap = $dbResults->keyBy('id');
            $results = collect($ranked)->map(fn($r) => array_merge($idMap->get($r['id'], []), [
                'relevance' => $r['relevance'] ?? 0.5,
                'highlight' => $r['highlight'] ?? "Matched: {$query}",
            ]));

            return response()->json(['data' => $results->values()]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function complianceCheck($documentId): JsonResponse
    {
        try {
            $document = DmsDocument::findOrFail($documentId);
            $res = $this->ai->checkCompliance(
                $document->name,
                $document->status,
                $document->confidentiality,
                $document->retention_policy,
                $document->tags,
                $document->version,
                $document->approval_status
            );
            $result = $res['parsed'] ?? [];

            return response()->json([
                'data' => array_merge([
                    'document_id' => (int) $documentId,
                    'checked_at' => now()->toIso8601String(),
                ], $result)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
