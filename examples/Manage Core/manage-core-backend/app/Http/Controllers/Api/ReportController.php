<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReportSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => ReportSchedule::all()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'frequency' => 'required|in:daily,weekly,monthly',
            'recipient_emails' => 'required|string',
        ]);

        $schedule = ReportSchedule::create($validated + ['is_active' => true]);

        return response()->json(['data' => $schedule], 201);
    }

    public function toggle(ReportSchedule $schedule): JsonResponse
    {
        $schedule->update(['is_active' => !$schedule->is_active]);
        return response()->json(['data' => $schedule]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'totalSchedules' => ReportSchedule::count(),
                'activeSchedules' => ReportSchedule::where('is_active', true)->count(),
                'reportsGenerated' => 450, // Mock value
            ]
        ]);
    }
}
