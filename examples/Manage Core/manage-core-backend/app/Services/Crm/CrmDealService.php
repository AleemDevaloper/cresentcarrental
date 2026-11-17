<?php

namespace App\Services\Crm;

use App\Models\CrmDeal;
use App\Models\CrmPipelineStage;
use App\Models\CrmDealStageHistory;
use Illuminate\Support\Facades\DB;

class CrmDealService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmAutomationService $automation,
        private CrmNotificationService $notif,
        private CrmSequenceService $sequences
    ) {
    }

    public function create(array $data): CrmDeal
    {
        $deal = DB::connection('tenant')->transaction(function () use ($data) {
            $count = CrmDeal::count() + 1;
            $data['code'] = 'DEAL-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
            $data['created_by'] = auth()->id();
            $deal = CrmDeal::create($data);

            if ($deal->pipeline_id && $deal->stage) {
                $stage = CrmPipelineStage::where('pipeline_id', $deal->pipeline_id)
                    ->where('name', $deal->stage)->first();
                if ($stage) {
                    $deal->update(['probability' => $stage->probability]);
                    CrmDealStageHistory::create([
                        'deal_id' => $deal->id,
                        'from_stage' => null,
                        'to_stage' => $deal->stage,
                        'to_probability' => $stage->probability,
                        'moved_by' => auth()->id(),
                    ]);
                }
            }

            $this->audit->logCreate($deal, 'deal');
            $this->automation->trigger('deal.created', $deal);
            return $deal;
        });
        return $deal;
    }

    public function moveStage(CrmDeal $deal, string $newStage, ?int $probability = null, ?string $note = null): CrmDeal
    {
        $oldStage = $deal->stage;
        $oldProbability = $deal->probability;

        $probability = $probability ?? (CrmPipelineStage::where('pipeline_id', $deal->pipeline_id)
            ->where('name', $newStage)->value('probability') ?? $deal->probability);

        $deal->update([
            'stage' => $newStage,
            'probability' => $probability,
        ]);

        CrmDealStageHistory::create([
            'deal_id' => $deal->id,
            'from_stage' => $oldStage,
            'to_stage' => $newStage,
            'from_probability' => $oldProbability,
            'to_probability' => $probability,
            'moved_by' => auth()->id(),
            'note' => $note,
        ]);

        $this->audit->logAction('stage_changed', 'deal',
            "Stage: {$oldStage} → {$newStage} ({$probability}%)", $deal);

        $this->automation->trigger('deal.stage_changed', $deal, [
            'from' => $oldStage,
            'to' => $newStage,
        ]);

        return $deal->fresh();
    }

    public function markWon(CrmDeal $deal, ?string $actualCloseDate = null): CrmDeal
    {
        $deal->update([
            'status' => 'won',
            'stage' => 'won',
            'won_at' => now(),
            'actual_close_date' => $actualCloseDate ?? now()->toDateString(),
            'probability' => 100,
        ]);
        $this->audit->logAction('won', 'deal', 'Deal marked as won', $deal);
        $this->automation->trigger('deal.won', $deal);
        $this->sequences->stopEntity(0, $deal, 'deal_won'); // stop all sequences for this deal
        if ($deal->assigned_to) {
            $this->notif->send($deal->assigned_to, 'deal',
                'Deal won: ' . $deal->name,
                'Amount: ' . $deal->amount,
                ['entity_type' => CrmDeal::class, 'entity_id' => $deal->id]
            );
        }
        return $deal;
    }

    public function markLost(CrmDeal $deal, string $lostReason): CrmDeal
    {
        $deal->update([
            'status' => 'lost',
            'stage' => 'lost',
            'lost_at' => now(),
            'lost_reason' => $lostReason,
            'probability' => 0,
        ]);
        $this->audit->logAction('lost', 'deal', 'Lost: ' . $lostReason, $deal);
        $this->automation->trigger('deal.lost', $deal);
        if ($deal->assigned_to) {
            $this->notif->send($deal->assigned_to, 'deal',
                'Deal lost: ' . $deal->name,
                $lostReason,
                ['entity_type' => CrmDeal::class, 'entity_id' => $deal->id]
            );
        }
        return $deal;
    }
}