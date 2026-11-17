<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AttendanceCorrectionController;
use App\Http\Controllers\Api\AttendanceRuleController;
use App\Http\Controllers\Api\BankDetailController;
use App\Http\Controllers\Api\BiometricController;
use App\Http\Controllers\Api\CommandCenterController;
use App\Http\Controllers\Api\CsvImportController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\EmergencyContactController;
use App\Http\Controllers\Api\EmployeeCodeController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ExitManagementController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\HrDashboardController;
use App\Http\Controllers\Api\HrHealthController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\OutdoorDutyController;
use App\Http\Controllers\Api\OvertimeController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\PerformanceController;
use App\Http\Controllers\Api\PortalController;
use App\Http\Controllers\Api\RecruitmentController;
use App\Http\Controllers\Api\RehireController;
use App\Http\Controllers\Api\ReportingHierarchyController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;

Route::get('/hrms/employees', [EmployeeController::class, 'index']);
Route::post('/hrms/employees', [EmployeeController::class, 'store']);
Route::post('/hrms/employees/bulk-import', [EmployeeController::class, 'bulkImport']);
Route::get('/hrms/employees/export', [EmployeeController::class, 'export']);
Route::get('/hrms/employees/{id}', [EmployeeController::class, 'show']);
Route::patch('/hrms/employees/{id}', [EmployeeController::class, 'update']);
Route::delete('/hrms/employees/{id}', [EmployeeController::class, 'destroy']);
Route::post('/hrms/employees/{id}/archive', [EmployeeController::class, 'archive']);
Route::post('/hrms/employees/{id}/reactivate', [EmployeeController::class, 'reactivate']);

Route::get('/hrms/outdoor-duty', [OutdoorDutyController::class, 'index']);
Route::post('/hrms/outdoor-duty', [OutdoorDutyController::class, 'store']);
Route::patch('/hrms/outdoor-duty/{id}', [OutdoorDutyController::class, 'update']);
Route::delete('/hrms/outdoor-duty/{id}', [OutdoorDutyController::class, 'destroy']);

Route::apiResource('departments', DepartmentController::class);
Route::post('/departments/{department}/designations', [DepartmentController::class, 'storeDesignation']);
Route::put('/designations/{designation}', [DepartmentController::class, 'updateDesignation']);
Route::delete('/designations/{designation}', [DepartmentController::class, 'destroyDesignation']);

Route::get('/recruitment/stats', [RecruitmentController::class, 'stats']);
Route::get('/recruitment/jobs', [RecruitmentController::class, 'listJobs']);
Route::post('/recruitment/jobs', [RecruitmentController::class, 'storeJob']);
Route::patch('/recruitment/jobs/{job}', [RecruitmentController::class, 'updateJob']);
Route::delete('/recruitment/jobs/{job}', [RecruitmentController::class, 'deleteJob']);
Route::get('/recruitment/applications', [RecruitmentController::class, 'listApplications']);
Route::post('/recruitment/applications', [RecruitmentController::class, 'storeApplication']);
Route::patch('/recruitment/applications/{application}/status', [RecruitmentController::class, 'updateApplicationStatus']);
Route::get('/recruitment/interviews', [RecruitmentController::class, 'listInterviews']);
Route::post('/recruitment/interviews', [RecruitmentController::class, 'storeInterview']);
Route::patch('/recruitment/interviews/{interview}', [RecruitmentController::class, 'updateInterview']);

Route::get('/exit/stats', [ExitManagementController::class, 'stats']);
Route::get('/exit/resignations', [ExitManagementController::class, 'listResignations']);
Route::post('/exit/resignations', [ExitManagementController::class, 'storeResignation']);
Route::patch('/exit/resignations/{resignation}/status', [ExitManagementController::class, 'updateResignationStatus']);
Route::patch('/exit/clearance-stages/{stage}', [ExitManagementController::class, 'updateClearanceStage']);
Route::get('/exit/clearances', [ExitManagementController::class, 'listClearances']);
Route::post('/exit/clearances', [ExitManagementController::class, 'storeClearance']);
Route::patch('/exit/clearances/{clearance}', [ExitManagementController::class, 'updateClearance']);

Route::get('/onboarding/checklists', [OnboardingController::class, 'listChecklists']);
Route::post('/onboarding/checklists', [OnboardingController::class, 'storeChecklist']);
Route::get('/onboarding/processes', [OnboardingController::class, 'listOnboardings']);
Route::post('/onboarding/processes', [OnboardingController::class, 'storeOnboarding']);
Route::patch('/onboarding/processes/{onboarding}/progress', [OnboardingController::class, 'updateProgress']);

