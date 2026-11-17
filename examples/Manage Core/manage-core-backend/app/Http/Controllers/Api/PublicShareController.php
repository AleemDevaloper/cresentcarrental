<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PublicShareController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Public Share Token Store
    |--------------------------------------------------------------------------
    | Tokens are random 48-char strings stored per entity type. They can be
    | expired via expires_at and revoked via the revoked flag. Each lookup
    | increments a "views" counter that is returned in the response.
    */

    private const SHARES_KEY = 'public_share_tokens';

    protected function loadShares(): array
    {
        $shares = Cache::get(self::SHARES_KEY);
        if ($shares === null) {
            $shares = [];
            Cache::forever(self::SHARES_KEY, $shares);
        }
        return $shares;
    }

    protected function saveShares(array $shares): void
    {
        Cache::forever(self::SHARES_KEY, $shares);
    }

    public function createShare(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|string|max:64',
            'entity_id' => 'required|integer',
            'expires_in_days' => 'nullable|integer|min:0|max:3650',
            'regenerate' => 'nullable|boolean',
        ]);

        $entityType = $validated['entity_type'];
        $entityId = (int)$validated['entity_id'];
        $regenerate = (bool)($validated['regenerate'] ?? false);

        $shares = $this->loadShares();

        // Reuse existing active share unless regenerate=1
        if (!$regenerate) {
            foreach ($shares as $share) {
                if (($share['entity_type'] ?? null) === $entityType
                    && (int)($share['entity_id'] ?? 0) === $entityId
                    && empty($share['revoked'])) {
                    return response()->json(['data' => ['share' => $share]]);
                }
            }
        }

        $expiresDays = (int)($request->input('expires_in_days') ?? 0);
        $share = [
            'token' => Str::random(48),
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'created_at' => now()->toIso8601String(),
            'expires_at' => $expiresDays > 0 ? now()->addDays($expiresDays)->toIso8601String() : null,
            'views' => 0,
            'revoked' => false,
            'created_by' => auth()->id(),
        ];

        // Strip previous active shares for this entity unless regenerating
        $shares = array_values(array_filter($shares, function ($s) use ($entityType, $entityId, $regenerate) {
            if ($regenerate) return true;
            return !(($s['entity_type'] ?? null) === $entityType && (int)($s['entity_id'] ?? 0) === $entityId);
        }));
        $shares[] = $share;
        $this->saveShares($shares);

        return response()->json(['message' => 'Share link created', 'data' => ['share' => $share]], 201);
    }

    public function revokeShare(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|string|max:64',
            'entity_id' => 'required|integer',
        ]);
        $shares = $this->loadShares();
        $found = false;
        foreach ($shares as &$share) {
            if (($share['entity_type'] ?? null) === $validated['entity_type']
                && (int)($share['entity_id'] ?? 0) === (int)$validated['entity_id']
                && empty($share['revoked'])) {
                $share['revoked'] = true;
                $share['revoked_at'] = now()->toIso8601String();
                $found = true;
            }
        }
        unset($share);
        if (!$found) return response()->json(['message' => 'No active share link for this entity'], 404);
        $this->saveShares($shares);
        return response()->json(['message' => 'Share link revoked']);
    }

    public function getPublicEntity(string $entityType, string $token): JsonResponse
    {
        $shares = $this->loadShares();
        $share = null;
        $shareIndex = -1;
        foreach ($shares as $idx => $s) {
            if (($s['entity_type'] ?? null) === $entityType && hash_equals((string)($s['token'] ?? ''), $token)) {
                $share = $s;
                $shareIndex = $idx;
                break;
            }
        }
        if (!$share || !empty($share['revoked'])) {
            return response()->json(['message' => 'This link is invalid or has been revoked.'], 404);
        }
        if (!empty($share['expires_at']) && now()->isAfter(\Carbon\Carbon::parse($share['expires_at']))) {
            return response()->json(['message' => 'This link has expired.'], 410);
        }

        $payload = match ($entityType) {
            'customer' => $this->buildCustomerPayload((int)$share['entity_id']),
            'sales_invoice' => $this->buildInvoicePayload((int)$share['entity_id']),
            'sales_order' => $this->buildSalesOrderPayload((int)$share['entity_id']),
            'quotation' => $this->buildQuotationPayload((int)$share['entity_id']),
            'delivery_challan' => $this->buildDeliveryChallanPayload((int)$share['entity_id']),
            'credit_note' => $this->buildCreditNotePayload((int)$share['entity_id']),
            'customer_receipt' => $this->buildCustomerReceiptPayload((int)$share['entity_id']),
            'vendor_payment' => $this->buildVendorPaymentPayload((int)$share['entity_id']),
            default => null,
        };

        if ($payload === null) {
            return response()->json(['message' => 'Entity not found'], 404);
        }

        // Bump view count
        $shares[$shareIndex]['views'] = (int)($share['views'] ?? 0) + 1;
        $this->saveShares($shares);

        return response()->json([
            'data' => array_merge($payload, [
                'entity_type' => $entityType,
                'shared_at' => $share['created_at'],
                'expires_at' => $share['expires_at'],
                'views' => $shares[$shareIndex]['views'],
            ]),
        ]);
    }

    // ----------------------- Entity Payloads -----------------------

    protected function buildCustomerPayload(int $customerId): ?array
    {
        $client = Client::find($customerId);
        if (!$client) return null;

        // Pull related sales data from FMS cache (cache key: fms_sales_orders, fms_sales_invoices, etc.)
        $orders = collect(Cache::get('fms_sales_orders') ?? $this->seedSalesOrders());
        $invoices = collect(Cache::get('fms_sales_invoices') ?? $this->seedSalesInvoices());
        $quotations = collect(Cache::get('fms_quotations') ?? $this->seedQuotations());

        $customerName = $client->company_name ?: $client->name;
        $matched = function ($row) use ($customerName, $client) {
            return strcasecmp((string)($row['customer'] ?? ''), (string)$customerName) === 0
                || (int)($row['client_id'] ?? 0) === (int)$client->id
                || strcasecmp((string)($row['customer'] ?? ''), (string)$client->name) === 0;
        };

        $relatedOrders = $orders->filter($matched)->values()->all();
        $relatedInvoices = $invoices->filter($matched)->values()->all();
        $relatedQuotations = $quotations->filter($matched)->values()->all();

        $outstanding = 0.0;
        foreach ($relatedInvoices as $inv) {
            if (strcasecmp($inv['status'] ?? '', 'paid') !== 0) {
                $outstanding += (float)($inv['amount'] ?? 0);
            }
        }

        return [
            'customer' => array_merge($client->toArray(), [
                'code' => 'CUST-' . str_pad($client->id, 4, '0', STR_PAD_LEFT),
                'outstanding' => $outstanding,
            ]),
            'orders' => $relatedOrders,
            'invoices' => $relatedInvoices,
            'quotations' => $relatedQuotations,
            'totals' => [
                'orders_count' => count($relatedOrders),
                'invoices_count' => count($relatedInvoices),
                'quotations_count' => count($relatedQuotations),
                'outstanding' => $outstanding,
            ],
        ];
    }

    protected function buildInvoicePayload(int $id): ?array
    {
        $items = Cache::get('fms_sales_invoices') ?? $this->seedSalesInvoices();
        $inv = collect($items)->firstWhere('id', $id);
        if (!$inv || (($inv['status'] ?? '') === 'Trash')) return null;
        return ['invoice' => $inv];
    }

    protected function buildSalesOrderPayload(int $id): ?array
    {
        $items = Cache::get('fms_sales_orders') ?? $this->seedSalesOrders();
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['sales_order' => $row];
    }

    protected function buildQuotationPayload(int $id): ?array
    {
        $items = Cache::get('fms_quotations') ?? $this->seedQuotations();
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['quotation' => $row];
    }

    protected function buildDeliveryChallanPayload(int $id): ?array
    {
        $items = Cache::get('fms_delivery_challans') ?? [];
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['delivery_challan' => $row];
    }

    protected function buildCreditNotePayload(int $id): ?array
    {
        $items = Cache::get('fms_credit_notes') ?? [];
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['credit_note' => $row];
    }

    protected function buildCustomerReceiptPayload(int $id): ?array
    {
        $items = Cache::get('fms_customer_receipts') ?? [];
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['receipt' => $row];
    }

    protected function buildVendorPaymentPayload(int $id): ?array
    {
        $items = Cache::get('fms_vendor_payments') ?? [];
        $row = collect($items)->firstWhere('id', $id);
        if (!$row) return null;
        return ['payment' => $row];
    }

    // ----------------------- Seed Fallbacks -----------------------
    // Mirrors FmsController seeds so that public views still work even
    // when the underlying cache key has not been initialised yet.

    protected function seedSalesOrders(): array
    {
        return [
            ['id' => 1, 'number' => 'SO-2026-0042', 'customer' => 'Acme Corporation', 'date' => '2026-06-20', 'deliveryDate' => '2026-07-10', 'amount' => 45000, 'currency' => 'USD', 'status' => 'Confirmed', 'items' => 3, 'salesPerson' => 'John Smith'],
            ['id' => 2, 'number' => 'SO-2026-0043', 'customer' => 'Stark Industries', 'date' => '2026-06-22', 'deliveryDate' => '2026-07-15', 'amount' => 128000, 'currency' => 'USD', 'status' => 'Processing', 'items' => 8, 'salesPerson' => 'Sarah Lee'],
            ['id' => 3, 'number' => 'SO-2026-0044', 'customer' => 'Wayne Enterprises', 'date' => '2026-06-25', 'deliveryDate' => '2026-07-20', 'amount' => 75000, 'currency' => 'USD', 'status' => 'Draft', 'items' => 4, 'salesPerson' => 'Mike Chen'],
        ];
    }

    protected function seedSalesInvoices(): array
    {
        return [
            ['id' => 1, 'number' => 'INV-2026-0098', 'customer' => 'Acme Corporation', 'date' => '2026-06-22', 'dueDate' => '2026-07-22', 'amount' => 12500, 'currency' => 'USD', 'status' => 'Sent', 'salesPerson' => 'John Smith'],
            ['id' => 2, 'number' => 'INV-2026-0099', 'customer' => 'Stark Industries', 'date' => '2026-06-24', 'dueDate' => '2026-07-24', 'amount' => 48000, 'currency' => 'USD', 'status' => 'Paid', 'salesPerson' => 'Sarah Lee'],
            ['id' => 3, 'number' => 'INV-2026-0100', 'customer' => 'Wayne Enterprises', 'date' => '2026-06-25', 'dueDate' => '2026-07-25', 'amount' => 18000, 'currency' => 'USD', 'status' => 'Sent', 'salesPerson' => 'Mike Chen'],
        ];
    }

    protected function seedQuotations(): array
    {
        return [
            ['id' => 1, 'number' => 'QTN-2026-0021', 'customer' => 'Acme Corporation', 'date' => '2026-06-18', 'validUntil' => '2026-07-18', 'amount' => 6500, 'currency' => 'USD', 'status' => 'Sent', 'items' => 2],
            ['id' => 2, 'number' => 'QTN-2026-0022', 'customer' => 'Stark Industries', 'date' => '2026-06-19', 'validUntil' => '2026-07-19', 'amount' => 22000, 'currency' => 'USD', 'status' => 'Accepted', 'items' => 4],
        ];
    }
}
