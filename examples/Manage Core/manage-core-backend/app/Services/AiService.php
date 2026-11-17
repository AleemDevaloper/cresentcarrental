<?php

namespace App\Services;

use App\Models\AiProviderSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;
    protected int $timeout;
    protected ?string $lastError = null;

    public function __construct()
    {
        $this->loadConfig();
    }

    protected function loadConfig(): void
    {
        $config = Cache::remember('ai_service.config', 300, function () {
            try {
                $provider = AiProviderSetting::where('is_active', true)
                    ->where('is_default', true)
                    ->first();
            } catch (\Throwable $e) {
                $provider = null;
            }

            if ($provider && $provider->api_key) {
                return [
                    'api_key' => Crypt::decryptString($provider->api_key),
                    'base_url' => $provider->base_url ?: 'https://openrouter.ai/api/v1',
                    'default_model' => $provider->default_model ?: 'openrouter/free',
                    'timeout' => $provider->settings['timeout'] ?? 120,
                ];
            }

            return [
                'api_key' => config('ai.openrouter.api_key', ''),
                'base_url' => config('ai.openrouter.base_url', 'https://openrouter.ai/api/v1'),
                'default_model' => config('ai.openrouter.default_model', 'openrouter/free'),
                'timeout' => config('ai.openrouter.timeout', 120),
            ];
        });

        $this->apiKey = $config['api_key'];
        $this->baseUrl = $config['base_url'];
        $this->defaultModel = $config['default_model'];
        $this->timeout = $config['timeout'];
    }

    public function withOptions(array $options): static
    {
        if (isset($options['api_key'])) {
            $this->apiKey = $options['api_key'];
        }
        if (isset($options['base_url'])) {
            $this->baseUrl = rtrim($options['base_url'], '/');
        }
        if (isset($options['model'])) {
            $this->defaultModel = $options['model'];
        }
        if (isset($options['timeout'])) {
            $this->timeout = (int) $options['timeout'];
        }
        return $this;
    }

    public function chat(string $prompt, array $context = [], array $options = []): array
    {
        $this->withOptions($options);
        $messages = $this->buildMessages($prompt, $context, $options['system'] ?? null);

        $cacheKey = null;
        if (empty($context) && !empty($options['cache_ttl'])) {
            $cacheKey = 'ai_response:' . md5($prompt . json_encode($options));
            $cached = Cache::get($cacheKey);
            if ($cached) {
                return $cached;
            }
        }

        $result = $this->sendRequest($messages, $options);

        if ($cacheKey && ($result['success'] ?? false)) {
            Cache::put($cacheKey, $result, (int) $options['cache_ttl']);
        }

        return $result;
    }

    public function classifyDocument(string $documentName, ?string $description, ?string $content): array
    {
        $prompt = "Classify the following document into one of these categories: Contract, Invoice, Report, Proposal, Internal Memo, Policy Document, Financial Statement, Other.\n\nDocument name: {$documentName}\nDescription: " . ($description ?? 'N/A') . "\nContent: " . ($content ?? 'N/A') . "\n\nRespond with a JSON object containing: category (string), subcategory (string or null), tags (array of strings), summary (string). Only output valid JSON, nothing else.";
        return $this->chat($prompt, [], ['model' => config('ai.models.classification'), 'temperature' => 0.3, 'response_format' => 'json_object', 'cache_ttl' => 3600]);
    }

    public function analyzeDocument(string $documentName, ?string $description, ?string $content, array $metadata = []): array
    {
        $metaStr = json_encode($metadata);
        $prompt = "Perform a comprehensive analysis of the following document.\n\nName: {$documentName}\nDescription: " . ($description ?? 'N/A') . "\nMetadata: {$metaStr}\nContent: " . ($content ?? 'N/A') . "\n\nRespond with a JSON object containing: ocr_text (simulated OCR text), extracted_fields (object with document_type, date, author, page_count, language, key_phrases array), entities (array of {type, text} objects), sentiment (string), complexity_score (0-1). Only output valid JSON.";
        return $this->chat($prompt, [], ['model' => config('ai.models.analysis'), 'temperature' => 0.3, 'response_format' => 'json_object', 'cache_ttl' => 3600]);
    }

    public function generateSummary(string $documentName, ?string $description, ?string $content, array $metadata = []): array
    {
        $metaStr = json_encode($metadata);
        $prompt = "Generate a concise summary of the following document.\n\nName: {$documentName}\nDescription: " . ($description ?? 'N/A') . "\nMetadata: {$metaStr}\nContent: " . ($content ?? 'N/A') . "\n\nRespond with a JSON object containing: summary (2-3 sentence summary), key_points (array of 3-5 key points), word_count (estimated number), reading_time_minutes (estimated). Only output valid JSON.";
        return $this->chat($prompt, [], ['model' => config('ai.models.summary'), 'temperature' => 0.4, 'response_format' => 'json_object', 'cache_ttl' => 3600]);
    }

    public function generateInsight(string $dataContext, string $dataJson): string
    {
        $prompt = "You are an AI business analyst. Analyze the following data and provide a concise actionable insight (2-3 sentences) in plain text. Do not use JSON.\n\nContext: {$dataContext}\nData: {$dataJson}";
        $res = $this->chat($prompt, [], ['temperature' => 0.5, 'max_tokens' => 200]);
        return $res['content'] ?? 'No insight available.';
    }

    public function checkCompliance(string $documentName, string $status, ?string $confidentiality, ?string $retentionPolicy, ?string $tags, int $version, ?string $approvalStatus): array
    {
        $prompt = "Perform a compliance check on the following document and respond with a JSON object containing: compliance_score (0-100 number), overall_status (compliant/partially_compliant/non_compliant), rules (array of objects with rule, status, details), summary (object with passed, warnings, failed, totals). Only output valid JSON.\n\nDocument: {$documentName}\nStatus: {$status}\nConfidentiality: " . ($confidentiality ?? 'N/A') . "\nRetention Policy: " . ($retentionPolicy ?? 'N/A') . "\nTags: " . ($tags ?? 'N/A') . "\nVersion: {$version}\nApproval Status: " . ($approvalStatus ?? 'N/A');
        return $this->chat($prompt, [], ['model' => config('ai.models.default'), 'temperature' => 0.3, 'response_format' => 'json_object']);
    }

    public function semanticSearch(string $query, array $documents): array
    {
        $docsJson = json_encode($documents);
        $prompt = "Given the search query '{$query}', analyze these documents and rank them by relevance. Respond with a JSON object containing: results (array of objects with id, name, relevance 0-1, highlight string). Only output valid JSON.\n\nDocuments: {$docsJson}";
        $res = $this->chat($prompt, [], ['model' => config('ai.models.default'), 'temperature' => 0.3, 'response_format' => 'json_object']);
        return $res;
    }

    public function generateActionItems(string $context): array
    {
        $prompt = "Analyze the following chat context and generate actionable items. Respond with a JSON array of objects, each with: action (string), priority (high/medium/low), assignee (string or null), deadline (string or null). Only output valid JSON.\n\nContext: {$context}";
        $res = $this->chat($prompt, [], ['model' => config('ai.models.default'), 'temperature' => 0.4, 'response_format' => 'json_object']);
        return $res;
    }

    public function suggestResponse(string $context): string
    {
        $prompt = "Based on this chat context, suggest a brief professional response (1-2 sentences). Do not use JSON.\n\nContext: {$context}";
        $res = $this->chat($prompt, [], ['temperature' => 0.5, 'max_tokens' => 150]);
        return $res['content'] ?? '';
    }

    public function translate(string $text, string $targetLang): string
    {
        $prompt = "Translate the following text to {$targetLang}. Return only the translated text, nothing else.\n\nText: {$text}";
        $res = $this->chat($prompt, [], ['temperature' => 0.2, 'max_tokens' => 500]);
        return $res['content'] ?? $text;
    }

    protected function buildMessages(string $prompt, array $context = [], ?string $systemPrompt = null): array
    {
        $messages = [];
        if ($systemPrompt) {
            $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        } else {
            $messages[] = ['role' => 'system', 'content' => 'You are an AI assistant for Manage Core ERP. Provide concise, accurate, and actionable responses.'];
        }
        foreach ($context as $msg) {
            if (isset($msg['role']) && isset($msg['content'])) {
                $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
            }
        }
        $messages[] = ['role' => 'user', 'content' => $prompt];
        return $messages;
    }

    protected function sendRequest(array $messages, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;
        $candidateModels = array_values(array_unique(array_merge([$model], (array) config('ai.openrouter.fallback_models', []))));

        $lastError = null;
        foreach ($candidateModels as $candidateModel) {
            $res = $this->attemptModel($messages, $candidateModel, $options);
            if ($res !== null) {
                return $res;
            }
            $lastError = $res === null ? $this->lastError : $lastError;
        }

        Log::error('OpenRouter request failed after all candidate models', ['models' => $candidateModels, 'error' => $lastError]);
        return $this->fallbackResponse();
    }

    protected function attemptModel(array $messages, string $model, array $options): ?array
    {
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 1024;
        $maxRetries = $options['max_retries'] ?? 2;

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ];

        if (!empty($options['response_format'])) {
            $payload['response_format'] = ['type' => $options['response_format'] === 'json_object' ? 'json_object' : 'text'];
        }

        for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
            if ($attempt > 0) {
                usleep(500000 * $attempt);
            }

            try {
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => config('app.url'),
                    'X-Title' => 'Manage Core ERP',
                ])->timeout($this->timeout)->post("{$this->baseUrl}/chat/completions", $payload);

                if ($response->failed()) {
                    $this->lastError = 'OpenRouter API error: ' . $response->status();
                    Log::warning('OpenRouter API error (attempt ' . ($attempt + 1) . ')', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                        'model' => $model,
                    ]);
                    continue;
                }

                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? '';

                if (empty(trim($content))) {
                    $this->lastError = 'OpenRouter returned empty content';
                    Log::warning('OpenRouter returned empty content (attempt ' . ($attempt + 1) . ')', [
                        'model' => $model,
                    ]);
                    continue;
                }

                $usage = $data['usage'] ?? [];

                $parsed = null;
                if (!empty($options['response_format']) && $options['response_format'] === 'json_object') {
                    $parsed = json_decode($content, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        preg_match('/\{.*\}/s', $content, $matches);
                        if (!empty($matches[0])) {
                            $parsed = json_decode($matches[0], true);
                        }
                    }
                }

                return [
                    'content' => $content,
                    'parsed' => $parsed,
                    'usage' => $usage,
                    'model' => $model,
                    'success' => true,
                ];
            } catch (\Exception $e) {
                $this->lastError = $e->getMessage();
                Log::warning('OpenRouter request failed (attempt ' . ($attempt + 1) . ')', ['error' => $e->getMessage(), 'model' => $model]);
            }
        }

        return null;
    }

    public function streamChat(string $prompt, array $context = [], array $options = [], ?callable $onComplete = null): void
    {
        $this->withOptions($options);
        $messages = $this->buildMessages($prompt, $context, $options['system'] ?? null);

        $candidateModels = array_values(array_unique(array_merge(
            [$options['model'] ?? $this->defaultModel],
            (array) config('ai.openrouter.fallback_models', [])
        )));

        foreach ($candidateModels as $model) {
            $payload = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 1024,
                'stream' => true,
            ];

            try {
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => config('app.url'),
                    'X-Title' => 'Manage Core ERP',
                ])->withOptions(['stream' => true])
                    ->timeout($this->timeout)
                    ->post("{$this->baseUrl}/chat/completions", $payload);

                if ($response->failed()) {
                    Log::warning('OpenRouter streaming failed to start', ['status' => $response->status(), 'model' => $model]);
                    continue;
                }

                $body = $response->toPsrResponse()->getBody();
                $fullText = '';
                $usage = [];
                $buffer = '';

                while (!$body->eof()) {
                    $chunk = $body->read(8192);
                    if ($chunk === '' || $chunk === false) {
                        break;
                    }

                    $buffer .= $chunk;

                    while (($pos = strpos($buffer, "\n")) !== false) {
                        $line = substr($buffer, 0, $pos);
                        $buffer = substr($buffer, $pos + 1);
                        $line = rtrim($line, "\r");
                        if (str_starts_with($line, 'data:')) {
                            $data = trim(substr($line, 5));
                            if ($data !== '' && $data !== '[DONE]') {
                                $event = json_decode($data, true);
                                if (is_array($event)) {
                                    $delta = $event['choices'][0]['delta']['content'] ?? null;
                                    if (is_string($delta) && $delta !== '') {
                                        $fullText .= $delta;
                                    }
                                    if (isset($event['usage'])) {
                                        $usage = $event['usage'];
                                    }
                                }
                            }
                        }
                    }

                    echo $chunk;
                    flush();
                    if (function_exists('ob_flush')) {
                        @ob_flush();
                    }
                }

                if ($onComplete) {
                    $onComplete(['model' => $model, 'usage' => $usage, 'content' => $fullText]);
                }
                return;
            } catch (\Exception $e) {
                Log::warning('OpenRouter streaming exception', ['error' => $e->getMessage(), 'model' => $model]);
                continue;
            }
        }

        echo 'event: error' . "\n" . 'data: ' . json_encode(['message' => 'AI service unavailable. Please try again later.']) . "\n\n";
        flush();
        if (function_exists('ob_flush')) {
            @ob_flush();
        }
    }

    protected function fallbackResponse(): array
    {
        return [
            'content' => 'I apologize, but I am currently unable to process your request. Please try again later.',
            'parsed' => null,
            'usage' => [],
            'model' => 'fallback',
            'success' => false,
        ];
    }
}
