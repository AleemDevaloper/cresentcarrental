<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiProviderSetting;
use App\Models\AiUsageLog;
use App\Services\AiQuotaService;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AiChatController extends Controller
{
    public function __construct(protected AiService $ai) {}

    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string',
            'model' => 'nullable|string',
            'provider_id' => 'nullable|exists:ai_provider_settings,id',
        ]);

        $startTime = microtime(true);

        // Enforce Super Admin defined AI quota for the user's organization (applies to streaming and non-streaming).
        $user = $request->user();
        if ($user && !empty($user->organization)) {
            $limit = AiQuotaService::checkLimit($user->organization);
            if ($limit) {
                $exceeded = array_keys($limit['exceeded']);
                $message = 'AI usage quota exceeded for your organization';
                if (in_array('requests', $exceeded)) {
                    $message .= ' (request limit reached)';
                } elseif (in_array('tokens', $exceeded)) {
                    $message .= ' (token limit reached)';
                } elseif (in_array('cost', $exceeded)) {
                    $message .= ' (cost limit reached)';
                }
                $message .= '. Please contact your administrator.';
                return response()->json(['message' => $message, 'quota' => $limit], 429);
            }
        }

        if ($request->boolean('stream')) {
            $options = [];
            if ($request->filled('model')) {
                $options['model'] = $request->model;
            }
            if ($request->filled('provider_id')) {
                $provider = AiProviderSetting::findOrFail($request->provider_id);
                if ($provider->api_key) {
                    $options['api_key'] = Crypt::decryptString($provider->api_key);
                }
                if ($provider->base_url) {
                    $options['base_url'] = $provider->base_url;
                }
                if (!$request->filled('model') && $provider->default_model) {
                    $options['model'] = $provider->default_model;
                }
            }

            $user = $request->user();

            return response()->stream(function () use ($request, $options, $user, $startTime) {
                $this->ai->streamChat(
                    $request->input('message'),
                    $request->input('history', []),
                    $options,
                    function (array $meta) use ($request, $user, $startTime) {
                        try {
                            $duration = (int) ((microtime(true) - $startTime) * 1000);
                            AiUsageLog::create([
                                'user_id' => $user?->id,
                                'feature' => 'chat',
                                'provider' => $meta['model'] ?? 'unknown',
                                'model' => $meta['model'] ?? 'default',
                                'prompt' => $request->input('message'),
                                'response' => $meta['content'] ?? '',
                                'input_tokens' => $meta['usage']['prompt_tokens'] ?? 0,
                                'output_tokens' => $meta['usage']['completion_tokens'] ?? 0,
                                'cost' => $this->estimateCost($meta['usage'] ?? []),
                                'duration_ms' => $duration,
                                'status' => 'success',
                                'ip' => $request->ip(),
                                'user_agent' => $request->userAgent(),
                            ]);
                        } catch (\Throwable $e) {
                            Log::warning('Failed to log AI streaming usage', ['error' => $e->getMessage()]);
                        }
                    }
                );
            }, 200, [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
                'X-Accel-Buffering' => 'no',
                'Connection' => 'keep-alive',
            ]);
        }

        try {
            $options = [];
            if ($request->filled('model')) {
                $options['model'] = $request->model;
            }
            if ($request->filled('provider_id')) {
                $provider = AiProviderSetting::findOrFail($request->provider_id);
                if ($provider->api_key) {
                    $options['api_key'] = Crypt::decryptString($provider->api_key);
                }
                if ($provider->base_url) {
                    $options['base_url'] = $provider->base_url;
                }
                if (!$request->filled('model') && $provider->default_model) {
                    $options['model'] = $provider->default_model;
                }
            }

            $res = $this->ai->chat($request->input('message'), $request->input('history', []), $options);

            $duration = (int)((microtime(true) - $startTime) * 1000);

            AiUsageLog::create([
                'user_id' => $request->user()?->id,
                'feature' => 'chat',
                'provider' => $res['model'] ?? 'unknown',
                'model' => $options['model'] ?? 'default',
                'prompt' => $request->input('message'),
                'response' => $res['content'] ?? '',
                'input_tokens' => $res['usage']['prompt_tokens'] ?? 0,
                'output_tokens' => $res['usage']['completion_tokens'] ?? 0,
                'cost' => $this->estimateCost($res['usage'] ?? []),
                'duration_ms' => $duration,
                'status' => $res['success'] ? 'success' : 'error',
                'error_message' => $res['success'] ? null : ($res['content'] ?? 'Unknown error'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => $res['success'],
                'data' => [
                    'content' => $res['content'],
                    'usage' => $res['usage'],
                    'model' => $res['model'],
                ]
            ]);
        } catch (\Exception $e) {
            $duration = (int)((microtime(true) - $startTime) * 1000);

            AiUsageLog::create([
                'user_id' => $request->user()?->id,
                'feature' => 'chat',
                'provider' => 'unknown',
                'model' => $options['model'] ?? 'default',
                'prompt' => $request->input('message'),
                'response' => null,
                'input_tokens' => 0,
                'output_tokens' => 0,
                'cost' => 0,
                'duration_ms' => $duration,
                'status' => 'error',
                'error_message' => $e->getMessage(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['message' => 'AI service unavailable. Please try again later.'], 500);
        }
    }

    protected function estimateCost(array $usage): float
    {
        $input = $usage['prompt_tokens'] ?? 0;
        $output = $usage['completion_tokens'] ?? 0;
        return (($input * 0.000003) + ($output * 0.000015));
    }

    public function summary(Request $request, $sessionId): JsonResponse
    {
        try {
            $res = $this->ai->generateInsight('Chat session summary', "Session ID: {$sessionId}");
            return response()->json(['data' => $res]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI service unavailable. Please try again later.'], 500);
        }
    }

    public function actionItems(Request $request, $sessionId): JsonResponse
    {
        try {
            $res = $this->ai->generateActionItems("Chat session {$sessionId}");
            return response()->json(['data' => $res]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI service unavailable. Please try again later.'], 500);
        }
    }

    public function translate(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
            'targetLang' => 'required|string',
        ]);

        try {
            $res = $this->ai->translate($request->input('text'), $request->input('targetLang'));
            return response()->json(['data' => $res]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI service unavailable. Please try again later.'], 500);
        }
    }

    public function suggest(Request $request, $sessionId): JsonResponse
    {
        try {
            $res = $this->ai->suggestResponse("Chat session {$sessionId}");
            return response()->json(['data' => $res]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI service unavailable. Please try again later.'], 500);
        }
    }
}
