<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Leave;
use App\Models\Department;
use App\Models\ApprovalRequest;
use App\Models\Expense;
use App\Support\SqlHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandCenterController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $today = now()->toDateString();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $totalEmployees = User::where('status', 'Active')->count();

        $presentToday = Attendance::where('date', $today)
            ->whereNotNull('clock_in')
            ->count();

        $onLeaveToday = Leave::where('status', 'approved')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->count();

        $absentToday = $totalEmployees - $presentToday - $onLeaveToday;

        $lateToday = Attendance::where('date', $today)
            ->whereNotNull('clock_in')
            ->where('status', 'late')
            ->count();

        $newHires = User::where('status', 'Active')
            ->whereMonth('joining_date', $currentMonth)
            ->whereYear('joining_date', $currentYear)
            ->count();

        $upcomingConfirmations = User::where('status', 'Active')
            ->whereNotNull('probation_end_date')
            ->whereDate('probation_end_date', '>=', $today)
            ->whereDate('probation_end_date', '<=', now()->addDays(30)->toDateString())
            ->count();

        $birthdaysThisMonth = User::where('status', 'Active')
            ->whereMonth('dob', $currentMonth)
            ->count();

        $anniversariesThisMonth = User::where('status', 'Active')
            ->whereMonth('joining_date', $currentMonth)
            ->whereYear('joining_date', '<', $currentYear)
            ->count();

        $pendingApprovals = ApprovalRequest::where('status', 'pending')->count();

        $payrollStats = (object)[
            'total_payroll' => DB::table('employee_salaries')->sum('base_amount') ?? 0,
            'pending_payrolls' => DB::table('hrms_payroll_batches')
                ->where('status', 'pending')
                ->count(),
        ];

        return response()->json(['data' => [
            'total_employees' => $totalEmployees,
            'present_today' => $presentToday,
            'absent_today' => max(0, $absentToday),
            'late_today' => $lateToday,
            'on_leave_today' => $onLeaveToday,
            'new_hires' => $newHires,
            'upcoming_confirmations' => $upcomingConfirmations,
            'birthdays_this_month' => $birthdaysThisMonth,
            'anniversaries_this_month' => $anniversariesThisMonth,
            'pending_approvals' => $pendingApprovals,
            'payroll' => $payrollStats,
        ]]);
    }

    public function trends(Request $request): JsonResponse
    {
        $months = $request->get('months', 6);

        $headcountTrend = User::where('status', 'Active')
            ->select(DB::raw(SqlHelper::monthGroup('created_at') . ' as month'), DB::raw('COUNT(*) as count'))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit($months)
            ->get();

        $attendanceTrend = Attendance::select(
                DB::raw(SqlHelper::monthGroup('date') . ' as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late"),
                DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent")
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit($months)
            ->get();

        $leaveTrend = Leave::where('status', 'approved')
            ->select(
                DB::raw(SqlHelper::monthGroup('start_date') . ' as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(' . SqlHelper::dateDiffDays('end_date', 'start_date') . ') as days')
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit($months)
            ->get();

        return response()->json(['data' => [
            'headcount' => $headcountTrend,
            'attendance' => $attendanceTrend,
            'leaves' => $leaveTrend,
        ]]);
    }

    public function departmentOverview(): JsonResponse
    {
        $departments = Department::select('departments.*')
            ->selectSub(function ($query) {
                $query->from('users')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('users.department_id', 'departments.id')
                    ->where('users.status', 'Active');
            }, 'employee_count')
            ->get();

        return response()->json(['data' => $departments]);
    }
}
