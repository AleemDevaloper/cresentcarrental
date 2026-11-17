<?php

namespace App\Jobs\Crm;

use App\Services\Crm\CrmImportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 600;

    public function __construct(public int $jobId)
    {
    }

    public function handle(CrmImportService $service): void
    {
        $service->processJob($this->jobId);
    }
}