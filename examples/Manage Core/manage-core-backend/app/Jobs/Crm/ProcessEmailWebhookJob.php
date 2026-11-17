<?php

namespace App\Jobs\Crm;

use App\Models\CrmEmailWebhook;
use App\Services\Crm\CrmEmailService;
use App\Services\Crm\Email\EmailProviderFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessEmailWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $webhookId)
    {
    }

    public function handle(CrmEmailService $service): void
    {
        $webhook = CrmEmailWebhook::find($this->webhookId);
        if (!$webhook || $webhook->processed) return;

        try {
            $account = $webhook->account;
            if (!$account) {
                $webhook->update(['processed' => true, 'error' => 'No account', 'processed_at' => now()]);
                return;
            }
            $provider = EmailProviderFactory::for($account);

            switch ($webhook->event_type) {
                case 'message_received':
                case 'message.created':
                case 'created':
                    if (!empty($webhook->payload['message_id'])) {
                        $messages = $provider->fetchThread($account, $webhook->payload['conversationId'] ?? $webhook->payload['message_id']);
                        foreach ($messages as $m) {
                            $service->storeInboundMessage($m, $account);
                        }
                    }
                    break;
            }

            $webhook->update(['processed' => true, 'processed_at' => now()]);
        } catch (\Throwable $e) {
            $webhook->update(['processed' => false, 'error' => $e->getMessage()]);
            throw $e;
        }
    }
}