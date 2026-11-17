<?php

namespace App\Http\Controllers\Api\EMS;

use App\Http\Controllers\Controller;
use App\Models\EMS\Admission;
use App\Models\EMS\Attendance;
use App\Models\EMS\Campus;
use App\Models\EMS\Department;
use App\Models\EMS\Employee;
use App\Models\EMS\Event;
use App\Models\EMS\Fee;
use App\Models\EMS\Grade;
use App\Models\EMS\Institution;
use App\Models\EMS\Program;
use App\Models\EMS\Student;
use App\Models\EMS\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmsDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $attendanceToday = [
            'present' => Attendance::where('date', today()->toDateString())->where('status', 'present')->count(),
            'absent' => Attendance::where('date', today()->toDateString())->where('status', 'absent')->count(),
            'late' => Attendance::where('date', today()->toDateString())->where('status', 'late')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'total_institutions' => Institution::count(),
                'total_campuses' => Campus::count(),
                'total_departments' => Department::count(),
                'total_programs' => Program::count(),
                'total_students' => Student::count(),
                'active_students' => Student::where('status', 'active')->count(),
                'new_admissions' => Admission::whereBetween('application_date', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'total_teachers' => Teacher::count(),
                'active_teachers' => Teacher::where('status', 'active')->count(),
                'total_employees' => Employee::count(),
                'attendance_today' => $attendanceToday,
                'pending_fees' => (float) Fee::whereIn('status', ['pending', 'partial'])->sum('total_amount'),
                'collected_fees' => (float) Fee::where('status', 'paid')->sum('paid_amount'),
                'monthly_revenue' => (float) Fee::whereBetween('paid_date', [now()->startOfMonth(), now()->endOfMonth()])->sum('paid_amount'),
                'recent_activities' => Admission::orderByDesc('created_at')->limit(5)->get()->map(fn ($a) => [
                    'id' => $a->id,
                    'title' => 'New admission application: ' . trim(($a->first_name ?? '') . ' ' . ($a->last_name ?? '')),
                    'time' => $a->created_at?->toDateTimeString(),
                    'type' => 'admission',
                ])->all(),
                'upcoming_events' => Event::where('start_date', '>=', today())->orderBy('start_date')->limit(5)->get()->map(fn ($e) => [
                    'id' => $e->id,
                    'title' => $e->title,
                    'date' => $e->start_date?->toDateString(),
                    'type' => $e->event_type,
                ])->all(),
                'notifications' => [],
            ],
        ]);
    }

    public function analytics(Request $request): JsonResponse
    {
        $labels = [];
        $studentGrowth = [];
        $admissionTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->format('M Y');
            $studentGrowth[] = Student::whereYear('enrollment_date', $month->year)
                ->whereMonth('enrollment_date', $month->month)
                ->count();
            $admissionTrend[] = Admission::whereYear('application_date', $month->year)
                ->whereMonth('application_date', $month->month)
                ->count();
        }

        $attendanceByStatus = Attendance::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status')->all();
        $departmentPerformance = Department::withCount('programs')->get()->map(fn ($d) => [
            'name' => $d->name,
            'programs' => $d->programs_count,
        ])->all();

        $feeCollection = Fee::selectRaw("strftime('%Y-%m', paid_date) as month, sum(paid_amount) as total")
            ->whereNotNull('paid_date')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(12)
            ->get()
            ->map(fn ($row) => ['month' => $row->month, 'total' => (float) $row->total])
            ->all();

        $examPerformance = Grade::selectRaw('letter_grade, count(*) as total')
            ->whereNotNull('letter_grade')
            ->groupBy('letter_grade')
            ->get()
            ->map(fn ($row) => ['grade' => $row->letter_grade, 'count' => (int) $row->total])
            ->all();

        return response()->json([
            'success' => true,
            'data' => [
                'student_growth' => ['labels' => $labels, 'data' => $studentGrowth],
                'admission_trend' => ['labels' => $labels, 'data' => $admissionTrend],
                'attendance_analytics' => $attendanceByStatus,
                'department_performance' => $departmentPerformance,
                'fee_collection' => $feeCollection,
                'exam_performance' => $examPerformance,
            ],
        ]);
    }

    public function admissions(): JsonResponse
    {
        $counts = Admission::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $toInt = fn ($v) => (int) ($counts->get($v, 0) ?? 0);

        $enrolled = $toInt('enrolled');
        $total = (int) $counts->sum();

        $trendLabels = [];
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $trendLabels[] = $month->format('M');
            $trendData[] = Admission::whereYear('application_date', $month->year)
                ->whereMonth('application_date', $month->month)
                ->count();
        }

        $programCounts = Admission::query()
            ->whereNotNull('program_id')
            ->select('program_id')
            ->selectRaw('count(*) as total')
            ->groupBy('program_id')
            ->get()
            ->mapWithKeys(fn ($row) => [(int) $row->program_id => (int) $row->total]);

        $programNames = Program::whereIn('id', $programCounts->keys()->all())->pluck('name', 'id');

        $recent = Admission::query()->with('program:id,name')->orderByDesc('application_date')->limit(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_applications' => $total,
                'pending' => $toInt('pending') + $toInt('applied'),
                'approved' => $toInt('approved'),
                'rejected' => $toInt('rejected'),
                'waiting_list' => $toInt('waitlisted'),
                'under_review' => $toInt('under_review'),
                'enrolled' => $enrolled,
                'available_seats' => 0,
                'filled_seats' => $enrolled,
                'application_trend' => ['labels' => $trendLabels, 'data' => $trendData],
                'program_wise' => [
                    'labels' => $programCounts->keys()->map(fn ($id) => $programNames->get($id, 'N/A'))->all(),
                    'data' => $programCounts->values()->all(),
                ],
                'recent_applications' => $recent->map(fn ($a) => [
                    'id' => $a->id,
                    'name' => trim(($a->first_name ?? '') . ' ' . ($a->last_name ?? '')),
                    'program' => $a->program?->name ?? 'N/A',
                    'date' => $a->application_date?->format('Y-m-d') ?? $a->created_at->format('Y-m-d'),
                    'status' => $a->status,
                ])->all(),
            ],
        ]);
    }

    public function aiInsights(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'declining_attendance' => [],
                'academic_risk' => [],
                'high_performers' => [],
                'fee_alerts' => [],
                'teacher_workload' => [],
                'upcoming_deadlines' => [],
            ],
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'students' => Student::count(),
                'teachers' => Teacher::count(),
                'employees' => Employee::count(),
                'admissions' => Admission::count(),
                'fees_collected' => (float) Fee::sum('paid_amount'),
                'fees_pending' => (float) Fee::whereIn('status', ['pending', 'partial'])->sum('total_amount'),
            ],
        ]);
    }

    public function getSettings(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => []]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'message' => 'Settings updated']);
    }
}