Route::get('/payroll/components', [PayrollController::class, 'listComponents']);
Route::post('/payroll/components', [PayrollController::class, 'storeComponent']);
Route::get('/payroll/structures', [PayrollController::class, 'listStructures']);
Route::post('/payroll/structures', [PayrollController::class, 'storeStructure']);
Route::get('/payroll/tax-slabs', [PayrollController::class, 'listTaxSlabs']);
Route::post('/payroll/tax-slabs', [PayrollController::class, 'storeTaxSlab']);
Route::get('/payroll/batches', [PayrollController::class, 'listBatches']);
Route::post('/payroll/batches', [PayrollController::class, 'createBatch']);
Route::post('/payroll/batches/{batch}/run', [PayrollController::class, 'runBatch']);
Route::post('/payroll/batches/{batch}/finalize', [PayrollController::class, 'finalizeBatch']);
Route::post('/payroll/batches/{batch}/pay', [PayrollController::class, 'payBatch']);
Route::get('/payroll/employee/{userId}', [PayrollController::class, 'getEmployeeSalary']);
Route::post('/payroll/assign', [PayrollController::class, 'assignSalary']);
Route::get('/payroll/payslips', [PayrollController::class, 'listPayslips']);

Route::get('/performance/stats', [PerformanceController::class, 'stats']);
Route::get('/performance/kpis', [PerformanceController::class, 'listKpis']);
Route::post('/performance/kpis', [PerformanceController::class, 'storeKpi']);
Route::get('/performance/goals', [PerformanceController::class, 'listGoals']);
Route::post('/performance/goals', [PerformanceController::class, 'storeGoal']);
Route::patch('/performance/goals/{goal}/progress', [PerformanceController::class, 'updateGoalProgress']);
Route::get('/performance/reviews', [PerformanceController::class, 'listReviews']);
Route::post('/performance/reviews', [PerformanceController::class, 'storeReview']);
Route::patch('/performance/reviews/{review}/status', [PerformanceController::class, 'updateReviewStatus']);

Route::get('/expenses', [ExpenseController::class, 'index']);
Route::post('/expenses', [ExpenseController::class, 'store']);
Route::patch('/expenses/{expense}/status', [ExpenseController::class, 'updateStatus']);
Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy']);

Route::get('/overtime', [OvertimeController::class, 'index']);
Route::post('/overtime', [OvertimeController::class, 'store']);
Route::post('/overtime/auto-detect', [OvertimeController::class, 'autoDetect']);
Route::patch('/overtime/{overtime}/status', [OvertimeController::class, 'updateStatus']);
Route::delete('/overtime/{overtime}', [OvertimeController::class, 'destroy']);

Route::get('/attendance', [AttendanceController::class, 'index']);
Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);

Route::get('/biometric/devices', [BiometricController::class, 'listDevices']);
Route::post('/biometric/devices', [BiometricController::class, 'storeDevice']);
Route::patch('/biometric/devices/{device}', [BiometricController::class, 'updateDevice']);
Route::post('/biometric/devices/{device}/sync', [BiometricController::class, 'syncDevice']);
Route::get('/biometric/punch-logs', [BiometricController::class, 'listPunchLogs']);
Route::post('/biometric/punch-logs/import', [BiometricController::class, 'importPunches']);
Route::get('/biometric/punch-logs/stats', [BiometricController::class, 'getPunchStats']);
Route::get('/biometric/mappings', [BiometricController::class, 'listMappings']);
Route::patch('/biometric/mappings/{user}', [BiometricController::class, 'updateMapping']);

Route::apiResource('shifts', ShiftController::class);
Route::apiResource('sites', SiteController::class);

Route::get('/leaves', [LeaveController::class, 'index']);
Route::post('/leaves', [LeaveController::class, 'store']);
Route::patch('/leaves/{leave}/status', [LeaveController::class, 'updateStatus']);
Route::delete('/leaves/{leave}', [LeaveController::class, 'destroy']);

