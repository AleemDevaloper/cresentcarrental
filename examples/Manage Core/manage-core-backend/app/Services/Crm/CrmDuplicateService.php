<?php

namespace App\Services\Crm;

use App\Models\CrmDuplicateGroup;
use App\Models\CrmDuplicateMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrmDuplicateService
{
    public function __construct(private CrmAuditService $audit)
    {
    }

    public function scan(string $entityClass, array $fieldConfig = null): int
    {
        $fieldConfig = $fieldConfig ?: $this->defaultFieldsFor($entityClass);

        $table = (new $entityClass)->getTable();
        $groupsCreated = 0;

        foreach ($fieldConfig as $field) {
            $rows = DB::connection('tenant')->table($table)
                ->select('id', $field)
                ->whereNotNull($field)
                ->where($field, '!=', '')
                ->get();

            $byValue = [];
            foreach ($rows as $r) {
                $key = strtolower(trim((string) $r->{$field}));
                if (!$key) continue;
                $byValue[$key][] = $r->id;
            }

            foreach ($byValue as $value => $ids) {
                if (count($ids) < 2) continue;

                $signature = [strtolower($field) . ':' . $value];

                $existingGroup = CrmDuplicateGroup::where('entity_type', $entityClass)
                    ->where('match_field', $field)
                    ->where('match_value', $value)
                    ->where('status', 'open')
                    ->first();
                if ($existingGroup) {
                    $existingGroup->member_count = count($ids);
                    $existingGroup->save();
                    $group = $existingGroup;
                } else {
                    $group = CrmDuplicateGroup::create([
                        'entity_type' => $entityClass,
                        'field_signature' => $signature,
                        'match_field' => $field,
                        'match_value' => $value,
                        'member_count' => count($ids),
                        'status' => 'open',
                    ]);
                    $groupsCreated++;
                }

                foreach ($ids as $id) {
                    CrmDuplicateMember::updateOrCreate(
                        [
                            'group_id' => $group->id,
                            'entity_type' => $entityClass,
                            'entity_id' => $id,
                        ],
                        [
                            'match_score' => 100.0,
                            'field_matches' => [$field => $value],
                        ]
                    );
                }
            }
        }

        return $groupsCreated;
    }

    public function merge(string $entityClass, int $primaryId, array $duplicateIds, array $fieldOverrides = []): ?Model
    {
        return DB::connection('tenant')->transaction(function () use ($entityClass, $primaryId, $duplicateIds, $fieldOverrides) {
            $primary = $entityClass::find($primaryId);
            if (!$primary) return null;

            foreach ($duplicateIds as $dupId) {
                if ($dupId == $primaryId) continue;
                $dup = $entityClass::find($dupId);
                if (!$dup) continue;

                foreach ($dup->getAttributes() as $attr => $val) {
                    if (in_array($attr, ['id', 'created_at', 'updated_at', 'deleted_at'])) continue;
                    if ($primary->{$attr} === null && $val !== null) {
                        $primary->{$attr} = $val;
                    }
                }
                foreach ($fieldOverrides as $attr => $val) {
                    $primary->{$attr} = $val;
                }

                if (method_exists($primary, 'tags')) {
                    foreach ($dup->tags ?? [] as $tag) {
                        $primary->tags()->syncWithoutDetaching([$tag->id]);
                    }
                }

                $dup->delete();
            }
            $primary->save();

            $groups = CrmDuplicateGroup::where('entity_type', $entityClass)
                ->whereIn('id', CrmDuplicateMember::where('entity_type', $entityClass)
                    ->whereIn('entity_id', array_merge([$primaryId], $duplicateIds))
                    ->pluck('group_id')
                    ->unique())
                ->get();
            foreach ($groups as $g) {
                $g->update(['status' => 'resolved', 'resolved_at' => now(),
                    'primary_record_id' => $primaryId,
                    'resolved_by' => auth()->id(),
                ]);
            }

            $this->audit->logAction('merged', 'duplicates',
                "Merged " . count($duplicateIds) . " duplicate(s) into #{$primaryId}",
                $primary
            );

            return $primary->fresh();
        });
    }

    public function ignore(int $groupId): bool
    {
        $group = CrmDuplicateGroup::find($groupId);
        if (!$group) return false;
        $group->update(['status' => 'ignored']);
        CrmDuplicateMember::where('group_id', $groupId)->update(['is_ignored' => true]);
        return true;
    }

    public function markNotDuplicate(int $groupId): bool
    {
        return $this->ignore($groupId);
    }

    public function defaultFieldsFor(string $entityClass): array
    {
        return match ($entityClass) {
            \App\Models\CrmLead::class => ['email', 'phone', 'company'],
            \App\Models\CrmContact::class => ['email', 'phone'],
            \App\Models\CrmCustomer::class => ['email', 'phone', 'website', 'name'],
            default => ['email'],
        };
    }
}