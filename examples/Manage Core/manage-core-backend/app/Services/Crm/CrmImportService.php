<?php

namespace App\Services\Crm;

use App\Models\CrmImportJob;
use App\Models\CrmImportRow;
use App\Models\CrmLead;
use App\Models\CrmContact;
use App\Models\CrmCustomer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmImportService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmDuplicateService $duplicates
    ) {
    }

    public function createJob(string $entityType, string $filePath, string $fileName, array $mapping = []): CrmImportJob
    {
        $job = CrmImportJob::create([
            'entity_type' => $entityType,
            'file_name' => $fileName,
            'disk' => 'local',
            'path' => $filePath,
            'column_mapping' => $mapping,
            'status' => 'pending',
            'user_id' => auth()->id(),
        ]);

        \App\Jobs\Crm\ProcessImportJob::dispatch($job->id);
        return $job;
    }

    public function processJob(int $jobId): array
    {
        $job = CrmImportJob::findOrFail($jobId);
        $job->update(['status' => 'processing', 'started_at' => now()]);

        $rows = $this->parseFile($job->path, $job->disk);
        $job->update(['total_rows' => count($rows)]);

        $standardFields = $this->standardFieldsFor($job->entity_type);
        $fieldMapping = $job->column_mapping ?? [];

        $results = ['success' => 0, 'skipped' => 0, 'failed' => 0, 'duplicate' => 0];

        foreach ($rows as $idx => $row) {
            $rowNumber = $idx + 1;
            $mapped = [];
            foreach ($row as $csvKey => $val) {
                $targetKey = $fieldMapping[$csvKey] ?? $csvKey;
                $targetKey = strtolower(str_replace(' ', '_', trim($targetKey)));
                if (in_array($targetKey, $standardFields)) {
                    $mapped[$targetKey] = $val;
                }
            }

            // duplicate check
            if ($duplicateId = $this->checkDuplicateRecord($job->entity_type, $mapped)) {
                CrmImportRow::create([
                    'job_id' => $job->id,
                    'row_number' => $rowNumber,
                    'raw_data' => $row,
                    'status' => 'duplicate',
                    'error' => 'Duplicate of record #' . $duplicateId,
                ]);
                $results['duplicate']++;
                $job->increment('duplicate_count');
                $job->increment('processed_rows');
                continue;
            }

            try {
                $entity = $this->createEntity($job->entity_type, $mapped);
                CrmImportRow::create([
                    'job_id' => $job->id,
                    'row_number' => $rowNumber,
                    'raw_data' => $row,
                    'status' => 'success',
                    'created_entity_id' => $entity->id,
                ]);
                $results['success']++;
                $job->increment('success_count');
            } catch (\Throwable $e) {
                CrmImportRow::create([
                    'job_id' => $job->id,
                    'row_number' => $rowNumber,
                    'raw_data' => $row,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ]);
                $results['failed']++;
                $job->increment('failed_count');
            }
            $job->increment('processed_rows');
        }

        $job->update(['status' => 'completed', 'completed_at' => now()]);
        $this->audit->logAction('imported', 'import',
            sprintf('Imported %d %s (success=%d, duplicate=%d, failed=%d)',
                $job->processed_rows, $job->entity_type,
                $results['success'], $results['duplicate'], $results['failed']
            )
        );
        return $results;
    }

    protected function parseFile(string $path, string $disk): array
    {
        $fullPath = \Storage::disk($disk)->path($path);
        if (!file_exists($fullPath)) return [];

        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $rows = [];

        if ($ext === 'csv') {
            $fh = fopen($fullPath, 'r');
            $headers = null;
            while (($data = fgetcsv($fh)) !== false) {
                if (!$headers) {
                    $headers = array_map(fn($h) => strtolower(trim($h)), $data);
                    continue;
                }
                $rows[] = array_combine($headers, $data);
            }
            fclose($fh);
        } elseif (in_array($ext, ['xlsx', 'xls'])) {
            try {
                $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($fullPath);
                $sheet = $spreadsheet->getActiveSheet();
                $headers = null;
                foreach ($sheet->getRowIterator() as $row) {
                    $cells = [];
                    foreach ($row->getCellIterator() as $cell) $cells[] = $cell->getValue();
                    if (!$headers) {
                        $headers = array_map(fn($h) => strtolower(trim((string) $h)), $cells);
                        continue;
                    }
                    if (count($cells) === count($headers)) {
                        $rows[] = array_combine($headers, $cells);
                    }
                }
            } catch (\Throwable $e) {
                return [];
            }
        }

        return $rows;
    }

    protected function standardFieldsFor(string $entityType): array
    {
        return match ($entityType) {
            'lead' => ['name', 'first_name', 'last_name', 'company', 'email', 'phone', 'mobile', 'website',
                'linkedin', 'country', 'state', 'city', 'address', 'postal_code', 'source',
                'industry', 'company_size', 'status', 'rating', 'score', 'assigned_to', 'campaign_id', 'tags', 'notes'],
            'contact' => ['first_name', 'last_name', 'email', 'phone', 'mobile', 'title', 'department',
                'linkedin', 'twitter', 'address', 'notes', 'customer_id'],
            'customer' => ['name', 'company', 'email', 'phone', 'website', 'industry', 'size',
                'type', 'status', 'rating', 'annual_revenue', 'employee_count', 'address',
                'city', 'state', 'country', 'postal_code', 'notes', 'assigned_to', 'source', 'tags'],
            default => [],
        };
    }

    protected function checkDuplicateRecord(string $entityType, array $mapped): ?int
    {
        if (!empty($mapped['email'])) {
            $email = strtolower(trim($mapped['email']));
            $model = match ($entityType) {
                'lead' => CrmLead::class,
                'contact' => CrmContact::class,
                'customer' => CrmCustomer::class,
                default => null,
            };
            if ($model) {
                $existing = $model::whereRaw('LOWER(email) = ?', [$email])->value('id');
                if ($existing) return $existing;
            }
        }
        return null;
    }

    protected function createEntity(string $entityType, array $mapped): Model
    {
        return DB::connection('tenant')->transaction(function () use ($entityType, $mapped) {
            switch ($entityType) {
                case 'lead':
                    if (empty($mapped['name'])) $mapped['name'] = $mapped['email'] ?? 'Imported Lead';
                    $count = CrmLead::count() + 1;
                    $mapped['code'] = 'LEAD-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
                    $mapped['created_by'] = auth()->id();
                    $mapped['tags'] = $mapped['tags'] ?? [];
                    return CrmLead::create($mapped);

                case 'contact':
                    if (empty($mapped['customer_id'])) throw new \RuntimeException('customer_id required');
                    $mapped['created_by'] = auth()->id();
                    $mapped['tags'] = $mapped['tags'] ?? [];
                    return CrmContact::create($mapped);

                case 'customer':
                    if (empty($mapped['name'])) throw new \RuntimeException('name required');
                    $count = CrmCustomer::count() + 1;
                    $mapped['code'] = 'CUS-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
                    $mapped['created_by'] = auth()->id();
                    $mapped['tags'] = $mapped['tags'] ?? [];
                    return CrmCustomer::create($mapped);
            }

            throw new \RuntimeException("Unknown entity type: $entityType");
        });
    }
}