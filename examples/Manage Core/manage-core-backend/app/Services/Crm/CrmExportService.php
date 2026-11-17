<?php

namespace App\Services\Crm;

use App\Models\CrmExportJob;
use App\Models\CrmLead;
use App\Models\CrmContact;
use App\Models\CrmCustomer;
use App\Models\CrmDeal;
use Illuminate\Support\Facades\DB;

class CrmExportService
{
    public function __construct(private CrmAuditService $audit)
    {
    }

    public function createJob(string $entityType, string $format, array $filters = [], array $columns = [], array $selectedIds = [], string $scope = 'all'): CrmExportJob
    {
        $job = CrmExportJob::create([
            'entity_type' => $entityType,
            'format' => $format,
            'scope' => $scope,
            'filters' => $filters,
            'columns' => $columns,
            'selected_ids' => $selectedIds,
            'status' => 'pending',
            'user_id' => auth()->id(),
        ]);

        \App\Jobs\Crm\ProcessExportJob::dispatch($job->id);
        return $job;
    }

    public function processJob(int $jobId): CrmExportJob
    {
        $job = CrmExportJob::findOrFail($jobId);
        $job->update(['status' => 'processing', 'started_at' => now()]);

        $query = $this->buildQuery($job);
        $rows = $query->get();
        $job->update(['total_rows' => $rows->count()]);

        $filePath = $this->buildFile($job, $rows);
        $fileSize = file_exists($filePath) ? filesize($filePath) : 0;

        $job->update([
            'status' => 'completed',
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'completed_at' => now(),
            'expires_at' => now()->addDays(7),
        ]);

        $this->audit->logAction('exported', 'export',
            "Exported {$rows->count()} {$job->entity_type} ({$job->format})", null,
            ['job_id' => $job->id, 'rows' => $rows->count()]
        );

        return $job->fresh();
    }

    protected function buildQuery(CrmExportJob $job)
    {
        $model = match ($job->entity_type) {
            'lead' => CrmLead::class,
            'contact' => CrmContact::class,
            'customer' => CrmCustomer::class,
            'deal' => CrmDeal::class,
            default => null,
        };
        if (!$model) throw new \RuntimeException("Unknown entity: {$job->entity_type}");

        $query = $model::query();

        if ($job->scope === 'selected' && !empty($job->selected_ids)) {
            $query->whereIn('id', $job->selected_ids);
        }

        $filters = $job->filters ?? [];
        foreach ($filters as $field => $val) {
            if ($val === '' || $val === null) continue;
            $query->where($field, $val);
        }

        return $query;
    }

    protected function buildFile(CrmExportJob $job, $rows): string
    {
        $filename = sprintf('%s_%s_%s.%s',
            $job->entity_type,
            auth()->id(),
            now()->format('Ymd_His'),
            $job->format
        );
        $path = 'exports/' . $filename;
        $fullPath = storage_path('app/' . $path);
        @mkdir(dirname($fullPath), 0755, true);

        $columns = $job->columns ?: array_keys($rows->first()?->getAttributes() ?? []);

        if ($job->format === 'csv') {
            $fh = fopen($fullPath, 'w');
            fputcsv($fh, $columns);
            foreach ($rows as $row) {
                $vals = [];
                foreach ($columns as $col) $vals[] = $row->{$col};
                fputcsv($fh, $vals);
            }
            fclose($fh);
        } elseif ($job->format === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->fromArray([$columns], null, 'A1');
            $sheet->fromArray($rows->map(fn($r) => array_map(fn($c) => $r->{$c}, $columns))->toArray(), null, 'A2');
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $writer->save($fullPath);
        } elseif ($job->format === 'pdf') {
            $pdf = new \Dompdf\Dompdf();
            $html = '<table border="1" cellpadding="5"><thead><tr>';
            foreach ($columns as $c) $html .= '<th>' . htmlspecialchars($c) . '</th>';
            $html .= '</tr></thead><tbody>';
            foreach ($rows as $row) {
                $html .= '<tr>';
                foreach ($columns as $col) $html .= '<td>' . htmlspecialchars((string) $row->{$col}) . '</td>';
                $html .= '</tr>';
            }
            $html .= '</tbody></table>';
            $pdf->loadHtml($html);
            $pdf->setPaper('A4', 'landscape');
            $pdf->render();
            file_put_contents($fullPath, $pdf->output());
        }

        return $path;
    }
}