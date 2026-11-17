<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HrmsJob;
use App\Models\HrmsCandidate;
use App\Models\HrmsApplication;
use App\Models\HrmsInterview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecruitmentController extends Controller
{
    // Jobs
    public function listJobs()
    {
        return response()->json(HrmsJob::with(['department', 'designation'])->withCount('applications')->get());
    }

    public function storeJob(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'employment_type' => 'required|string',
            'location' => 'nullable|string',
            'vacancy_count' => 'required|integer|min:1',
            'expiry_date' => 'nullable|date',
            'description' => 'required|string',
            'status' => 'required|string'
        ]);

        $job = HrmsJob::create($validated);
        return response()->json($job, 201);
    }

    public function updateJob(Request $request, HrmsJob $job)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'employment_type' => 'sometimes|string',
            'location' => 'nullable|string',
            'vacancy_count' => 'sometimes|integer|min:1',
            'expiry_date' => 'nullable|date',
            'description' => 'sometimes|string',
            'status' => 'sometimes|string'
        ]);

        $job->update($validated);
        return response()->json($job);
    }

    public function deleteJob(HrmsJob $job)
    {
        $job->delete();
        return response()->json(null, 204);
    }

    // Applications
    public function listApplications(Request $request)
    {
        $query = HrmsApplication::with(['job', 'candidate']);
        
        if ($request->job_id) {
            $query->where('job_id', $request->job_id);
        }

        return response()->json($query->get());
    }

    public function storeApplication(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:hrms_jobs,id',
            'candidate_name' => 'required|string',
            'candidate_email' => 'required|email',
            'candidate_phone' => 'nullable|string',
            'resume_path' => 'nullable|string',
            'cover_letter' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            $candidate = HrmsCandidate::firstOrCreate(
                ['email' => $validated['candidate_email']],
                [
                    'name' => $validated['candidate_name'],
                    'phone' => $validated['candidate_phone']
                ]
            );

            $application = HrmsApplication::create([
                'job_id' => $validated['job_id'],
                'candidate_id' => $candidate->id,
                'resume_path' => $validated['resume_path'],
                'cover_letter' => $validated['cover_letter'],
                'status' => 'Applied'
            ]);

            return response()->json($application->load(['job', 'candidate']), 201);
        });
    }

    public function updateApplicationStatus(Request $request, HrmsApplication $application)
    {
        $validated = $request->validate([
            'status' => 'required|string'
        ]);

        $application->update(['status' => $validated['status']]);
        return response()->json($application);
    }

    // Interviews
    public function listInterviews()
    {
        return response()->json(HrmsInterview::with(['application.candidate', 'application.job', 'interviewer'])->get());
    }

    public function storeInterview(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:hrms_applications,id',
            'interviewer_id' => 'required|exists:users,id',
            'interview_date' => 'required|date',
            'interview_time' => 'required',
            'interview_type' => 'required|string',
            'location_link' => 'nullable|string'
        ]);

        $interview = HrmsInterview::create($validated);
        return response()->json($interview, 201);
    }

    public function updateInterview(Request $request, HrmsInterview $interview)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
            'feedback' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5'
        ]);

        $interview->update($validated);
        return response()->json($interview);
    }

    public function stats()
    {
        return response()->json([
            'total_jobs' => HrmsJob::count(),
            'active_jobs' => HrmsJob::where('status', 'Open')->count(),
            'total_applications' => HrmsApplication::count(),
            'pending_interviews' => HrmsInterview::where('status', 'Scheduled')->count(),
        ]);
    }
}
