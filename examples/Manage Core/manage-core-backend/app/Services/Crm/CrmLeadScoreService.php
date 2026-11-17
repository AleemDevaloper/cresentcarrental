<?php

namespace App\Services\Crm;

use App\Models\CrmLead;
use App\Models\CrmLeadScoreRule;

class CrmLeadScoreService
{
    public function __construct(private CrmAuditService $audit)
    {
    }

    public function recalculate(CrmLead $lead): int
    {
        $score = 0;
        $rules = CrmLeadScoreRule::where('is_active', true)->orderBy('sort_order')->get();

        foreach ($rules as $rule) {
            $delta = $this->evaluateRule($rule, $lead);
            if ($delta !== 0) {
                $score += $delta;
            }
        }

        $score = max(0, min(100, $score));
        $lead->score = $score;
        $lead->rating = $this->categoryForScore($score);
        $lead->saveQuietly();

        return $score;
    }

    public function onLeadCreated(CrmLead $lead): int
    {
        return $this->recalculate($lead);
    }

    public function onLeadUpdated(CrmLead $lead, ?array $previous = null): int
    {
        return $this->recalculate($lead);
    }

    public function applyEvent(CrmLead $lead, string $eventName, array $payload = []): int
    {
        $rule = CrmLeadScoreRule::where('event', $eventName)->where('is_active', true)->first();
        if (!$rule) return $lead->score;
        $lead->score = max(0, min(100, $lead->score + (int) $rule->points));
        $lead->rating = $this->categoryForScore($lead->score);
        $lead->saveQuietly();
        return $lead->score;
    }

    protected function evaluateRule(CrmLeadScoreRule $rule, CrmLead $lead): int
    {
        return match ($rule->event) {
            'lead.created' => 5,
            'lead.email_available' => $lead->email ? (int) $rule->points : 0,
            'lead.phone_available' => $lead->phone ? (int) $rule->points : 0,
            'lead.has_company' => $lead->company ? (int) $rule->points : 0,
            'lead.has_website' => $lead->website ? (int) $rule->points : 0,
            'lead.email_opened' => (int) $rule->points,
            'lead.email_replied' => (int) $rule->points,
            'lead.meeting_booked' => (int) $rule->points,
            'lead.deal_created' => (int) $rule->points,
            'lead.disqualified' => (int) $rule->points,
            'lead.unsubscribed' => (int) $rule->points,
            'lead.invalid_email' => (int) $rule->points,
            default => 0,
        };
    }

    public function categoryForScore(int $score): string
    {
        return match (true) {
            $score >= 80 => 'very_hot',
            $score >= 60 => 'hot',
            $score >= 40 => 'warm',
            default => 'cold',
        };
    }

    public function seedDefaults(): void
    {
        $defaults = [
            ['name' => 'Email available', 'event' => 'lead.email_available', 'points' => 10, 'category' => 'positive'],
            ['name' => 'Phone available', 'event' => 'lead.phone_available', 'points' => 10, 'category' => 'positive'],
            ['name' => 'Company identified', 'event' => 'lead.has_company', 'points' => 10, 'category' => 'positive'],
            ['name' => 'Website available', 'event' => 'lead.has_website', 'points' => 5, 'category' => 'positive'],
            ['name' => 'Email opened', 'event' => 'lead.email_opened', 'points' => 5, 'category' => 'positive'],
            ['name' => 'Email replied', 'event' => 'lead.email_replied', 'points' => 15, 'category' => 'positive'],
            ['name' => 'Meeting booked', 'event' => 'lead.meeting_booked', 'points' => 20, 'category' => 'positive'],
            ['name' => 'Deal created', 'event' => 'lead.deal_created', 'points' => 25, 'category' => 'positive'],
            ['name' => 'Disqualified', 'event' => 'lead.disqualified', 'points' => -20, 'category' => 'negative'],
            ['name' => 'Unsubscribed', 'event' => 'lead.unsubscribed', 'points' => -20, 'category' => 'negative'],
            ['name' => 'Invalid email', 'event' => 'lead.invalid_email', 'points' => -10, 'category' => 'negative'],
        ];
        foreach ($defaults as $i => $d) {
            CrmLeadScoreRule::firstOrCreate(
                ['event' => $d['event']],
                array_merge($d, ['sort_order' => $i + 1, 'is_active' => true])
            );
        }
    }
}