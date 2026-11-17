<?php

namespace App\Jobs\Crm;

use App\Services\Crm\CrmFollowUpService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessFollowUpJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public int $followUpId)
    {
    }

    public function handle(CrmFollowUpService $service): void
    {
        $service->dispatchDueFollowUps();
    }
}