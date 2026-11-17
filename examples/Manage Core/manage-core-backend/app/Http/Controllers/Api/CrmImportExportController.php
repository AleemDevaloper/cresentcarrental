<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmImportJob;
use App\Models\CrmExportJob;
use App\Services\Crm\CrmImportService;
use App\Services\Crm\CrmExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CrmImportExportController extends Controller
{
    public function __construct(
        private CrmImportService $importService,
        private CrmExportService $exportService
    ) {}

    // ===== IMPORT =====
    public function uploadImport(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:51200',
            'entity_type' => 'required|in:lead,contact,customer',
            'column_mapping' => 'nullable|array',
        ]);

        $file = $request->file('file');
        $path = $file->store('crm/imports/' . date('Y/m'), 'local');

        $job = $this->importService->createJob(
            $request->input('entity_type'),
            $path,
            $file->getClientOriginalName(),
            $request->input('column_mapping', [])
        );

        return response()->json(['success' => true, 'data' => $job], 201);
    }

    public function indexImports(Request $request): JsonResponse
    {
        $query = CrmImportJob::query();
        if ($request->filled('entity_type')) $query->where('entity_type', $request->input('entity_type'));
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        $items = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function showImport($id): JsonResponse
    {
        $job = CrmImportJob::with('rows')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $job]);
    }

    public function importErrors($id): JsonResponse
    {
        $job = CrmImportJob::findOrFail($id);
        $errors = $job->rows()->whereIn('status', ['failed', 'duplicate'])->get();
        return response()->json(['success' => true, 'data' => $errors]);
    }

    // ===== EXPORT =====
    public function createExport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|in:lead,contact,customer,deal',
            'format' => 'required|in:csv,xlsx,pdf',
            'scope' => 'nullable|in:all,filtered,selected',
            'filters' => 'nullable|array',
            'columns' => 'nullable|array',
            'selected_ids' => 'nullable|array',
        ]);
        $job = $this->exportService->createJob(
            $validated['entity_type'],
            $validated['format'],
            $validated['filters'] ?? [],
            $validated['columns'] ?? [],
            $validated['selected_ids'] ?? [],
            $validated['scope'] ?? 'all'
        );
        return response()->json(['success' => true, 'data' => $job], 201);
    }

    public function indexExports(Request $request): JsonResponse
    {
        $query = CrmExportJob::query();
        if ($request->filled('entity_type')) $query->where('entity_type', $request->input('entity_type'));
        if ($request->filled('status')) $query->where('status', $request->input('status'));
        $items = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function showExport($id): JsonResponse
    {
        $job = CrmExportJob::findOrFail($id);
        return response()->json(['success' => true, 'data' => $job]);
    }

    public function downloadExport($id)
    {
        $job = CrmExportJob::findOrFail($id);
        if ($job->status !== 'completed' || !$job->file_path) {
            abort(404);
        }
        $path = storage_path('app/' . $job->file_path);
        if (!file_exists($path)) abort(404);
        return response()->download($path);
    }

    public function destroyExport($id): JsonResponse
    {
        $job = CrmExportJob::findOrFail($id);
        if ($job->file_path) {
            @unlink(storage_path('app/' . $job->file_path));
        }
        $job->delete();
        return response()->json(['success' => true, 'message' => 'Export deleted']);
    }
}