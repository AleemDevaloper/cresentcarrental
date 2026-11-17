<?php

use App\Http\Controllers\Api\EMS\AcademicYearController;
use App\Http\Controllers\Api\EMS\AdmissionController;
use App\Http\Controllers\Api\EMS\AlumniController;
use App\Http\Controllers\Api\EMS\AppointmentController;
use App\Http\Controllers\Api\EMS\AssignmentController;
use App\Http\Controllers\Api\EMS\AttendanceController;
use App\Http\Controllers\Api\EMS\BookController;
use App\Http\Controllers\Api\EMS\BookingController;
use App\Http\Controllers\Api\EMS\BuildingController;
use App\Http\Controllers\Api\EMS\CampusController;
use App\Http\Controllers\Api\EMS\CertificateController;
use App\Http\Controllers\Api\EMS\CommunicationController;
use App\Http\Controllers\Api\EMS\CourseController;
use App\Http\Controllers\Api\EMS\DepartmentController;
use App\Http\Controllers\Api\EMS\DriverController;
use App\Http\Controllers\Api\EMS\EmsDashboardController;
use App\Http\Controllers\Api\EMS\EmployeeController;
use App\Http\Controllers\Api\EMS\EventController;
use App\Http\Controllers\Api\EMS\ExaminationController;
use App\Http\Controllers\Api\EMS\FacilityController;
use App\Http\Controllers\Api\EMS\FeeController;
use App\Http\Controllers\Api\EMS\GradeController;
use App\Http\Controllers\Api\EMS\GrantController;
use App\Http\Controllers\Api\EMS\HostelController;
use App\Http\Controllers\Api\EMS\ImportExportController;
use App\Http\Controllers\Api\EMS\IncidentController;
use App\Http\Controllers\Api\EMS\InstitutionController;
use App\Http\Controllers\Api\EMS\LmsCourseController;
use App\Http\Controllers\Api\EMS\MaintenanceController;
use App\Http\Controllers\Api\EMS\MedicineController;
use App\Http\Controllers\Api\EMS\ParentController;
use App\Http\Controllers\Api\EMS\PatentController;
use App\Http\Controllers\Api\EMS\PatientController;
use App\Http\Controllers\Api\EMS\ProgramController;
use App\Http\Controllers\Api\EMS\PublicationController;
use App\Http\Controllers\Api\EMS\ResearchProjectController;
use App\Http\Controllers\Api\EMS\RoomController;
use App\Http\Controllers\Api\EMS\SchoolClassController;
use App\Http\Controllers\Api\EMS\SemesterController;
use App\Http\Controllers\Api\EMS\StudentController;
use App\Http\Controllers\Api\EMS\SubjectController;
use App\Http\Controllers\Api\EMS\TeacherController;
use App\Http\Controllers\Api\EMS\TimetableController;
use App\Http\Controllers\Api\EMS\TransportRouteController;
use App\Http\Controllers\Api\EMS\VehicleController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('/ems/dashboard', [EmsDashboardController::class, 'index']);
Route::get('/ems/analytics', [EmsDashboardController::class, 'analytics']);
Route::get('/ems/ai-insights', [EmsDashboardController::class, 'aiInsights']);
Route::get('/ems/reports', [EmsDashboardController::class, 'reports']);
Route::get('/ems/settings', [EmsDashboardController::class, 'getSettings']);
Route::put('/ems/settings', [EmsDashboardController::class, 'updateSettings']);

// Institutions
Route::apiResource('/ems/institutions', InstitutionController::class);
Route::apiResource('/ems/campuses', CampusController::class);
Route::apiResource('/ems/departments', DepartmentController::class);
Route::apiResource('/ems/programs', ProgramController::class);
Route::apiResource('/ems/academic-years', AcademicYearController::class);
Route::apiResource('/ems/semesters', SemesterController::class);
Route::apiResource('/ems/buildings', BuildingController::class);
Route::apiResource('/ems/rooms', RoomController::class);

// Students
Route::apiResource('/ems/students', StudentController::class);
Route::get('/ems/students/{id}/profile', [StudentController::class, 'profile']);

// Admissions
Route::apiResource('/ems/admissions', AdmissionController::class);
Route::get('/ems/admission-dashboard', [EmsDashboardController::class, 'admissions']);

// Staff
Route::apiResource('/ems/teachers', TeacherController::class);
Route::apiResource('/ems/employees', EmployeeController::class);

// Academics
Route::apiResource('/ems/classes', SchoolClassController::class);
Route::apiResource('/ems/subjects', SubjectController::class);
Route::apiResource('/ems/courses', CourseController::class);

// Attendance
Route::apiResource('/ems/attendance', AttendanceController::class);

// Timetable
Route::apiResource('/ems/timetables', TimetableController::class);

// Assignments
Route::apiResource('/ems/assignments', AssignmentController::class);

// Examinations
Route::apiResource('/ems/examinations', ExaminationController::class);
Route::apiResource('/ems/grades', GradeController::class);
Route::apiResource('/ems/certificates', CertificateController::class);
Route::post('/ems/certificates/generate', [CertificateController::class, 'generate']);

// LMS
Route::prefix('/ems/lms')->group(function () {
    Route::apiResource('courses', LmsCourseController::class);
});

// Library
Route::prefix('/ems/library')->group(function () {
    Route::apiResource('books', BookController::class);
    Route::post('issue', [BookController::class, 'issue']);
    Route::post('return', [BookController::class, 'returnBook']);
});

// Transport
Route::prefix('/ems/transport')->group(function () {
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('drivers', DriverController::class);
    Route::apiResource('routes', TransportRouteController::class);
});

// Hostel
Route::apiResource('/ems/hostels', HostelController::class);
Route::post('/ems/hostel/allocate', [HostelController::class, 'allocate']);

// Medical
Route::prefix('/ems/medical')->group(function () {
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('medicines', MedicineController::class);
});

// Alumni
Route::apiResource('/ems/alumni', AlumniController::class);

// Research
Route::prefix('/ems/research')->group(function () {
    Route::apiResource('projects', ResearchProjectController::class);
    Route::apiResource('publications', PublicationController::class);
    Route::apiResource('patents', PatentController::class);
    Route::apiResource('grants', GrantController::class);
});

// Campus
Route::prefix('/ems/campus')->group(function () {
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('bookings', BookingController::class);
    Route::apiResource('maintenance', MaintenanceController::class);
});

// Security
Route::prefix('/ems/security')->group(function () {
    Route::apiResource('incidents', IncidentController::class);
});

// Fees
Route::apiResource('/ems/fees', FeeController::class);

// Parents
Route::apiResource('/ems/parents', ParentController::class);

// Events
Route::apiResource('/ems/events', EventController::class);

// Communication
Route::post('/ems/communication/send', [CommunicationController::class, 'send']);

// Import/Export
Route::post('/ems/import', [ImportExportController::class, 'import']);
Route::get('/ems/export/{type}', [ImportExportController::class, 'export']);
