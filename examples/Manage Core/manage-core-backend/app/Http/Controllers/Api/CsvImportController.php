<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImportLog;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CsvImportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ImportLog::with('importedBy');

        if ($request->has('type')) {
            $query->where('import_type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->paginate($request->per_page ?? 20)]);
    }

    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
            'type' => 'required|string|in:attendance,users,leaves',
        ]);

        $rows = $this->parseCsv($request->file('file'));

        if (empty($rows)) {
            return response()->json(['message' => 'CSV file is empty or invalid.'], 422);
        }

        $headers = array_keys($rows[0]);
        $totalRows = count($rows);
        $sample = array_slice($rows, 0, 5);

        $validation = $this->validateRows($rows, $request->type);

        return response()->json(['data' => [
            'type' => $request->type,
            'total_rows' => $totalRows,
            'headers' => $headers,
            'sample' => $sample,
            'validation_errors' => $validation['errors'],
            'valid_count' => $validation['valid_count'],
            'error_count' => $validation['error_count'],
        ]]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
            'type' => 'required|string|in:attendance,users,leaves',
            'mapping' => 'nullable|array',
        ]);

        $rows = $this->parseCsv($request->file('file'));

        if (empty($rows)) {
            return response()->json(['message' => 'CSV file is empty or invalid.'], 422);
        }

        $validation = $this->validateRows($rows, $request->type);

        if ($validation['error_count'] > 0) {
            return response()->json([
                'message' => 'CSV contains validation errors.',
                'errors' => $validation['errors'],
                'valid_count' => $validation['valid_count'],
                'error_count' => $validation['error_count'],
            ], 422);
        }

        $importLog = DB::transaction(function () use ($request, $rows) {
            $imported = 0;
            $failed = 0;
            $errors = [];

            foreach ($rows as $index => $row) {
                try {
                    $this->importRow($row, $request->type, $request->user()->id);
                    $imported++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                }
            }

            return ImportLog::create([
                'import_type' => $request->type,
                'file_name' => $request->file('file')->getClientOriginalName(),
                'total_rows' => count($rows),
                'imported_count' => $imported,
                'failed_count' => $failed,
                'errors' => $errors,
                'status' => $failed > 0 ? 'completed_with_errors' : 'completed',
                'imported_by' => $request->user()->id,
            ]);
        });

        return response()->json(['data' => $importLog->load('importedBy')], 201);
    }

    public function mapping(Request $request): JsonResponse
    {
        $type = $request->type ?? 'attendance';

        $mappings = [
            'attendance' => [
                ['field' => 'user_id', 'label' => 'User ID', 'required' => true],
                ['field' => 'date', 'label' => 'Date (Y-m-d)', 'required' => true],
                ['field' => 'clock_in', 'label' => 'Clock In (H:i:s)', 'required' => false],
                ['field' => 'clock_out', 'label' => 'Clock Out (H:i:s)', 'required' => false],
                ['field' => 'status', 'label' => 'Status', 'required' => false],
                ['field' => 'notes', 'label' => 'Notes', 'required' => false],
            ],
            'users' => [
                ['field' => 'name', 'label' => 'Full Name', 'required' => true],
                ['field' => 'email', 'label' => 'Email', 'required' => true],
                ['field' => 'emp_id', 'label' => 'Employee ID', 'required' => true],
                ['field' => 'phone', 'label' => 'Phone', 'required' => false],
                ['field' => 'department', 'label' => 'Department', 'required' => false],
                ['field' => 'designation', 'label' => 'Designation', 'required' => false],
            ],
            'leaves' => [
                ['field' => 'user_id', 'label' => 'User ID', 'required' => true],
                ['field' => 'type', 'label' => 'Leave Type', 'required' => true],
                ['field' => 'start_date', 'label' => 'Start Date (Y-m-d)', 'required' => true],
                ['field' => 'end_date', 'label' => 'End Date (Y-m-d)', 'required' => true],
                ['field' => 'reason', 'label' => 'Reason', 'required' => false],
                ['field' => 'status', 'label' => 'Status', 'required' => false],
            ],
        ];

        return response()->json(['data' => $mappings[$type] ?? $mappings['attendance']]);
    }

    public function validateImport(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
            'type' => 'required|string|in:attendance,users,leaves',
        ]);

        $rows = $this->parseCsv($request->file('file'));
        $validation = $this->validateRows($rows, $request->type);

        return response()->json(['data' => [
            'valid' => $validation['error_count'] === 0,
            'total_rows' => count($rows),
            'valid_count' => $validation['valid_count'],
            'error_count' => $validation['error_count'],
            'errors' => $validation['errors'],
        ]]);
    }

    public function rollback(Request $request): JsonResponse
    {
        $request->validate(['import_log_id' => 'required|exists:import_logs,id']);

        $importLog = ImportLog::findOrFail($request->import_log_id);

        if ($importLog->status === 'rolled_back') {
            return response()->json(['message' => 'Import already rolled back.'], 422);
        }

        DB::transaction(function () use ($importLog) {
            if ($importLog->import_type === 'attendance') {
                Attendance::where('import_batch_id', $importLog->id)->delete();
            }

            $importLog->update(['status' => 'rolled_back']);
        });

        return response()->json(['data' => $importLog->fresh()]);
    }

    public function template(Request $request): JsonResponse
    {
        $type = $request->type ?? 'attendance';

        $headers = [
            'attendance' => ['user_id', 'date', 'clock_in', 'clock_out', 'status', 'notes'],
            'users' => ['name', 'email', 'emp_id', 'phone', 'department', 'designation'],
            'leaves' => ['user_id', 'type', 'start_date', 'end_date', 'reason', 'status'],
        ];

        $selectedHeaders = $headers[$type] ?? $headers['attendance'];

        $csv = implode(',', $selectedHeaders) . "\n";
        $csv .= $this->getSampleRow($type);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="import-template-' . $type . '.csv"',
        ]);
    }

    public function logs(Request $request): JsonResponse
    {
        $query = ImportLog::with('importedBy');

        if ($request->has('type')) {
            $query->where('import_type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return response()->json(['data' => $query->latest()->paginate($request->per_page ?? 20)]);
    }

    private function parseCsv($file): array
    {
        $path = $file->getRealPath();
        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle);
        $rows = [];

        if (!$headers) {
            fclose($handle);
            return [];
        }

        $headers = array_map('trim', $headers);

        while (($line = fgetcsv($handle)) !== false) {
            $row = [];
            foreach ($headers as $index => $header) {
                $row[$header] = isset($line[$index]) ? trim($line[$index]) : '';
            }
            if (array_filter($row)) {
                $rows[] = $row;
            }
        }

        fclose($handle);
        return $rows;
    }

    private function validateRows(array $rows, string $type): array
    {
        $errors = [];
        $validCount = 0;

        $rules = $this->getValidationRules($type);

        foreach ($rows as $index => $row) {
            $validator = Validator::make($row, $rules);

            if ($validator->fails()) {
                $errors[] = [
                    'row' => $index + 2,
                    'errors' => $validator->errors()->all(),
                ];
            } else {
                $validCount++;
            }
        }

        return [
            'errors' => $errors,
            'valid_count' => $validCount,
            'error_count' => count($errors),
        ];
    }

    private function getValidationRules(string $type): array
    {
        switch ($type) {
            case 'attendance':
                return [
                    'user_id' => 'required',
                    'date' => 'required|date',
                    'clock_in' => 'nullable',
                    'clock_out' => 'nullable',
                    'status' => 'nullable|string',
                ];
            case 'users':
                return [
                    'name' => 'required|string|max:255',
                    'email' => 'required|email',
                    'emp_id' => 'required|string',
                    'phone' => 'nullable|string',
                    'department' => 'nullable|string',
                    'designation' => 'nullable|string',
                ];
            case 'leaves':
                return [
                    'user_id' => 'required',
                    'type' => 'required|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date',
                    'reason' => 'nullable|string',
                    'status' => 'nullable|string',
                ];
            default:
                return [];
        }
    }

    private function importRow(array $row, string $type, int $importedBy): void
    {
        switch ($type) {
            case 'attendance':
                $user = User::where('emp_id', $row['user_id'])
                    ->orWhere('id', $row['user_id'])
                    ->first();

                if (!$user) {
                    throw new \Exception("User not found: {$row['user_id']}");
                }

                Attendance::updateOrCreate(
                    ['user_id' => $user->id, 'date' => $row['date']],
                    [
                        'clock_in' => $row['clock_in'] ?? null,
                        'clock_out' => $row['clock_out'] ?? null,
                        'status' => $row['status'] ?? 'Present',
                        'notes' => $row['notes'] ?? null,
                        'marked_by' => $importedBy,
                        'verification_status' => 'verified',
                        'source' => 'import',
                    ]
                );
                break;

            case 'users':
                // User creation handled by dedicated import process
                throw new \Exception('User import not implemented via CSV directly.');

            case 'leaves':
                $leaveData = [
                    'user_id' => $row['user_id'],
                    'type' => $row['type'],
                    'start_date' => $row['start_date'],
                    'end_date' => $row['end_date'],
                    'reason' => $row['reason'] ?? null,
                    'status' => $row['status'] ?? 'Pending',
                ];

                \App\Models\Leave::create($leaveData);
                break;
        }
    }

    private function getSampleRow(string $type): string
    {
        switch ($type) {
            case 'attendance':
                return 'EMP001,' . Carbon::today()->toDateString() . ',09:00:00,17:00:00,Present,Regular shift';
            case 'users':
                return 'John Doe,john@example.com,EMP001,+1234567890,Engineering,Developer';
            case 'leaves':
                return '1,Sick,' . Carbon::today()->toDateString() . ',' . Carbon::today()->addDay()->toDateString() . ',Feeling unwell,Pending';
            default:
                return '';
        }
    }
}
