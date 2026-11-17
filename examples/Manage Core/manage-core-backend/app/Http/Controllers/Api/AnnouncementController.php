<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AnnouncementAuditLog;
use App\Models\AnnouncementReceipt;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        if ($request->boolean('manage') && $this->canManageAnnouncements($request)) {
            return response()->json([
                'data' => $this->manageableAnnouncements($request)
                    ->withCount(['receipts as read_count' => fn ($query) => $query->whereNotNull('read_at')])
                    ->latest()
                    ->paginate((int) $request->input('per_page', 20)),
            ]);
        }

        return response()->json([
            'data' => $this->visibleAnnouncements($request)->latest('published_at')->get(),
        ]);
    }

    public function stats(Request $request)
    {
        $this->authorizeManagement($request);
        $announcements = $this->manageableAnnouncements($request);
        $announcementIds = (clone $announcements)->select('id');

        $total = (clone $announcements)->count();
        $active = (clone $announcements)->where('status', 'published')->where(function ($query) {
            $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
        })->count();
        $read = AnnouncementReceipt::whereIn('announcement_id', $announcementIds)->whereNotNull('read_at')->count();
        $delivered = AnnouncementReceipt::whereIn('announcement_id', $announcementIds)->count();

        return response()->json([
            'data' => [
                'total' => $total,
                'active' => $active,
                'scheduled' => (clone $announcements)->where('status', 'scheduled')->count(),
                'expired' => (clone $announcements)->where('expires_at', '<=', now())->count(),
                'emergency' => (clone $announcements)->whereIn('type', ['emergency', 'critical'])->count(),
                'maintenance' => (clone $announcements)->whereIn('type', ['maintenance', 'planned_maintenance', 'downtime'])->count(),
                'drafts' => (clone $announcements)->where('status', 'draft')->count(),
                'companies_covered' => $this->companiesCovered($request),
                'employees_reached' => $delivered,
                'read_percentage' => $delivered > 0 ? round(($read / $delivered) * 100, 1) : 0,
                'pending_acknowledgements' => AnnouncementReceipt::whereIn('announcement_id', $announcementIds)->whereNull('acknowledged_at')->count(),
                'type_distribution' => (clone $announcements)->select('type', DB::raw('count(*) as total'))->groupBy('type')->pluck('total', 'type'),
                'recent_activity' => AnnouncementAuditLog::whereIn('announcement_id', $announcementIds)->latest()->limit(8)->get(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeManagement($request);

        $data = $this->validatedData($request);
        $this->applyTenantBoundary($request, $data);
        $data['created_by'] = $request->user()?->id;
        $data['published_at'] = $data['status'] === 'published' ? now() : ($data['published_at'] ?? null);

        $announcement = Announcement::create($data);
        $this->audit($announcement, $request, 'created', 'Announcement created.', null, $announcement->toArray());

        if ($announcement->status === 'published') {
            $this->seedTenantReceipts($announcement);
        }

        return response()->json(['data' => $announcement], 201);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $this->authorizeManagement($request);
        $this->authorizeAnnouncementMutation($request, $announcement);

        $before = $announcement->toArray();
        $data = $this->validatedData($request, true);
        $this->applyTenantBoundary($request, $data);
        if (($data['status'] ?? null) === 'published' && !$announcement->published_at) {
            $data['published_at'] = now();
        }

        $announcement->update($data);
        $this->audit($announcement, $request, 'updated', 'Announcement updated.', $before, $announcement->fresh()->toArray());

        if ($announcement->status === 'published') {
            $this->seedTenantReceipts($announcement);
        }

        return response()->json(['data' => $announcement->fresh()]);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        $this->authorizeManagement($request);
        $this->authorizeAnnouncementMutation($request, $announcement);
        $before = $announcement->toArray();
        $announcement->delete();
        $this->audit($announcement, $request, 'deleted', 'Announcement deleted.', $before, null);

        return response()->json(['message' => 'Announcement deleted.']);
    }

    public function markRead(Request $request, Announcement $announcement)
    {
        $receipt = $this->receiptFor($request, $announcement);
        $receipt->update([
            'opened_at' => $receipt->opened_at ?? now(),
            'read_at' => $receipt->read_at ?? now(),
            'ip_address' => $request->ip(),
            'browser' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return response()->json(['data' => $receipt->fresh()]);
    }

    public function acknowledge(Request $request, Announcement $announcement)
    {
        $receipt = $this->receiptFor($request, $announcement);
        $receipt->update([
            'opened_at' => $receipt->opened_at ?? now(),
            'read_at' => $receipt->read_at ?? now(),
            'acknowledged_at' => now(),
            'ip_address' => $request->ip(),
            'browser' => substr((string) $request->userAgent(), 0, 255),
        ]);

        $this->audit($announcement, $request, 'acknowledged', 'Announcement acknowledged by recipient.');

        return response()->json(['data' => $receipt->fresh()]);
    }

    public function tenants(Request $request)
    {
        $this->authorizeManagement($request);
        $query = Tenant::query();
        if (!$this->isSuperAdmin($request)) {
            $tenantId = $this->currentTenantId();
            abort_unless($tenantId, 403);
            $query->whereKey($tenantId);
        }

        return response()->json([
            'data' => $query->orderBy('name')->get(['id', 'name', 'domain', 'status']),
        ]);
    }

    protected function validatedData(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:80'],
            'priority' => ['nullable', 'string', 'max:80'],
            'severity_color' => ['nullable', 'string', 'max:30'],
            'status' => ['nullable', 'string', 'in:draft,scheduled,published,archived,cancelled,expired'],
            'is_platform_wide' => ['boolean'],
            'target_tenant_ids' => ['nullable', 'array'],
            'target_tenant_ids.*' => ['integer'],
            'target_roles' => ['nullable', 'array'],
            'target_departments' => ['nullable', 'array'],
            'module_visibility' => ['nullable', 'array'],
            'placements' => ['nullable', 'array'],
            'delivery_channels' => ['nullable', 'array'],
            'actions' => ['nullable', 'array'],
            'attachments' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],
            'requires_acknowledgement' => ['boolean'],
            'requires_read_confirmation' => ['boolean'],
            'dismissible' => ['boolean'],
            'scheduled_at' => ['nullable', 'date'],
            'published_at' => ['nullable', 'date'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'timezone' => ['nullable', 'string', 'max:80'],
        ]);
    }

    protected function visibleAnnouncements(Request $request)
    {
        $tenant = app()->bound('tenant') ? app('tenant') : null;
        $role = $request->user()?->role;
        $roleVariants = array_values(array_unique(array_filter([
            $role,
            strtolower((string) $role),
            ucfirst(strtolower((string) $role)),
        ])));

        return Announcement::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($query) use ($tenant) {
                $query->where('is_platform_wide', true);
                if ($tenant) {
                    $query->orWhereJsonContains('target_tenant_ids', $tenant->id);
                }
            })
            ->where(function ($query) use ($roleVariants) {
                $query->whereNull('target_roles');
                $query->orWhere('target_roles', '[]');
                $query->orWhere('target_roles', '[""]');
                foreach ($roleVariants as $roleVariant) {
                    $query->orWhereJsonContains('target_roles', $roleVariant);
                }
            });
    }

    protected function receiptFor(Request $request, Announcement $announcement): AnnouncementReceipt
    {
        $tenant = app()->bound('tenant') ? app('tenant') : null;

        return AnnouncementReceipt::firstOrCreate([
            'announcement_id' => $announcement->id,
            'tenant_id' => $tenant?->id,
            'user_id' => $request->user()?->id,
        ], [
            'delivered_at' => now(),
        ]);
    }

    protected function seedTenantReceipts(Announcement $announcement): void
    {
        $tenantIds = $announcement->is_platform_wide
            ? Tenant::pluck('id')->all()
            : ($announcement->target_tenant_ids ?? []);

        foreach ($tenantIds as $tenantId) {
            AnnouncementReceipt::firstOrCreate([
                'announcement_id' => $announcement->id,
                'tenant_id' => $tenantId,
                'user_id' => null,
            ], [
                'delivered_at' => now(),
            ]);
        }
    }

    protected function companiesCovered(Request $request): int
    {
        if (!$this->isSuperAdmin($request)) {
            return $this->currentTenantId() ? 1 : 0;
        }

        $ids = [];
        foreach (Announcement::where('is_platform_wide', false)->get('target_tenant_ids') as $announcement) {
            $ids = array_merge($ids, $announcement->target_tenant_ids ?? []);
        }

        if (Announcement::where('is_platform_wide', true)->exists()) {
            return Tenant::count();
        }

        return count(array_unique($ids));
    }

    protected function audit(Announcement $announcement, Request $request, string $action, string $message, ?array $before = null, ?array $after = null): void
    {
        AnnouncementAuditLog::create([
            'announcement_id' => $announcement->id,
            'actor_id' => $request->user()?->id,
            'action' => $action,
            'message' => $message,
            'before' => $before,
            'after' => $after,
        ]);
    }

    protected function isSuperAdmin(Request $request): bool
    {
        return (bool) $request->user()?->hasRole('super_admin');
    }

    protected function canManageAnnouncements(Request $request): bool
    {
        $user = $request->user();

        return (bool) $user && ($user->hasRole('admin') || $user->hasRole('super_admin'));
    }

    protected function authorizeManagement(Request $request): void
    {
        abort_unless($this->canManageAnnouncements($request), 403);

        if (!$this->isSuperAdmin($request)) {
            abort_unless($this->currentTenantId(), 403);
        }
    }

    protected function currentTenantId(): ?int
    {
        return app()->bound('tenant') ? (int) app('tenant')->id : null;
    }

    protected function manageableAnnouncements(Request $request)
    {
        if ($this->isSuperAdmin($request)) {
            return Announcement::query();
        }

        $tenantId = $this->currentTenantId();

        return Announcement::query()->where(function ($query) use ($tenantId) {
            $query->where('is_platform_wide', true)
                ->orWhereJsonContains('target_tenant_ids', $tenantId);
        });
    }

    protected function authorizeAnnouncementMutation(Request $request, Announcement $announcement): void
    {
        if ($this->isSuperAdmin($request)) {
            return;
        }

        $tenantId = $this->currentTenantId();
        abort_unless(
            $tenantId
            && !$announcement->is_platform_wide
            && in_array($tenantId, array_map('intval', $announcement->target_tenant_ids ?? []), true),
            403
        );
    }

    protected function applyTenantBoundary(Request $request, array &$data): void
    {
        if ($this->isSuperAdmin($request)) {
            return;
        }

        $tenantId = $this->currentTenantId();
        abort_unless($tenantId, 403);
        $data['is_platform_wide'] = false;
        $data['target_tenant_ids'] = [$tenantId];
    }
}
