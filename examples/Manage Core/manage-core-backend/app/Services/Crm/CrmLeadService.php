<?php

namespace App\Services\Crm;

use App\Models\CrmLead;
use App\Models\CrmCustomer;
use App\Models\CrmContact;
use App\Models\CrmDeal;
use App\Models\CrmPipeline;
use App\Models\CrmPipelineStage;
use App\Models\CrmDealStageHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmLeadService
{
    public function __construct(
        private CrmAuditService $audit,
        private CrmLeadScoreService $scoring,
        private CrmAutomationService $automation,
        private CrmNotificationService $notif
    ) {
    }

    public function create(array $data): CrmLead
    {
        $lead = DB::connection('tenant')->transaction(function () use ($data) {
            $count = CrmLead::count() + 1;
            $data['code'] = 'LEAD-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
            $data['created_by'] = auth()->id();
            $data['tags'] = $data['tags'] ?? [];
            $lead = CrmLead::create($data);
            $lead->refresh();
            $this->scoring->recalculate($lead);
            $this->audit->logCreate($lead, 'lead');
            $this->automation->trigger('lead.created', $lead);
            return $lead;
        });
        if (!empty($lead->assigned_to)) {
            $this->notif->send($lead->assigned_to, 'lead',
                'New lead assigned: ' . $lead->name,
                null,
                ['entity_type' => CrmLead::class, 'entity_id' => $lead->id]
            );
        }
        return $lead;
    }

    public function update(CrmLead $lead, array $data): CrmLead
    {
        $old = $lead->getOriginal();
        $lead->update($data);
        $this->scoring->recalculate($lead->fresh());
        $this->audit->logUpdate($lead, $old, 'lead');
        if (isset($data['status']) && $data['status'] !== $old['status']) {
            $this->automation->trigger('lead.status_changed', $lead, ['from' => $old['status'], 'to' => $data['status']]);
        }
        if (isset($data['assigned_to']) && $data['assigned_to'] !== $old['assigned_to']) {
            $this->automation->trigger('lead.assigned', $lead);
        }
        return $lead->fresh();
    }

    public function convert(CrmLead $lead, array $options): array
    {
        return DB::connection('tenant')->transaction(function () use ($lead, $options) {
            $customer = null;
            $contact = null;
            $deal = null;

            if (!empty($options['customer_id'])) {
                $customer = CrmCustomer::find($options['customer_id']);
            } elseif (!empty($options['create_customer']) !== false) {
                $customer = CrmCustomer::firstOrCreate(
                    ['email' => $lead->email ?? 'unknown@noemail.local'],
                    [
                        'name' => $lead->company ?? $lead->name,
                        'company' => $lead->company,
                        'phone' => $lead->phone,
                        'industry' => $lead->industry,
                        'address' => $lead->address,
                        'city' => $lead->city,
                        'state' => $lead->state,
                        'country' => $lead->country,
                        'postal_code' => $lead->postal_code,
                        'source' => $lead->source,
                        'type' => 'active',
                        'status' => 'active',
                        'assigned_to' => $lead->assigned_to,
                        'created_by' => auth()->id(),
                        'tags' => $lead->tags ?? [],
                    ]
                );
                if ($customer->wasRecentlyCreated) {
                    $count = CrmCustomer::count();
                    $customer->code = 'CUS-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT);
                    $customer->save();
                }
            }

            if (!empty($options['contact_id'])) {
                $contact = CrmContact::find($options['contact_id']);
            } elseif (!empty($options['create_contact']) !== false) {
                $nameParts = explode(' ', $lead->name ?? '', 2);
                $contact = CrmContact::create([
                    'customer_id' => $customer?->id,
                    'first_name' => $nameParts[0] ?? $lead->name,
                    'last_name' => $nameParts[1] ?? null,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'title' => $lead->job_title,
                    'status' => 'active',
                    'created_by' => auth()->id(),
                ]);
            }

            if (!empty($options['create_deal'])) {
                $pipeline = CrmPipeline::where('is_default', true)->first() ?? CrmPipeline::first();
                $stage = $pipeline?->stages()->orderBy('sort_order')->first();
                $deal = CrmDeal::create([
                    'name' => ($lead->company ?? $lead->name) . ' Deal',
                    'code' => 'DEAL-' . str_pad((string) (CrmDeal::count() + 1), 5, '0', STR_PAD_LEFT),
                    'customer_id' => $customer?->id,
                    'lead_id' => $lead->id,
                    'contact_id' => $contact?->id,
                    'pipeline_id' => $pipeline?->id,
                    'stage' => $stage?->name ?? 'lead',
                    'amount' => $lead->estimated_value ?? 0,
                    'probability' => $stage?->probability ?? 10,
                    'expected_close_date' => $lead->expected_close_date,
                    'source' => $lead->source,
                    'status' => 'open',
                    'priority' => 'medium',
                    'assigned_to' => $lead->assigned_to,
                    'created_by' => auth()->id(),
                ]);
            }

            $lead->update([
                'status' => 'converted',
                'converted_at' => now(),
                'customer_id' => $customer?->id,
                'converted_contact_id' => $contact?->id,
                'converted_deal_id' => $deal?->id,
            ]);

            $this->audit->logAction('converted', 'lead',
                sprintf('Lead converted (customer=%s, contact=%s, deal=%s)',
                    $customer?->id ?? 'none', $contact?->id ?? 'none', $deal?->id ?? 'none'),
                $lead
            );
            $this->automation->trigger('lead.converted', $lead);

            return [
                'lead' => $lead->fresh(),
                'customer' => $customer,
                'contact' => $contact,
                'deal' => $deal,
            ];
        });
    }
}