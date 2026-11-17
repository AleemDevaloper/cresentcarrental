<?php

namespace App\Jobs;

use App\Models\EmployeeSalary;
use App\Models\HrmsPayrollBatch;
use App\Models\Payslip;
use App\Models\Attendance;
use App\Models\Loan;
use App\Models\EmiSchedule;
use App\Models\Expense;
use App\Models\Overtime;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessPayrollBatch implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        protected HrmsPayrollBatch $batch
    ) {}

    public function handle(): void
    {
        if ($this->batch->status !== 'draft') {
            return;
        }

        DB::beginTransaction();
        try {
            $this->batch->update(['status' => 'processing']);

            $payslipIds = Payslip::where('batch_id', $this->batch->id)->pluck('id');
            if ($payslipIds->isNotEmpty()) {
                Expense::whereIn('payslip_id', $payslipIds)->update(['payslip_id' => null]);
                Overtime::whereIn('payslip_id', $payslipIds)->update(['payslip_id' => null]);
                Payslip::whereIn('id', $payslipIds)->forceDelete();
            }

            $employeeSalaries = EmployeeSalary::with('structure.components')
                ->where('status', 'Active')
                ->get();

            $totalGross = 0;
            $totalDeduction = 0;
            $totalNet = 0;
            $count = 0;

            foreach ($employeeSalaries as $empSal) {
                $payslip = $this->calculateEmployeePayslip($empSal);
                if ($payslip) {
                    $totalGross += $payslip->gross_earning;
                    $totalDeduction += $payslip->total_deduction;
                    $totalNet += $payslip->net_salary;
                    $count++;
                }
            }

            $this->batch->update([
                'status' => 'verified',
                'total_gross' => $totalGross,
                'total_deduction' => $totalDeduction,
                'total_net' => $totalNet,
                'employee_count' => $count,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->batch->update(['status' => 'draft']);
            \Illuminate\Support\Facades\Log::error('Payroll batch processing failed', [
                'batch_id' => $this->batch->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function calculateEmployeePayslip(EmployeeSalary $empSal): ?Payslip
    {
        $userId = $empSal->user_id;
        $month = $this->batch->month;
        $year = $this->batch->year;
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $presentDays = Attendance::where('user_id', $userId)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->whereIn('status', ['Present', 'Late', 'Half Day'])
            ->count();

        $absentDays = Attendance::where('user_id', $userId)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->where('status', 'Absent')
            ->count();

        $workingDays = $daysInMonth;
        $attendanceRatio = $workingDays > 0 ? ($presentDays / $workingDays) : 0;

        $grossEarning = 0;
        $totalDeduction = 0;
        $earningsBreakdown = [];
        $deductionsBreakdown = [];

        if ($empSal->structure && $empSal->structure->components) {
            foreach ($empSal->structure->components as $component) {
                $value = 0;
                if ($component->calculation_type === 'percentage' && $component->percentage_of) {
                    $baseComponent = $empSal->structure->components->firstWhere('id', $component->percentage_of);
                    $baseValue = $baseComponent ? ($baseComponent->is_fixed ? $baseComponent->value : $baseComponent->value * $attendanceRatio) : 0;
                    $value = $baseValue * ($component->value / 100);
                } elseif ($component->is_fixed) {
                    $value = $component->value;
                } else {
                    $value = $component->value;
                }

                if ($component->type === 'earning') {
                    $grossEarning += $value;
                    $earningsBreakdown[] = ['name' => $component->name, 'amount' => round($value, 2)];
                } else {
                    $totalDeduction += $value;
                    $deductionsBreakdown[] = ['name' => $component->name, 'amount' => round($value, 2)];
                }
            }
        }

        $loanEmi = EmiSchedule::whereHas('loan', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'pending')
            ->where('due_date', '<=', now()->endOfMonth())
            ->sum('emi_amount');

        if ($loanEmi > 0) {
            $totalDeduction += $loanEmi;
            $deductionsBreakdown[] = ['name' => 'Loan EMI', 'amount' => round($loanEmi, 2)];
        }

        $netSalary = $grossEarning - $totalDeduction;
        if ($netSalary < 0) $netSalary = 0;

        return Payslip::create([
            'user_id' => $userId,
            'batch_id' => $this->batch->id,
            'month' => $month,
            'year' => $year,
            'base_salary' => $empSal->base_amount ?? 0,
            'gross_earning' => round($grossEarning, 2),
            'total_deduction' => round($totalDeduction, 2),
            'net_salary' => round($netSalary, 2),
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'working_days' => $workingDays,
            'earnings_breakdown' => $earningsBreakdown,
            'deductions_breakdown' => $deductionsBreakdown,
            'status' => 'generated',
        ]);
    }
}
