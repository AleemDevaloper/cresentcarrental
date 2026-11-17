<?php

namespace App\Jobs\Crm;

use App\Services\Crm\CrmEmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public ?int $emailId = null, public ?string $toOverride = null, public ?string $subjectOverride = null, public ?string $bodyOverride = null, public array $context = [])
    {
    }

    public function handle(CrmEmailService $service): void
    {
        if ($this->emailId) {
            $service->sendQueuedEmail($this->emailId);
        }
    }

    public function failed(\Throwable $e): void
    {
        \Illuminate\Support\Facades\Log::error('SendEmailJob failed', [
            'email_id' => $this->emailId,
            'error' => $e->getMessage(),
        ]);
    }
}