Route::get('/hr/dashboard/home', [HrDashboardController::class, 'home']);
Route::get('/hr/dashboard', [HrDashboardController::class, 'home']);
Route::get('/hr/workforce-summary', [HrDashboardController::class, 'workforceSummary']);
Route::get('/hr/attendance-summary', [HrDashboardController::class, 'attendanceSummary']);
Route::get('/hr/live-attendance', [HrDashboardController::class, 'liveAttendance']);
Route::get('/hr/dashboard/widgets', [HrDashboardController::class, 'widgets']);
Route::post('/hr/dashboard/layout', [HrDashboardController::class, 'saveLayout']);
Route::post('/hr/dashboard/preferences', [HrDashboardController::class, 'savePreferences']);
Route::get('/hr/dashboard/analytics', [HrDashboardController::class, 'analytics']);
Route::get('/hr/dashboard/departments', [HrDashboardController::class, 'departments']);
Route::get('/hr/dashboard/calendar', [HrDashboardController::class, 'calendar']);
Route::get('/hr/dashboard/compliance', [HrDashboardController::class, 'compliance']);
Route::get('/hr/dashboard/celebrations', [HrDashboardController::class, 'celebrations']);

Route::get('/hr/health/dashboard', [HrHealthController::class, 'dashboard']);
Route::get('/hr/health/score', [HrHealthController::class, 'score']);
Route::get('/hr/health/attendance', [HrHealthController::class, 'attendanceHealth']);
Route::get('/hr/health/payroll', [HrHealthController::class, 'payrollHealth']);
Route::get('/hr/health/profile', [HrHealthController::class, 'profileHealth']);
Route::get('/hr/health/compliance', [HrHealthController::class, 'complianceHealth']);
Route::get('/hr/health/recruitment', [HrHealthController::class, 'recruitmentHealth']);
Route::get('/hr/health/onboarding', [HrHealthController::class, 'onboardingHealth']);
Route::get('/hr/health/offboarding', [HrHealthController::class, 'offboardingHealth']);
Route::get('/hr/health/risks', [HrHealthController::class, 'riskAnalysis']);
Route::get('/hr/health/recommendations', [HrHealthController::class, 'recommendations']);

Route::get('/hrms/command-center/stats', [CommandCenterController::class, 'stats']);
Route::get('/hrms/command-center/trends/headcount', [CommandCenterController::class, 'trends']);
Route::get('/hrms/command-center/trends/attendance', [CommandCenterController::class, 'trends']);
Route::get('/hrms/command-center/trends/leaves', [CommandCenterController::class, 'trends']);
Route::get('/hrms/command-center/departments', [CommandCenterController::class, 'departmentOverview']);

Route::get('/hrms/attendance-corrections', [AttendanceCorrectionController::class, 'index']);
Route::post('/hrms/attendance-corrections', [AttendanceCorrectionController::class, 'store']);
Route::patch('/hrms/attendance-corrections/{id}/status', [AttendanceCorrectionController::class, 'updateStatus']);
Route::delete('/hrms/attendance-corrections/{id}', [AttendanceCorrectionController::class, 'destroy']);

Route::get('/hrms/documents', [DocumentController::class, 'index']);
Route::post('/hrms/documents', [DocumentController::class, 'store']);
Route::get('/hrms/documents/{id}', [DocumentController::class, 'show']);
Route::patch('/hrms/documents/{id}', [DocumentController::class, 'update']);
Route::delete('/hrms/documents/{id}', [DocumentController::class, 'destroy']);
Route::post('/hrms/documents/{id}/verify', [DocumentController::class, 'verify']);
Route::post('/hrms/documents/{id}/lock', [DocumentController::class, 'lock']);
Route::post('/hrms/documents/{id}/share', [DocumentController::class, 'share']);
Route::get('/hrms/documents/{id}/download', [DocumentController::class, 'download']);
Route::post('/hrms/documents/bulk-upload', [DocumentController::class, 'bulkUpload']);
Route::get('/hrms/documents/{id}/history', [DocumentController::class, 'history']);

Route::get('/hrms/bank-details', [BankDetailController::class, 'index']);
Route::post('/hrms/bank-details', [BankDetailController::class, 'store']);
Route::patch('/hrms/bank-details/{id}', [BankDetailController::class, 'update']);
Route::delete('/hrms/bank-details/{id}', [BankDetailController::class, 'destroy']);
Route::post('/hrms/bank-details/{id}/set-primary', [BankDetailController::class, 'setPrimary']);
Route::post('/hrms/bank-details/{id}/verify', [BankDetailController::class, 'verify']);
Route::get('/hrms/bank-details/history', [BankDetailController::class, 'history']);

