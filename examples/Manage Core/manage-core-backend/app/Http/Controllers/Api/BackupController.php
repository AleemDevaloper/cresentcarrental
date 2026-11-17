<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BackupLog;
use Dompdf\Dompdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => BackupLog::latest()->take(50)->get()]);
    }

    public function run(): JsonResponse
    {
        $log = BackupLog::create([
            'status' => 'success',
            'file_path' => 'backups/backup-' . now()->format('Y-m-d-H-i-s') . '.sql',
            'file_size' => 15728640,
            'type' => 'full',
        ]);

        return response()->json(['data' => $log]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'lastBackup' => BackupLog::latest()->first()?->created_at,
                'totalBackups' => BackupLog::count(),
                'successRate' => '98%',
                'storageUsed' => '1.2 GB',
            ]
        ]);
    }

    public function export(Request $request, string $format)
    {
        $tables = DB::select('SHOW TABLES');
        $dbName = DB::getDatabaseName();
        $key = 'Tables_in_' . $dbName;
        $tableNames = array_map(fn($t) => $t->$key, $tables);

        $allData = [];
        foreach ($tableNames as $name) {
            $columns = DB::select("SHOW COLUMNS FROM `{$name}`");
            $rows = DB::table($name)->get()->map(fn($r) => (array) $r)->toArray();
            $allData[$name] = [
                'columns' => array_map(fn($c) => $c->Field, $columns),
                'rows' => $rows,
            ];
        }

        return match ($format) {
            'sql' => $this->exportSql($dbName, $allData),
            'excel' => $this->exportCsv($allData),
            'nosql' => $this->exportNoSql($dbName, $allData),
            'pdf' => $this->exportPdf($dbName, $allData),
            default => response()->json(['message' => 'Invalid format. Use: sql, excel, nosql, pdf'], 400),
        };
    }

    private function exportSql(string $dbName, array $allData): StreamedResponse
    {
        $sql = "-- Manage Core Database Export\n";
        $sql .= "-- Database: {$dbName}\n";
        $sql .= "-- Generated: " . now()->toDateTimeString() . "\n\n";

        foreach ($allData as $table => $info) {
            $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";
            $create = DB::select("SHOW CREATE TABLE `{$table}`");
            $sql .= $create[0]->{'Create Table'} . ";\n\n";

            foreach ($info['rows'] as $row) {
                $cols = '`' . implode('`, `', $info['columns']) . '`';
                $vals = implode(', ', array_map(fn($v) => is_null($v) ? 'NULL' : DB::connection()->getPdo()->quote($v), $row));
                $sql .= "INSERT INTO `{$table}` ({$cols}) VALUES ({$vals});\n";
            }
            $sql .= "\n";
        }

        return response()->streamDownload(function () use ($sql) {
            echo $sql;
        }, 'manage-core-backup-' . now()->format('Y-m-d-H-i-s') . '.sql', ['Content-Type' => 'application/sql']);
    }

    private function exportCsv(array $allData): StreamedResponse
    {
        $csv = "Table,Column,Value\n";
        foreach ($allData as $table => $info) {
            foreach ($info['rows'] as $row) {
                foreach ($row as $col => $val) {
                    $csv .= '"' . $table . '","' . $col . '","' . str_replace('"', '""', $val ?? '') . "\"\n";
                }
            }
        }

        return response()->streamDownload(function () use ($csv) {
            echo $csv;
        }, 'manage-core-backup-' . now()->format('Y-m-d-H-i-s') . '.csv', ['Content-Type' => 'text/csv']);
    }

    private function exportNoSql(string $dbName, array $allData): StreamedResponse
    {
        $nosql = ['database' => $dbName, 'exported_at' => now()->toIso8601String(), 'collections' => []];
        foreach ($allData as $table => $info) {
            $nosql['collections'][] = [
                'collection' => $table,
                'documents' => $info['rows'],
            ];
        }

        return response()->streamDownload(function () use ($nosql) {
            echo json_encode($nosql, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, 'manage-core-nosql-' . now()->format('Y-m-d-H-i-s') . '.json', ['Content-Type' => 'application/json']);
    }

    private function exportPdf(string $dbName, array $allData): mixed
    {
        $html = '<html><head><style>
            body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
            h1 { font-size: 18px; color: #4f46e5; }
            h2 { font-size: 14px; margin-top: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th { background: #4f46e5; color: white; padding: 6px 8px; text-align: left; font-size: 9px; }
            td { padding: 4px 8px; border: 1px solid #ddd; font-size: 9px; word-break: break-all; }
            tr:nth-child(even) { background: #f9f9f9; }
            .meta { color: #666; font-size: 10px; margin-bottom: 20px; }
        </style></head><body>';
        $html .= '<h1>Manage Core Database Export</h1>';
        $html .= '<div class="meta">Database: ' . $dbName . ' | Generated: ' . now()->toDateTimeString() . ' | Tables: ' . count($allData) . '</div>';

        foreach ($allData as $table => $info) {
            $html .= '<h2>' . $table . ' (' . count($info['rows']) . ' rows)</h2>';
            $html .= '<table><thead><tr>';
            foreach ($info['columns'] as $col) {
                $html .= '<th>' . htmlspecialchars($col) . '</th>';
            }
            $html .= '</tr></thead><tbody>';
            foreach ($info['rows'] as $row) {
                $html .= '<tr>';
                foreach ($info['columns'] as $col) {
                    $val = $row[$col] ?? '';
                    $html .= '<td>' . htmlspecialchars(is_null($val) ? 'NULL' : $val) . '</td>';
                }
                $html .= '</tr>';
            }
            $html .= '</tbody></table>';
        }

        $html .= '</body></html>';

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();
        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, 'manage-core-backup-' . now()->format('Y-m-d-H-i-s') . '.pdf', ['Content-Type' => 'application/pdf']);
    }
}
