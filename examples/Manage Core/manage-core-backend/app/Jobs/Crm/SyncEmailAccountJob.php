<?php

namespace App\Jobs\Crm;

use App\Models\CrmEmailAccount;
use App\Services\Crm\CrmEmailService;
use App\Services\Crm\Email\EmailProviderFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncEmailAccountJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 600;

    public function __construct(public int $accountId)
    {
    }

    public function handle(CrmEmailService $service): void
    {
        $account = CrmEmailAccount::find($this->accountId);
        if (!$account || $account->status !== 'active') return;

        $account->update(['sync_status' => 'syncing']);

        try {
            $provider = EmailProviderFactory::for($account);
            $result = $provider->fetchMessages($account, $account->sync_cursor);

            foreach ($result['messages'] ?? [] as $msg) {
                $service->storeInboundMessage($msg, $account);
            }

            $account->update([
                'sync_status' => 'idle',
                'last_sync_at' => now(),
                'sync_cursor' => $result['cursor'] ?? $account->sync_cursor,
            ]);
        } catch (\Throwable $e) {
            $account->update(['sync_status' => 'failed']);
            \Illuminate\Support\Facades\Log::error('Email sync failed', [
                'account_id' => $account->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}