Route::get('/hrms/emergency-contacts', [EmergencyContactController::class, 'index']);
Route::post('/hrms/emergency-contacts', [EmergencyContactController::class, 'store']);
Route::patch('/hrms/emergency-contacts/{id}', [EmergencyContactController::class, 'update']);
Route::delete('/hrms/emergency-contacts/{id}', [EmergencyContactController::class, 'destroy']);
Route::post('/hrms/emergency-contacts/{id}/priority', [EmergencyContactController::class, 'setPriority']);

Route::get('/hrms/reporting-hierarchy', [ReportingHierarchyController::class, 'index']);
Route::post('/hrms/reporting-hierarchy', [ReportingHierarchyController::class, 'store']);
Route::get('/hrms/reporting-hierarchy/{employee}', [ReportingHierarchyController::class, 'show']);
Route::get('/hrms/reporting-hierarchy/org-chart', [ReportingHierarchyController::class, 'orgChart']);
Route::get('/hrms/reporting-hierarchy/department/{department}', [ReportingHierarchyController::class, 'departmentHierarchy']);
Route::get('/hrms/reporting-hierarchy/successors/{employee}', [ReportingHierarchyController::class, 'successors']);

Route::post('/hrms/shifts/assign', [ShiftController::class, 'assignShift']);
Route::post('/hrms/shifts/bulk-assign', [ShiftController::class, 'bulkAssign']);
Route::get('/hrms/shifts/calendar', [ShiftController::class, 'calendar']);
Route::get('/hrms/shifts/coverage', [ShiftController::class, 'coverage']);
Route::get('/hrms/shifts/rotations', [ShiftController::class, 'rotations']);
Route::post('/hrms/shifts/rotations', [ShiftController::class, 'storeRotation']);
Route::get('/hrms/shifts/grace-times', [ShiftController::class, 'graceTimes']);
Route::post('/hrms/shifts/grace-times', [ShiftController::class, 'updateGraceTime']);
Route::get('/hrms/shifts/break-times', [ShiftController::class, 'breakTimes']);
Route::post('/hrms/shifts/break-times', [ShiftController::class, 'storeBreakTime']);
Route::get('/hrms/shifts/weekly-offs', [ShiftController::class, 'weeklyOffs']);
Route::post('/hrms/shifts/weekly-offs', [ShiftController::class, 'storeWeeklyOff']);

Route::post('/hrms/sites/assign', [SiteController::class, 'assignSite']);
Route::get('/hrms/sites/assignments', [SiteController::class, 'assignments']);
Route::get('/hrms/sites/{site}/geo-fences', [SiteController::class, 'geoFences']);
Route::post('/hrms/sites/geo-fences', [SiteController::class, 'storeGeoFence']);
Route::patch('/hrms/sites/geo-fences/{id}', [SiteController::class, 'updateGeoFence']);
Route::delete('/hrms/sites/geo-fences/{id}', [SiteController::class, 'deleteGeoFence']);
Route::post('/hrms/sites/{site}/qr-code', [SiteController::class, 'qrCode']);
Route::post('/hrms/sites/validate-qr', [SiteController::class, 'validateQR']);
Route::get('/hrms/sites/nearby', [SiteController::class, 'nearby']);
Route::get('/hrms/sites/stats', [SiteController::class, 'stats']);

Route::post('/hrms/attendance/qr-clock-in', [AttendanceController::class, 'qrClockIn']);
Route::post('/hrms/attendance/supervisor-clock-in', [AttendanceController::class, 'supervisorClockIn']);
Route::post('/hrms/attendance/gps-validate', [AttendanceController::class, 'gpsValidate']);
Route::get('/hrms/attendance/photo-history', [AttendanceController::class, 'photoHistory']);
Route::get('/hrms/attendance/red-zone', [AttendanceController::class, 'redZone']);
Route::get('/hrms/attendance/daily-report', [AttendanceController::class, 'dailyReport']);
Route::get('/hrms/attendance/monthly-report', [AttendanceController::class, 'monthlyReport']);
Route::get('/hrms/attendance/corrections', [AttendanceController::class, 'corrections']);
Route::post('/hrms/attendance/bulk', [AttendanceController::class, 'bulkAttendance']);
Route::get('/hrms/attendance/check-status', [AttendanceController::class, 'checkStatus']);

