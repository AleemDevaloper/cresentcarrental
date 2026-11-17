<?php

namespace App\Jobs\Crm;

use App\Models\CrmSequenceEnrollment;
use App\Services\Crm\CrmSequenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AdvanceSequenceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public ?int $enrollmentId = null)
    {
    }

    public function handle(CrmSequenceService $service): void
    {
        if ($this->enrollmentId) {
            $enrollment = CrmSequenceEnrollment::find($this->enrollmentId);
            if ($enrollment && $enrollment->status === 'active') {
                $service->advance($enrollment);
            }
        } else {
            CrmSequenceEnrollment::where('status', 'active')
                ->where('next_step_at', '<=', now())
                ->orderBy('next_step_at')
                ->limit(100)
                ->get()
                ->each(fn($e) => $service->advance($e));
        }
    }
}