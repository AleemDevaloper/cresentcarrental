<?php

namespace App\Services\Ams;

use App\Models\Account;
use App\Models\AccountGroup;
use App\Models\AccountType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ChartOfAccountsImportExportService
{
    public const TEMPLATE_HEADERS = [
        'code',
        'name',
        'account_type_code',
        'account_group_code',
        'parent_code',
        'normal_balance',
        'description',
        'is_control_account',
        'is_cash_account',
        'is_bank_account',
        'allow_manual_entries',
        'status',
        'tax_category',
    ];

    public const SAMPLE_ROW = [
        'code' => '5100',
        'name' => 'Office Expenses',
        'account_type_code' => 'expense',
        'account_group_code' => '',
        'parent_code' => '',
        'normal_balance' => 'debit',
        'description' => 'General admin expense account',
        'is_control_account' => '0',
        'is_cash_account' => '0',
        'is_bank_account' => '0',
        'allow_manual_entries' => '1',
        'status' => 'active',
        'tax_category' => '',
    ];

    public function exportCsv(Request $request): Response
    {
        $rows = $this->fetchRows($request);
        $csv = $this->buildCsv($rows);
        $filename = 'chart_of_accounts_' . date('Ymd_His') . '.csv';
        return $this->csvResponse($csv, $filename);
    }

    public function exportXlsx(Request $request): Response
    {
        $rows = $this->fetchRows($request);

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Chart of Accounts');

        $headerRow = self::TEMPLATE_HEADERS;
        $col = 0;
        foreach ($headerRow as $h) {
            $col++;
            $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col) . '1';
            $sheet->setCellValue($cell, $h);
        }
        $rowNum = 1;
        foreach ($rows as $r) {
            $rowNum++;
            $col = 0;
            foreach ($headerRow as $h) {
                $col++;
                $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col) . $rowNum;
                $sheet->setCellValue($cell, (string) ($r[$h] ?? ''));
            }
        }

        $highestCol = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($headerRow));
        foreach (range(1, count($headerRow)) as $c) {
            $sheet->getColumnDimension(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c))->setAutoSize(true);
        }
        $sheet->getStyle('A1:' . $highestCol . '1')->getFont()->setBold(true);

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tmp = tempnam(sys_get_temp_dir(), 'coa_') . '.xlsx';
        $writer->save($tmp);
        $contents = file_get_contents($tmp);
        @unlink($tmp);

        $filename = 'chart_of_accounts_' . date('Ymd_His') . '.xlsx';
        return new Response($contents, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Content-Length' => (string) strlen($contents),
        ]);
    }

    public function templateCsv(): Response
    {
        $csv = $this->buildCsv([self::SAMPLE_ROW], includeHeaderSample: true);
        $filename = 'chart_of_accounts_template.csv';
        return $this->csvResponse($csv, $filename);
    }

    public function templateXlsx(): Response
    {
        return $this->exportXlsx(request());
    }

    public function importCsv(Request $request): JsonResponse
    {
        if (!$request->hasFile('file')) {
            return response()->json(['message' => 'No file uploaded'], 422);
        }
        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        if ($ext === 'xlsx' || $ext === 'xls') {
            $rows = $this->parseXlsx($file->getRealPath());
        } else {
            $rows = $this->parseCsv($file->getRealPath());
        }
        return response()->json($this->importRows($rows));
    }

    public function importRows(array $rows): array
    {
        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        $typeCache = [];
        $groupCache = [];
        $accountCache = [];

        $normalizer = fn($v) => strtolower(trim((string) $v));

        $parseBool = function ($v) {
            $s = strtolower(trim((string) $v));
            if ($s === '') return null;
            if (in_array($s, ['1', 'true', 'yes', 'y'], true)) return true;
            if (in_array($s, ['0', 'false', 'no', 'n'], true)) return false;
            return null;
        };

        DB::connection('tenant')->beginTransaction();
        try {
            foreach ($rows as $idx => $row) {
                $lineNum = $idx + 2;
                $row = $this->normalizeRow($row);
                $code = trim((string) ($row['code'] ?? ''));
                if ($code === '') {
                    $skipped++;
                    $errors[] = ['line' => $lineNum, 'code' => '', 'message' => 'Missing account code'];
                    continue;
                }
                $name = trim((string) ($row['name'] ?? ''));
                if ($name === '') {
                    $skipped++;
                    $errors[] = ['line' => $lineNum, 'code' => $code, 'message' => 'Missing account name'];
                    continue;
                }

                $typeCode = $normalizer($row['account_type_code'] ?? '');
                $groupCode = trim((string) ($row['account_group_code'] ?? ''));
                $parentCode = trim((string) ($row['parent_code'] ?? ''));
                $normalBalance = $normalizer($row['normal_balance'] ?? 'debit');
                if (!in_array($normalBalance, ['debit', 'credit'], true)) {
                    $normalBalance = 'debit';
                }
                $status = strtolower(trim((string) ($row['status'] ?? 'active')));
                if (!in_array($status, ['active', 'inactive', 'archived', 'draft'], true)) {
                    $status = 'active';
                }
                $description = (string) ($row['description'] ?? '');
                $taxCategory = (string) ($row['tax_category'] ?? '') ?: null;

                $isControl = (bool) ($parseBool($row['is_control_account'] ?? null) ?? false);
                $isCash = (bool) ($parseBool($row['is_cash_account'] ?? null) ?? false);
                $isBank = (bool) ($parseBool($row['is_bank_account'] ?? null) ?? false);
                $allowManual = (bool) ($parseBool($row['allow_manual_entries'] ?? '1') ?? true);

                $typeId = null;
                if ($typeCode !== '') {
                    $typeId = $typeCache[$typeCode] ?? null;
                    if ($typeId === null) {
                        $type = AccountType::where('code', $typeCode)
                            ->orWhere('name', $typeCode)
                            ->first();
                        if ($type) {
                            $typeId = $type->id;
                        } else {
                            $type = AccountType::create([
                                'name' => ucfirst($typeCode),
                                'code' => $typeCode,
                                'description' => 'Auto-created from import',
                            ]);
                            $typeId = $type->id;
                        }
                        $typeCache[$typeCode] = $typeId;
                    }
                }

                $groupId = null;
                if ($groupCode !== '' && $typeId) {
                    $cacheKey = $typeId . '|' . $groupCode;
                    $groupId = $groupCache[$cacheKey] ?? null;
                    if ($groupId === null) {
                        $group = AccountGroup::where('account_type_id', $typeId)
                            ->where(function ($q) use ($groupCode) {
                                $q->where('code', $groupCode)->orWhere('name', $groupCode);
                            })
                            ->first();
                        if ($group) {
                            $groupId = $group->id;
                        } else {
                            $group = AccountGroup::create([
                                'account_type_id' => $typeId,
                                'name' => $groupCode,
                                'code' => $groupCode,
                                'description' => 'Auto-created from import',
                            ]);
                            $groupId = $group->id;
                        }
                        $groupCache[$cacheKey] = $groupId;
                    }
                }

                if (!$groupId) {
                    $defaultTypeId = $typeId;
                    if (!$defaultTypeId) {
                        $defaultType = AccountType::firstOrCreate(
                            ['code' => 'general'],
                            ['name' => 'General', 'description' => 'Default account type']
                        );
                        $defaultTypeId = $defaultType->id;
                    }
                    $cacheKey = $defaultTypeId . '|__default__';
                    $groupId = $groupCache[$cacheKey] ?? null;
                    if ($groupId === null) {
                        $defaultGroup = AccountGroup::firstOrCreate(
                            ['account_type_id' => $defaultTypeId, 'code' => 'general'],
                            ['name' => 'General', 'description' => 'Default account group']
                        );
                        $groupId = $defaultGroup->id;
                        $groupCache[$cacheKey] = $groupId;
                    }
                }

                $parentId = null;
                if ($parentCode !== '') {
                    $parentId = $accountCache[$parentCode] ?? null;
                    if ($parentId === null) {
                        $parent = Account::where('code', $parentCode)->first();
                        if ($parent) {
                            $parentId = $parent->id;
                        }
                    }
                    $accountCache[$parentCode] = $parentId;
                }

                $payload = [
                    'account_type_id' => $typeId,
                    'account_group_id' => $groupId,
                    'parent_id' => $parentId,
                    'code' => $code,
                    'name' => $name,
                    'description' => $description,
                    'normal_balance' => $normalBalance,
                    'is_control_account' => $isControl,
                    'is_cash_account' => $isCash,
                    'is_bank_account' => $isBank,
                    'allow_manual_entries' => $allowManual,
                    'status' => $status,
                    'tax_category' => $taxCategory,
                ];

                $existing = Account::where('code', $code)->first();
                if ($existing) {
                    $existing->fill($payload);
                    $existing->save();
                    $updated++;
                } else {
                    $account = Account::create($payload);
                    $accountCache[$code] = $account->id;
                    $created++;
                }
            }
            DB::connection('tenant')->commit();
        } catch (\Throwable $e) {
            DB::connection('tenant')->rollBack();
            return [
                'success' => false,
                'created' => 0,
                'updated' => 0,
                'skipped' => 0,
                'errors' => [['line' => 0, 'code' => '', 'message' => $e->getMessage()]],
            ];
        }

        return [
            'success' => true,
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
            'total_processed' => $created + $updated + $skipped,
        ];
    }

    protected function fetchRows(Request $request): array
    {
        $q = Account::with(['type:id,code,name', 'group:id,code,name', 'parent:id,code']);
        $query = $request->input('q');
        if ($query) {
            $q->where(function ($w) use ($query) {
                $w->where('code', 'like', "%{$query}%")
                  ->orWhere('name', 'like', "%{$query}%");
            });
        }
        $accounts = $q->orderBy('code')->get();
        return $accounts->map(function (Account $a) {
            return [
                'code' => $a->code,
                'name' => $a->name,
                'account_type_code' => $a->type ? ($a->type->code ?: $a->type->name) : '',
                'account_group_code' => $a->group ? ($a->group->code ?: $a->group->name) : '',
                'parent_code' => $a->parent ? $a->parent->code : '',
                'normal_balance' => $a->normal_balance ?: 'debit',
                'description' => $a->description ?: '',
                'is_control_account' => $a->is_control_account ? '1' : '0',
                'is_cash_account' => $a->is_cash_account ? '1' : '0',
                'is_bank_account' => $a->is_bank_account ? '1' : '0',
                'allow_manual_entries' => $a->allow_manual_entries ? '1' : '0',
                'status' => $a->status ?: 'active',
                'tax_category' => $a->tax_category ?: '',
            ];
        })->toArray();
    }

    protected function buildCsv(array $rows, bool $includeHeaderSample = false): string
    {
        $headers = self::TEMPLATE_HEADERS;
        $out = [];
        $out[] = $this->csvLine($headers, isHeader: true);
        $sample = $includeHeaderSample ? self::SAMPLE_ROW : null;
        if ($sample) {
            $out[] = $this->csvLine($sample);
        }
        foreach ($rows as $r) {
            $out[] = $this->csvLine($r);
        }
        return implode("\n", $out) . "\n";
    }

    protected function csvLine(array $row, bool $isHeader = false): string
    {
        $cells = [];
        foreach (self::TEMPLATE_HEADERS as $h) {
            if ($isHeader) {
                $v = $h;
            } else {
                $v = $row[$h] ?? '';
            }
            $v = (string) $v;
            $escaped = str_replace('"', '""', $v);
            $cells[] = '"' . $escaped . '"';
        }
        return implode(',', $cells);
    }

    protected function csvResponse(string $csv, string $filename): Response
    {
        return new Response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Content-Length' => (string) strlen($csv),
        ]);
    }

    protected function parseCsv(string $path): array
    {
        $rows = [];
        if (($h = fopen($path, 'r')) !== false) {
            $bom = "\xEF\xBB\xBF";
            $headers = null;
            $lineNum = 0;
            while (($data = fgetcsv($h)) !== false) {
                $lineNum++;
                if ($lineNum === 1) {
                    $headers = array_map(
                        fn($x) => strtolower(trim((string) $x)),
                        $data
                    );
                    if (!empty($headers) && isset($headers[0])) {
                        $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]);
                    }
                    continue;
                }
                if ($headers === null) break;
                if (count($data) === 1 && ($data[0] === null || $data[0] === '')) {
                    continue;
                }
                $row = [];
                foreach ($headers as $i => $key) {
                    $row[$key] = $data[$i] ?? '';
                }
                $rows[] = $row;
            }
            fclose($h);
        }
        return $rows;
    }

    protected function parseXlsx(string $path): array
    {
        $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($path);
        $spreadsheet = $reader->load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = [];
        $header = null;
        foreach ($sheet->getRowIterator() as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            $values = [];
            foreach ($cellIterator as $cell) {
                $values[] = (string) $cell->getValue();
            }
            if ($header === null) {
                $header = array_map(fn($x) => strtolower(trim($x)), $values);
                continue;
            }
            $assoc = [];
            foreach ($header as $i => $key) {
                $assoc[$key] = $values[$i] ?? '';
            }
            $rows[] = $assoc;
        }
        return $rows;
    }

    protected function normalizeRow(array $row): array
    {
        $out = [];
        foreach (self::TEMPLATE_HEADERS as $h) {
            $out[$h] = $row[$h] ?? '';
        }
        return $out;
    }
}