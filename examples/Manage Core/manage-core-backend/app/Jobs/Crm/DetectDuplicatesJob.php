<?php

namespace App\Jobs\Crm;

use App\Services\Crm\CrmDuplicateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DetectDuplicatesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 600;

    public function __construct(public string $entityClass)
    {
    }

    public function handle(CrmDuplicateService $service): void
    {
        $service->scan($this->entityClass);
    }
}