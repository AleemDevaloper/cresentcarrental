<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntegrationApiKey;
use App\Models\IntegrationWebhook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IntegrationController extends Controller
{
    // API Key Endpoints
    public function listApiKeys(): JsonResponse
    {
        $keys = IntegrationApiKey::latest()->get();
        return response()->json($keys);
    }

    public function storeApiKey(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'scopes' => 'nullable|array',
        ]);

        $plainKey = 'mc_' . Str::random(40);
        
        $key = IntegrationApiKey::create([
            'name' => $data['name'],
            'api_key' => hash('sha256', $plainKey),
            'scopes' => $data['scopes'] ?? [],
            'is_active' => true,
        ]);

        // Return the plain key only once during creation
        return response()->json([
            'message' => 'API Key created successfully.',
            'key' => $key,
            'plain_key' => $plainKey,
        ], 201);
    }

    public function toggleApiKey(IntegrationApiKey $apiKey): JsonResponse
    {
        $apiKey->update(['is_active' => !$apiKey->is_active]);
        return response()->json([
            'message' => 'API Key status updated.',
            'key' => $apiKey
        ]);
    }

    public function destroyApiKey(IntegrationApiKey $apiKey): JsonResponse
    {
        $apiKey->delete();
        return response()->json(['message' => 'API Key deleted successfully.']);
    }

    // Webhook Endpoints
    public function listWebhooks(): JsonResponse
    {
        $webhooks = IntegrationWebhook::latest()->get();
        return response()->json($webhooks);
    }

    public function storeWebhook(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'events' => 'required|array',
        ]);

        $webhook = IntegrationWebhook::create([
            'name' => $data['name'],
            'url' => $data['url'],
            'secret' => 'whsec_' . Str::random(32),
            'events' => $data['events'],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Webhook registered successfully.',
            'webhook' => $webhook
        ], 201);
    }

    public function toggleWebhook(IntegrationWebhook $webhook): JsonResponse
    {
        $webhook->update(['is_active' => !$webhook->is_active]);
        return response()->json([
            'message' => 'Webhook status updated.',
            'webhook' => $webhook
        ]);
    }

    public function destroyWebhook(IntegrationWebhook $webhook): JsonResponse
    {
        $webhook->delete();
        return response()->json(['message' => 'Webhook deleted successfully.']);
    }
}
