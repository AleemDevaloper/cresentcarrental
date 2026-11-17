<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebsiteAnalyticsEvent;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'event_name' => 'required|string|max:80',
            'session_id' => 'required|string|max:100',
            'page_path' => 'nullable|string|max:500',
            'page_title' => 'nullable|string|max:255',
            'target_label' => 'nullable|string|max:255',
            'target_href' => 'nullable|string|max:500',
            'content_type' => 'nullable|string|max:80',
            'content_id' => 'nullable|string|max:190',
            'metadata' => 'nullable|array',
            'referrer' => 'nullable|string|max:500',
        ]);

        WebsiteAnalyticsEvent::create([
            ...$data,
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'occurred_at' => now(),
        ]);

        return response()->json(['message' => 'Event recorded.'], 202);
    }
}
