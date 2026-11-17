<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankExport;
use App\Models\HrmsPayrollBatch;
use App\Models\Payslip;
use App\Models\BankDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BankExportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BankExport::query()->with('generator');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json([
            'data' => $query->latest()->paginate($request->per_page ?? 50),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payroll_batch_id' => 'required|exists:hrms_payroll_batches,id',
            'bank_name' => 'required|string|max:255',
        ]);

        $batch = HrmsPayrollBatch::findOrFail($validated['payroll_batch_id']);

        if ($batch->status !== 'locked' && $batch->status !== 'paid') {
            return response()->json(['message' => 'Batch must be locked or paid before export.'], 422);
        }

        $payrollRun = $batch->month . '/' . $batch->year;

        $payslips = Payslip::where('month', $batch->month)
            ->where('year', $batch->year)
            ->where('status', 'paid')
            ->get();

        if ($payslips->isEmpty()) {
            return response()->json(['message' => 'No paid payslips found for this batch.'], 422);
        }

        $employeeIds = $payslips->pluck('user_id');

        $bankDetails = BankDetail::whereIn('user_id', $employeeIds)
            ->where('bank_name', $validated['bank_name'])
            ->where('is_primary', true)
            ->where('verification_status', 'verified')
            ->get()
            ->keyBy('user_id');

        $exportData = [];
        $totalAmount = 0;
        $exportedCount = 0;

        foreach ($payslips as $payslip) {
            $detail = $bankDetails->get($payslip->user_id);
            if (!$detail) continue;

            $exportData[] = [
                'employee_code' => $payslip->user->employee_id ?? 'N/A',
                'employee_name' => $payslip->user->name ?? 'Unknown',
                'account_title' => $detail->account_title,
                'account_number' => $detail->account_number,
                'iban' => $detail->iban,
                'branch_code' => $detail->branch_code,
                'net_salary' => $payslip->net_salary,
            ];
            $totalAmount += $payslip->net_salary;
            $exportedCount++;
        }

        if ($exportedCount === 0) {
            return response()->json(['message' => 'No employees with verified bank details found for ' . $validated['bank_name'] . '.'], 422);
        }

        $exportCode = 'BEX-' . strtoupper(Str::random(8));
        $fileName = 'bank_exports/' . $exportCode . '_' . $validated['bank_name'] . '_' . $payrollRun . '.csv';

        $this->writeCsv(storage_path('app/' . $fileName), $exportData);

        $export = BankExport::create([
            'payroll_batch_id' => $batch->id,
            'bank_name' => $validated['bank_name'],
            'export_code' => $exportCode,
            'title' => $validated['bank_name'] . ' - ' . $payrollRun,
            'payroll_run' => $payrollRun,
            'total_amount' => $totalAmount,
            'employee_count' => $exportedCount,
            'status' => 'completed',
            'file_path' => $fileName,
            'generated_by' => $request->user()?->id,
            'completed_at' => now(),
        ]);

        return response()->json(['data' => $export], 201);
    }

    public function show(BankExport $bankExport): JsonResponse
    {
        return response()->json(['data' => $bankExport->load(['payrollBatch', 'generator'])]);
    }

    public function download(BankExport $bankExport)
    {
        if (!$bankExport->file_path || !storage_path('app/' . $bankExport->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return response()->download(
            storage_path('app/' . $bankExport->file_path),
            $bankExport->export_code . '_' . $bankExport->bank_name . '.csv'
        );
    }

    public function retry(Request $request, BankExport $bankExport): JsonResponse
    {
        if ($bankExport->status !== 'failed') {
            return response()->json(['message' => 'Only failed exports can be retried.'], 422);
        }

        $validated = $request->validate([
            'payroll_batch_id' => 'required|exists:hrms_payroll_batches,id',
            'bank_name' => 'required|string|max:255',
        ]);

        $request->merge($validated);
        return $this->store($request);
    }

    public function banks(): JsonResponse
    {
        $banks = BankDetail::select('bank_name')
            ->where('is_primary', true)
            ->where('verification_status', 'verified')
            ->distinct()
            ->orderBy('bank_name')
            ->pluck('bank_name');

        return response()->json(['data' => $banks]);
    }

    public function stats(): JsonResponse
    {
        return response()->json(['data' => [
            'total_exports' => BankExport::count(),
            'total_amount' => BankExport::where('status', 'completed')->sum('total_amount'),
            'failed_exports' => BankExport::where('status', 'failed')->count(),
            'processing_exports' => BankExport::where('status', 'processing')->count(),
            'recent_exports' => BankExport::where('status', 'completed')->latest()->limit(5)->get(),
        ]]);
    }

    private function writeCsv(string $path, array $rows): void
    {
        $dir = dirname($path);
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $handle = fopen($path, 'w');
        fputcsv($handle, ['Employee Code', 'Employee Name', 'Account Title', 'Account Number', 'IBAN', 'Branch Code', 'Net Salary']);

        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
    }
}
