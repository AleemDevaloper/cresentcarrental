<?php

namespace App\Jobs\Crm;

use App\Models\CrmLead;
use App\Services\Crm\CrmLeadScoreService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecalculateLeadScoreJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public int $leadId)
    {
    }

    public function handle(CrmLeadScoreService $service): void
    {
        $lead = CrmLead::find($this->leadId);
        if ($lead) $service->recalculate($lead);
    }
}