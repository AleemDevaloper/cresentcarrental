<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DmsDocument;
use App\Models\DmsRetentionPolicy;
use App\Models\DmsScheduledJob;
use App\Models\DmsAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DmsArchiveController extends Controller
{
    public function archived(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search');
            $fileType = $request->input('file_type');
            $dateFrom = $request->input('date_from');
            $dateTo = $request->input('date_to');

            $query = DmsDocument::where('is_archived', true)->with(['folder', 'owner']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }
            if ($fileType) {
                $query->where('file_type', $fileType);
            }
            if ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            }

            $documents = $query->latest()->paginate($perPage);

            $documents->getCollection()->transform(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'file_type' => $doc->file_type,
                    'file_size' => $doc->file_size,
                    'file_extension' => $doc->file_extension,
                    'archived_at' => $doc->updated_at,
                    'original_folder' => $doc->folder?->name,
                    'owner' => $doc->owner?->name,
                    'retention_policy' => $doc->retention_policy,
                    'retention_until' => $doc->retention_until,
                    'status' => $doc->status,
                ];
            });

            return response()->json(['data' => $documents]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function restore($id): JsonResponse
    {
        try {
            $document = DmsDocument::withTrashed()->where('is_archived', true)->findOrFail($id);
            $document->update(['is_archived' => false]);

            DmsAuditLog::create([
                'document_id' => $id,
                'user_id' => auth()->id(),
                'action' => 'restored_from_archive',
                'details' => ['restored_by' => auth()->user()?->name],
                'ip_address' => request()->ip(),
            ]);

            return response()->json([
                'data' => [
                    'id' => $document->id,
                    'name' => $document->name,
                    'message' => 'Document restored successfully',
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function permanentDelete($id): JsonResponse
    {
        try {
            $document = DmsDocument::withTrashed()->where('is_archived', true)->findOrFail($id);

            DmsAuditLog::create([
                'document_id' => $id,
                'user_id' => auth()->id(),
                'action' => 'permanent_delete',
                'details' => ['name' => $document->name, 'deleted_by' => auth()->user()?->name],
                'ip_address' => request()->ip(),
            ]);

            $document->forceDelete();

            return response()->json(['message' => 'Document permanently deleted']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function retentionPolicies(): JsonResponse
    {
        try {
            $policies = DmsRetentionPolicy::where('tenant_id', auth()->user()?->tenant_id)
                ->latest()
                ->get()
                ->map(function ($policy) {
                    return [
                        'id' => $policy->id,
                        'name' => $policy->name,
                        'description' => $policy->description,
                        'category' => $policy->category,
                        'retention_days' => $policy->retention_days,
                        'retention_period' => $policy->retention_period,
                        'action' => $policy->action,
                        'conditions' => $policy->conditions,
                        'is_active' => $policy->is_active,
                        'created_by' => $policy->creator?->name,
                        'created_at' => $policy->created_at,
                    ];
                });

            return response()->json(['data' => $policies]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $tenantId = auth()->user()?->tenant_id;
            $baseQuery = DmsDocument::where('tenant_id', $tenantId);

            $archivedCount = (clone $baseQuery)->where('is_archived', true)->count();
            $archivedSize = (clone $baseQuery)->where('is_archived', true)->sum('file_size');
            $restoredCount = DmsAuditLog::where('action', 'restored_from_archive')->count();
            $pendingPurge = (clone $baseQuery)->where('is_archived', true)
                ->whereNotNull('retention_until')
                ->where('retention_until', '<', now())
                ->count();

            $monthlyData = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $month = $date->format('M Y');
                $archived = (clone $baseQuery)->where('is_archived', true)
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->count();
                $restored = DmsAuditLog::where('action', 'restored_from_archive')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                $monthlyData[] = [
                    'month' => $month,
                    'archived' => $archived,
                    'restored' => $restored,
                ];
            }

            $fileTypeDistribution = (clone $baseQuery)->where('is_archived', true)
                ->select('file_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(file_size) as total_size'))
                ->groupBy('file_type')
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => $item->file_type ?: 'Unknown',
                        'count' => (int) $item->count,
                        'size_bytes' => (int) $item->total_size,
                    ];
                });

            return response()->json([
                'data' => [
                    'archived_count' => $archivedCount,
                    'archived_size_bytes' => $archivedSize,
                    'restored_count' => $restoredCount,
                    'pending_purge_count' => $pendingPurge,
                    'monthly_trend' => $monthlyData,
                    'file_type_distribution' => $fileTypeDistribution,
                    'retention_policies_count' => DmsRetentionPolicy::where('tenant_id', $tenantId)->count(),
                    'scheduled_jobs_count' => DmsScheduledJob::where('tenant_id', $tenantId)->count(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
