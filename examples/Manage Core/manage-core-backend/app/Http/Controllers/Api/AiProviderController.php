<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiProviderSetting;
use App\Models\AiUsageLog;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AiProviderController extends Controller
{
    public function __construct(protected AiService $ai) {}

    public function index(): JsonResponse
    {
        $providers = AiProviderSetting::orderBy('sort_order')->orderBy('name')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'provider_type' => $p->provider_type,
                'has_api_key' => !empty($p->api_key),
                'base_url' => $p->base_url,
                'default_model' => $p->default_model,
                'available_models' => $p->available_models,
                'settings' => $p->settings,
                'is_active' => $p->is_active,
                'is_default' => $p->is_default,
                'sort_order' => $p->sort_order,
                'created_at' => $p->created_at,
            ];
        });

        return response()->json(['data' => $providers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_type' => 'required|string|max:50',
            'api_key' => 'nullable|string',
            'base_url' => 'nullable|string|max:500',
            'default_model' => 'nullable|string|max:100',
            'available_models' => 'nullable|array',
            'available_models.*' => 'string',
            'settings' => 'nullable|array',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        if (!empty($validated['api_key'])) {
            $validated['api_key'] = Crypt::encryptString($validated['api_key']);
        }

        $provider = AiProviderSetting::create($validated);

        return response()->json(['data' => $provider->fresh(), 'message' => 'Provider created'], 201);
    }

    public function update(Request $request, AiProviderSetting $provider): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'provider_type' => 'sometimes|string|max:50',
            'api_key' => 'nullable|string',
            'base_url' => 'nullable|string|max:500',
            'default_model' => 'nullable|string|max:100',
            'available_models' => 'nullable|array',
            'available_models.*' => 'string',
            'settings' => 'nullable|array',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        if (isset($validated['api_key'])) {
            $validated['api_key'] = $validated['api_key']
                ? Crypt::encryptString($validated['api_key'])
                : null;
        }

        $provider->update($validated);

        return response()->json(['data' => $provider->fresh(), 'message' => 'Provider updated']);
    }

    public function destroy(AiProviderSetting $provider): JsonResponse
    {
        if ($provider->is_default) {
            $fallback = AiProviderSetting::where('id', '!=', $provider->id)->first();
            if ($fallback) {
                $fallback->update(['is_default' => true]);
            }
        }
        $provider->delete();
        return response()->json(['message' => 'Provider deleted']);
    }

    public function test(AiProviderSetting $provider): JsonResponse
    {
        try {
            $decrypted = $provider->api_key ? Crypt::decryptString($provider->api_key) : null;
            $model = $provider->default_model ?: 'openrouter/free';

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => "Bearer {$decrypted}",
                'Content-Type' => 'application/json',
            ])->timeout(30)->post(rtrim($provider->base_url ?: 'https://openrouter.ai/api/v1', '/') . '/chat/completions', [
                'model' => $model,
                'messages' => [['role' => 'user', 'content' => 'Say "ok" and nothing else.']],
                'max_tokens' => 10,
            ]);

            if ($response->successful()) {
                return response()->json(['status' => 'ok', 'message' => 'Connection successful']);
            }

            return response()->json(['status' => 'error', 'message' => $response->body()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function usage(Request $request): JsonResponse
    {
        $query = AiUsageLog::query();

        if ($request->filled('feature')) {
            $query->where('feature', $request->feature);
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        $stats = [
            'total_requests' => (clone $query)->count(),
            'total_tokens' => (clone $query)->sum('input_tokens') + (clone $query)->sum('output_tokens'),
            'total_cost' => (clone $query)->sum('cost'),
            'success_count' => (clone $query)->where('status', 'success')->count(),
            'error_count' => (clone $query)->where('status', '!=', 'success')->count(),
            'by_feature' => (clone $query)->selectRaw('feature, count(*) as count, sum(input_tokens + output_tokens) as tokens, sum(cost) as cost')
                ->groupBy('feature')->get(),
            'today_requests' => (clone $query)->whereDate('created_at', today())->count(),
            'today_tokens' => (clone $query)->whereDate('created_at', today())->sum('input_tokens') + (clone $query)->whereDate('created_at', today())->sum('output_tokens'),
            'today_cost' => (clone $query)->whereDate('created_at', today())->sum('cost'),
            'daily_usage' => (clone $query)->selectRaw('DATE(created_at) as date, count(*) as requests, sum(input_tokens + output_tokens) as tokens, sum(cost) as cost')
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        $logs = $query->with('user:id,name')->latest()->limit(50)->get();

        return response()->json(['stats' => $stats, 'logs' => $logs]);
    }

    public function models(): JsonResponse
    {
        $providers = AiProviderSetting::where('is_active', true)->get();
        $models = [];

        foreach ($providers as $provider) {
            $availableModels = $provider->available_models ?? [];
            foreach ($availableModels as $modelId) {
                $models[] = [
                    'id' => $modelId,
                    'name' => $modelId,
                    'provider' => $provider->name,
                    'provider_type' => $provider->provider_type,
                ];
            }
            // Also add the default model if not already in the list
            if ($provider->default_model && !collect($models)->pluck('id')->contains($provider->default_model)) {
                $models[] = [
                    'id' => $provider->default_model,
                    'name' => $provider->default_model,
                    'provider' => $provider->name,
                    'provider_type' => $provider->provider_type,
                ];
            }
        }

        // Fallback if no providers configured
        if (empty($models)) {
            $models = [
                ['id' => 'openrouter/free', 'name' => 'OpenRouter Free', 'provider' => 'OpenRouter', 'provider_type' => 'openrouter'],
                ['id' => 'google/gemma-4-26b-a4b-it:free', 'name' => 'Gemma 4 26B', 'provider' => 'OpenRouter', 'provider_type' => 'openrouter'],
                ['id' => 'openai/gpt-oss-20b:free', 'name' => 'GPT OSS 20B', 'provider' => 'OpenRouter', 'provider_type' => 'openrouter'],
                ['id' => 'nvidia/nemotron-3-super-120b-a12b:free', 'name' => 'Nemotron 3 Super', 'provider' => 'OpenRouter', 'provider_type' => 'openrouter'],
            ];
        }

        return response()->json(['data' => $models]);
    }
}

