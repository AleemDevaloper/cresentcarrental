<?php

namespace App\Services\Crm\Email;

interface EmailProviderInterface
{
    public function provider(): string;

    /**
     * Return array with 'access_token' (encrypted), 'refresh_token' (encrypted), 'expires_at'
     */
    public function connect(array $credentials): array;

    public function refreshToken(\App\Models\CrmEmailAccount $account): string;

    public function fetchMessages(\App\Models\CrmEmailAccount $account, ?string $cursor = null, int $limit = 50): array;

    public function fetchThread(\App\Models\CrmEmailAccount $account, string $threadId): array;

    public function sendMessage(\App\Models\CrmEmailAccount $account, array $payload): array;

    public function registerWebhook(\App\Models\CrmEmailAccount $account, string $url): array;
}