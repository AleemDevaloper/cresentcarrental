<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalaryComponent;
use App\Models\SalaryStructure;
use App\Models\EmployeeSalary;
use App\Models\HrmsTaxSlab;
use App\Models\HrmsPayrollBatch;
use App\Models\Payslip;
use App\Models\Attendance;
use App\Models\Loan;
use App\Models\EmiSchedule;
use App\Jobs\ProcessPayrollBatch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    // --- Components & Structures (Existing) ---
    public function listComponents(): JsonResponse
    {
        return response()->json(['data' => SalaryComponent::with('parentComponent')->get()]);
    }

    public function storeComponent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
            'is_fixed' => 'boolean',
            'calculation_type' => 'nullable|in:flat,percentage',
            'percentage_of' => 'nullable|exists:salary_components,id',
            'value' => 'numeric',
            'is_taxable' => 'boolean',
            'is_statutory' => 'boolean',
        ]);

        $component = SalaryComponent::create($validated);
        return response()->json(['data' => $component], 201);
    }

    public function listStructures(): JsonResponse
    {
        return response()->json(['data' => SalaryStructure::with('components')->get()]);
    }

    public function storeStructure(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'components' => 'array',
            'components.*.id' => 'exists:salary_components,id',
            'components.*.override_value' => 'nullable|numeric',
        ]);

        $structure = SalaryStructure::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['components'])) {
            foreach ($validated['components'] as $comp) {
                $structure->components()->attach($comp['id'], ['override_value' => $comp['override_value'] ?? null]);
            }
        }

        return response()->json(['data' => $structure->load('components')], 201);
    }

    // --- Tax Slabs ---
    public function listTaxSlabs(): JsonResponse
    {
        return response()->json(['data' => HrmsTaxSlab::orderBy('income_from')->get()]);
    }

    public function storeTaxSlab(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'income_from' => 'required|numeric',
            'income_to' => 'nullable|numeric',
            'fixed_tax' => 'required|numeric',
            'percentage' => 'required|numeric',
        ]);

        $slab = HrmsTaxSlab::create($validated);
        return response()->json(['data' => $slab], 201);
    }

    // --- Batch Processing ---
    public function listBatches(Request $request): JsonResponse
    {
        $perPage = $request->per_page ?? 50;
        $batches = HrmsPayrollBatch::with('processedBy')->latest()->paginate($perPage);
        return response()->json([
            'data' => $batches->items(),
            'pagination' => [
                'current_page' => $batches->currentPage(),
                'per_page' => $batches->perPage(),
                'total' => $batches->total(),
                'last_page' => $batches->lastPage(),
            ],
        ]);
    }

    public function createBatch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);

        $batch = HrmsPayrollBatch::create([
            'month' => $validated['month'],
            'year' => $validated['year'],
            'status' => 'draft',
            'processed_by' => $request->user()->id,
        ]);

        return response()->json(['data' => $batch], 201);
    }

    public function runBatch(HrmsPayrollBatch $batch): JsonResponse
    {
        if ($batch->status !== 'draft') {
            return response()->json(['message' => 'Batch already processed or locked.'], 422);
        }

        ProcessPayrollBatch::dispatch($batch);

        return response()->json([
            'data' => $batch,
            'message' => 'Payroll processing has been queued. Check back shortly for results.',
        ]);
    }

    private function calculateEmployeePayslip(EmployeeSalary $empSal, HrmsPayrollBatch $batch)
    {
        $userId = $empSal->user_id;
        $month = $batch->month;
        $year = $batch->year;
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $presentDays = Attendance::where('user_id', $userId)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->whereIn('status', ['Present', 'Late', 'Half Day'])
            ->count();
        
        $absentDays = $daysInMonth - $presentDays; // Simplified: assumes all days are working

        // 2. Components Calculation
        $earnings = [];
        $deductions = [];
        $grossEarning = 0;
        $totalDeduction = 0;

        $baseAmount = $empSal->base_amount;
        $componentValues = ['Basic' => $baseAmount]; // Keep track of calculated values for percentage dependencies

        // Sort components so that parents are calculated first (Simplified: assume sorted by ID or hierarchical logic)
        $sortedComponents = $empSal->structure->components->sortBy('percentage_of');

        foreach ($sortedComponents as $component) {
            $value = 0;
            if ($component->is_fixed) {
                $value = $component->pivot->override_value ?? $component->value;
            } else {
                if ($component->calculation_type === 'percentage') {
                    $parentValue = $baseAmount; // Default to basic
                    if ($component->percentage_of) {
                        $parent = $empSal->structure->components->firstWhere('id', $component->percentage_of);
                        if ($parent) {
                            // Find calculated value of parent
                            $parentValue = $componentValues[$parent->name] ?? 0;
                        }
                    }
                    $value = ($component->value / 100) * $parentValue;
                }
            }

            $componentValues[$component->name] = $value;

            if ($component->type === 'earning') {
                $earnings[] = ['name' => $component->name, 'amount' => round($value, 2)];
                $grossEarning += $value;
            } else {
                $deductions[] = ['name' => $component->name, 'amount' => round($value, 2)];
                $totalDeduction += $value;
            }
        }

        // 3. LWP Deduction
        if ($absentDays > 0) {
            $lwpAmount = ($baseAmount / $daysInMonth) * $absentDays;
            $deductions[] = ['name' => 'LWP Deduction', 'amount' => round($lwpAmount, 2)];
            $totalDeduction += $lwpAmount;
        }

        // 4. Loan EMIs
        $emis = EmiSchedule::whereHas('loan', function($q) use ($userId) {
                $q->where('user_id', $userId)->where('status', 'Approved');
            })
            ->where('month', $month)
            ->where('year', $year)
            ->where('status', 'Pending')
            ->get();

        foreach ($emis as $emi) {
            $deductions[] = ['name' => 'Loan EMI (' . $emi->loan->loan_type . ')', 'amount' => round($emi->amount, 2)];
            $totalDeduction += $emi->amount;
            // Note: status update to 'Paid' should happen when batch is 'Paid'
        }

        // 5. Income Tax Calculation
        $yearlyGross = $grossEarning * 12;
        $taxSlab = HrmsTaxSlab::where('income_from', '<=', $yearlyGross)
            ->where(function($q) use ($yearlyGross) {
                $q->where('income_to', '>=', $yearlyGross)->orWhereNull('income_to');
            })
            ->first();

        if ($taxSlab) {
            $taxableAmount = $yearlyGross - $taxSlab->income_from;
            $yearlyTax = $taxSlab->fixed_tax + ($taxableAmount * ($taxSlab->percentage / 100));
            $monthlyTax = $yearlyTax / 12;
            
            if ($monthlyTax > 0) {
                $deductions[] = ['name' => 'Income Tax', 'amount' => round($monthlyTax, 2)];
                $totalDeduction += $monthlyTax;
            }
        }

        $netSalary = $grossEarning - $totalDeduction;

        // 6. Approved Expenses (Non-taxable additions)
        $approvedExpenses = \App\Models\Expense::where('user_id', $userId)
            ->where('status', 'approved')
            ->whereNull('payslip_id')
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get();

        foreach ($approvedExpenses as $exp) {
            $earnings[] = ['name' => 'Reimbursement (' . $exp->category . ')', 'amount' => round($exp->amount, 2)];
            $grossEarning += $exp->amount;
            $netSalary += $exp->amount;
        }

        // 7. Approved Overtime
        $approvedOvertime = \App\Models\Overtime::where('user_id', $userId)
            ->where('status', 'approved')
            ->whereNull('payslip_id')
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();

        foreach ($approvedOvertime as $ot) {
            $earnings[] = ['name' => 'Overtime (' . $ot->hours . ' hrs)', 'amount' => round($ot->amount, 2)];
            $grossEarning += $ot->amount;
            $netSalary += $ot->amount;
        }

        $payslip = Payslip::create([
            'batch_id' => $batch->id,
            'user_id' => $userId,
            'month' => $month,
            'year' => $year,
            'gross_earning' => round($grossEarning, 2),
            'total_deduction' => round($totalDeduction, 2),
            'net_salary' => round($netSalary, 2),
            'earnings_breakdown' => $earnings,
            'deductions_breakdown' => $deductions,
            'attendance_summary' => [
                'total_days' => $daysInMonth,
                'present_days' => $presentDays,
                'absent_days' => $absentDays
            ],
            'generated_by' => $batch->processed_by,
            'status' => 'draft'
        ]);

        if ($approvedExpenses->isNotEmpty()) {
            \App\Models\Expense::whereIn('id', $approvedExpenses->pluck('id'))->update(['payslip_id' => $payslip->id]);
        }
        if ($approvedOvertime->isNotEmpty()) {
            \App\Models\Overtime::whereIn('id', $approvedOvertime->pluck('id'))->update(['payslip_id' => $payslip->id]);
        }

        return $payslip;
    }

    public function finalizeBatch(HrmsPayrollBatch $batch): JsonResponse
    {
        if ($batch->status !== 'verified') {
            return response()->json(['message' => 'Batch must be verified before locking.'], 422);
        }

        $batch->update(['status' => 'locked']);
        Payslip::where('batch_id', $batch->id)->update(['status' => 'locked']);

        return response()->json(['data' => $batch]);
    }

    public function payBatch(HrmsPayrollBatch $batch): JsonResponse
    {
        if ($batch->status !== 'locked') {
            return response()->json(['message' => 'Batch must be locked before payment.'], 422);
        }

        DB::beginTransaction();
        try {
            $batch->update(['status' => 'paid']);
            Payslip::where('batch_id', $batch->id)->update([
                'status' => 'paid',
                'paid_at' => now()
            ]);

            // Update EMIs to Paid
            $payslips = Payslip::where('batch_id', $batch->id)->get();
            foreach ($payslips as $ps) {
                EmiSchedule::whereHas('loan', function($q) use ($ps) {
                        $q->where('user_id', $ps->user_id);
                    })
                    ->where('month', $batch->month)
                    ->where('year', $batch->year)
                    ->update(['status' => 'Paid', 'payment_date' => now()]);

                // Update linked expenses and overtime to paid status
                \App\Models\Expense::where('payslip_id', $ps->id)->update(['status' => 'paid']);
                \App\Models\Overtime::where('payslip_id', $ps->id)->update(['status' => 'paid']);
                
                // Also update loan outstanding balances? (Ideally logic in Loan model/service)
            }

            DB::commit();
            return response()->json(['data' => $batch]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error finalizing payment: ' . $e->getMessage()], 500);
        }
    }

    public function assignSalary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'salary_structure_id' => 'required|exists:salary_structures,id',
            'base_amount' => 'required|numeric',
            'effective_date' => 'required|date',
            'payment_method' => 'string',
        ]);

        $salary = EmployeeSalary::updateOrCreate(
            ['user_id' => $validated['user_id']],
            array_merge($validated, ['status' => 'Active'])
        );

        return response()->json(['data' => $salary]);
    }

    public function getEmployeeSalary($userId): JsonResponse
    {
        $salary = EmployeeSalary::with('structure.components')->where('user_id', $userId)->first();
        return response()->json(['data' => $salary]);
    }

    public function listPayslips(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Payslip::with(['user', 'batch']);

        if ($user->role !== 'Admin' && $user->role !== 'HR') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $perPage = $request->per_page ?? 50;
        $payslips = $query->latest()->paginate($perPage);
        return response()->json([
            'data' => $payslips->items(),
            'pagination' => [
                'current_page' => $payslips->currentPage(),
                'per_page' => $payslips->perPage(),
                'total' => $payslips->total(),
                'last_page' => $payslips->lastPage(),
            ],
        ]);
    }
}