Route::get('/hrms/leaves/quotas', [LeaveController::class, 'quotas']);
Route::post('/hrms/leaves/quotas', [LeaveController::class, 'storeQuota']);
Route::post('/hrms/leaves/quotas/bulk-allocate', [LeaveController::class, 'bulkAllocateQuota']);
Route::get('/hrms/leaves/accrual-rules', [LeaveController::class, 'accrualRules']);
Route::post('/hrms/leaves/accrual-rules', [LeaveController::class, 'storeAccrualRule']);
Route::post('/hrms/leaves/run-accrual', [LeaveController::class, 'runAccrual']);
Route::get('/hrms/leaves/balances', [LeaveController::class, 'balances']);
Route::get('/hrms/leaves/calendar', [LeaveController::class, 'calendar']);
Route::get('/hrms/leaves/analytics', [LeaveController::class, 'analytics']);
Route::get('/hrms/leaves/types', [LeaveController::class, 'types']);

Route::get('/hrms/attendance-rules/overtime', [AttendanceRuleController::class, 'overtimeRules']);
Route::post('/hrms/attendance-rules/overtime', [AttendanceRuleController::class, 'storeOvertimeRule']);
Route::patch('/hrms/attendance-rules/overtime/{id}', [AttendanceRuleController::class, 'updateOvertimeRule']);
Route::delete('/hrms/attendance-rules/overtime/{id}', [AttendanceRuleController::class, 'deleteOvertimeRule']);
Route::get('/hrms/attendance-rules/grace-times', [AttendanceRuleController::class, 'graceTimes']);
Route::post('/hrms/attendance-rules/grace-times', [AttendanceRuleController::class, 'storeGraceTime']);
Route::get('/hrms/attendance-rules/half-day', [AttendanceRuleController::class, 'halfDayRules']);
Route::post('/hrms/attendance-rules/half-day', [AttendanceRuleController::class, 'storeHalfDayRule']);

Route::get('/hrms/csv-imports', [CsvImportController::class, 'index']);
Route::post('/hrms/csv-imports/preview', [CsvImportController::class, 'preview']);
Route::post('/hrms/csv-imports/import', [CsvImportController::class, 'import']);
Route::get('/hrms/csv-imports/mapping', [CsvImportController::class, 'mapping']);
Route::post('/hrms/csv-imports/validate', [CsvImportController::class, 'validateImport']);
Route::post('/hrms/csv-imports/rollback', [CsvImportController::class, 'rollback']);
Route::get('/hrms/csv-imports/template/{type}', [CsvImportController::class, 'template']);
Route::get('/hrms/csv-imports/logs', [CsvImportController::class, 'logs']);

Route::get('/hrms/employee-code/config', [EmployeeCodeController::class, 'config']);
Route::put('/hrms/employee-code/config', [EmployeeCodeController::class, 'config']);
Route::post('/hrms/employee-code/generate', [EmployeeCodeController::class, 'generate']);
Route::post('/hrms/employee-code/validate', [EmployeeCodeController::class, 'validateCode']);
Route::post('/hrms/employee-code/{user}/lock', [EmployeeCodeController::class, 'lock']);
Route::get('/hrms/employee-code/history', [EmployeeCodeController::class, 'history']);

Route::get('/hrms/portals', [PortalController::class, 'index']);
Route::post('/hrms/portals', [PortalController::class, 'store']);
Route::get('/hrms/portals/{id}', [PortalController::class, 'show']);
Route::put('/hrms/portals/{id}', [PortalController::class, 'update']);
Route::delete('/hrms/portals/{id}', [PortalController::class, 'destroy']);
Route::post('/hrms/portals/{id}/branding', [PortalController::class, 'branding']);

Route::get('/bank-exports', [\App\Http\Controllers\Api\BankExportController::class, 'index']);
Route::post('/bank-exports', [\App\Http\Controllers\Api\BankExportController::class, 'store']);
Route::get('/bank-exports/banks', [\App\Http\Controllers\Api\BankExportController::class, 'banks']);
Route::get('/bank-exports/stats', [\App\Http\Controllers\Api\BankExportController::class, 'stats']);
Route::get('/bank-exports/{bank_export}', [\App\Http\Controllers\Api\BankExportController::class, 'show']);
Route::get('/bank-exports/{bank_export}/download', [\App\Http\Controllers\Api\BankExportController::class, 'download']);
Route::post('/bank-exports/{bank_export}/retry', [\App\Http\Controllers\Api\BankExportController::class, 'retry']);
