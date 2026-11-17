<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Writer\Word2007;
use PhpOffice\PhpWord\TemplateProcessor;

class FmsController extends Controller
{
    private const TRASH_CACHE_KEY = 'fms_trash_items';
    private const DRAFT_ENTITIES = ['Fiscal Year', 'Quotation', 'Sales Order', 'Sales Invoice', 'Credit Note'];

    private function db(): \Illuminate\Database\Connection
    {
        return \DB::connection('tenant');
    }

    protected function getDraftItems(): array
    {
        $drafts = [];

        $cacheMappings = [
            self::QUOTATIONS_CACHE_KEY => ['type' => 'Quotation', 'entityType' => 'quotation'],
            self::SALES_ORDERS_CACHE_KEY => ['type' => 'Sales Order', 'entityType' => 'sales-order'],
            self::DELIVERY_CHALLANS_CACHE_KEY => ['type' => 'Delivery Challan', 'entityType' => 'delivery-challan'],
            self::SALES_INVOICES_CACHE_KEY => ['type' => 'Sales Invoice', 'entityType' => 'sales-invoice'],
            self::CREDIT_NOTES_CACHE_KEY => ['type' => 'Credit Note', 'entityType' => 'credit-note'],
            self::SALES_RETURNS_CACHE_KEY => ['type' => 'Sales Return', 'entityType' => 'sales-return'],
        ];

        foreach ($cacheMappings as $cacheKey => $meta) {
            $items = Cache::get($cacheKey, []);
            foreach ($items as $item) {
                if (($item['status'] ?? '') === 'Draft') {
                    $drafts[] = [
                        'id' => $meta['type'] . '-' . $item['id'],
                        'type' => $meta['type'],
                        'code' => $item['number'] ?? '',
                        'title' => $item['customer'] ?? '',
                        'createdBy' => $item['salesPerson'] ?? auth()->user()?->name ?? 'System',
                        'createdDate' => $item['date'] ?? now()->toDateString(),
                        'value' => isset($item['amount']) ? '$' . number_format((float)$item['amount'], 2) : '$0.00',
                        'entityType' => $meta['entityType'],
                    ];
                }
            }
        }

        return $drafts;
    }

    public function getDrafts(): JsonResponse
    {
        $drafts = $this->getDraftItems();
        $totalValue = 0;
        foreach ($drafts as $d) {
            $num = (float) preg_replace('/[^0-9.]/', '', str_replace(',', '', $d['value'] ?? '0'));
            $totalValue += $num;
        }
        $stats = [
            'total_drafts' => count($drafts),
            'total_value' => '$' . number_format($totalValue, 2),
            'by_type' => collect($drafts)->groupBy('type')->map->count()->toArray(),
        ];
        return response()->json(['data' => $drafts, 'stats' => $stats]);
    }

    public function getTrash(): JsonResponse
    {
        $trash = Cache::get(self::TRASH_CACHE_KEY, []);
        $stats = [
            'total_trashed' => count($trash),
            'total_value' => '$0.00',
            'recoverable_value' => '$0.00',
        ];
        if (!empty($trash)) {
            $values = array_map(fn($t) => (float) preg_replace('/[^0-9.]/', '', str_replace(',', '', $t['value'] ?? '0')), $trash);
            $stats['total_value'] = '$' . number_format(array_sum($values), 2);
            $stats['recoverable_value'] = '$' . number_format(array_sum($values), 2);
        }
        return response()->json(['data' => $trash, 'stats' => $stats]);
    }

    public function moveToTrash(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'code' => 'required|string',
            'title' => 'required|string',
            'value' => 'nullable|string',
        ]);

        $trash = Cache::get(self::TRASH_CACHE_KEY, []);
        $trash[] = [
            'id' => uniqid(),
            'type' => $validated['type'],
            'code' => $validated['code'],
            'title' => $validated['title'],
            'value' => $validated['value'] ?? '$0.00',
            'deletedBy' => auth()->user()?->name ?? 'Admin User',
            'deleteDate' => now()->toDateString(),
            'daysRemaining' => '30 Days',
        ];
        Cache::forever(self::TRASH_CACHE_KEY, $trash);

        return response()->json(['message' => 'Item moved to trash', 'data' => end($trash)]);
    }

    public function restoreTrash($id): JsonResponse
    {
        $trash = Cache::get(self::TRASH_CACHE_KEY, []);
        $trash = array_values(array_filter($trash, fn($t) => $t['id'] !== $id));
        Cache::forever(self::TRASH_CACHE_KEY, $trash);
        return response()->json(['message' => 'Item restored successfully']);
    }

    public function forceDeleteTrash($id): JsonResponse
    {
        $trash = Cache::get(self::TRASH_CACHE_KEY, []);
        $trash = array_values(array_filter($trash, fn($t) => $t['id'] !== $id));
        Cache::forever(self::TRASH_CACHE_KEY, $trash);
        return response()->json(['message' => 'Item permanently deleted']);
    }

    public function purgeAllTrash(): JsonResponse
    {
        Cache::forget(self::TRASH_CACHE_KEY);
        return response()->json(['message' => 'All trash items permanently purged']);
    }
    // ========================
    // Dashboard
    // ========================
    public function dashboard(): JsonResponse
    {
        try {
            $now = now();
            $startOfDay = $now->copy()->startOfDay();
            $endOfDay = $now->copy()->endOfDay();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            $totalAccounts = $this->db()->table('accounts')->count();
            $activeAccounts = $this->db()->table('accounts')->where('status', 'active')->count();
            $totalFiscalYears = $this->db()->table('fiscal_years')->count();
            $openFiscalYears = $this->db()->table('fiscal_years')->where('status', 'open')->count();
            $openPeriods = $this->db()->table('fiscal_periods')->where('status', 'open')->count();

            $totalReceivable = 0;
            $totalPayable = 0;
            if (\Schema::hasTable('opening_balances')) {
                $totalReceivable = (float) $this->db()->table('opening_balances')->where('account_type', 'receivable')->sum('amount');
                $totalPayable = (float) $this->db()->table('opening_balances')->where('account_type', 'payable')->sum('amount');
            }

            $todaySales = 0;
            $todayReceipts = 0;
            $todayPayments = 0;
            if (\Schema::hasTable('receipts')) {
                $todayReceipts = (float) $this->db()->table('receipts')->whereBetween('date', [$startOfDay->toDateString(), $endOfDay->toDateString()])->sum('amount');
            }
            if (\Schema::hasTable('vendor_payments')) {
                $todayPayments = (float) $this->db()->table('vendor_payments')->whereBetween('payment_date', [$startOfDay->toDateString(), $endOfDay->toDateString()])->sum('amount');
            }

            $overdueCount = 0;
            $pendingApprovals = 0;
            if (\Schema::hasTable('approval_requests')) {
                $pendingApprovals = $this->db()->table('approval_requests')->where('status', 'pending')->count();
            }

            $topCustomers = [];
            if (\Schema::hasTable('clients')) {
                $topCustomers = $this->db()->table('clients')
                    ->orderBy('id', 'desc')
                    ->limit(5)
                    ->get(['id', 'name', 'email'])
                    ->map(fn($c) => ['id' => $c->id, 'name' => $c->name, 'email' => $c->email])
                    ->toArray();
            }

            $recentInvoices = [];
            if (\Schema::hasTable('receipts')) {
                $recentInvoices = $this->db()->table('receipts')
                    ->orderBy('id', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(fn($r) => [
                        'id' => $r->id,
                        'number' => $r->number ?? $r->receipt_no ?? ('RCP-' . $r->id),
                        'customer_name' => $r->customer_name ?? 'Customer',
                        'amount' => (float) ($r->amount ?? 0),
                        'date' => $r->date ?? $r->created_at,
                        'status' => $r->status ?? 'Posted',
                    ])
                    ->toArray();
            }

            return response()->json([
                'total_fiscal_years' => $totalFiscalYears,
                'open_fiscal_years' => $openFiscalYears,
                'open_periods' => $openPeriods,
                'total_accounts' => $totalAccounts,
                'active_accounts' => $activeAccounts,
                'total_receivable' => $totalReceivable,
                'total_payable' => $totalPayable,
                'today_sales' => $todaySales,
                'today_receipts' => $todayReceipts,
                'today_payments' => $todayPayments,
                'overdue_invoices_count' => $overdueCount,
                'pending_approvals' => $pendingApprovals,
                'audit_health' => $totalAccounts > 0 ? min(100, round(($activeAccounts / max(1, $totalAccounts)) * 100)) : 98,
                'top_customers' => $topCustomers,
                'recent_receipts' => $recentInvoices,
                'last_updated' => $now->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Dashboard data unavailable',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // ========================
    // Currencies
    // ========================
    public function listCurrencies(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'exchangeRate' => 1.0000, 'isBase' => true, 'status' => 'active'],
            ['id' => 2, 'code' => 'EUR', 'name' => 'Euro', 'symbol' => '€', 'exchangeRate' => 0.9200, 'isBase' => false, 'status' => 'active'],
            ['id' => 3, 'code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£', 'exchangeRate' => 0.7900, 'isBase' => false, 'status' => 'active'],
        ]]);
    }

    public function getCurrency($id): JsonResponse
    {
        return response()->json(['data' => ['id' => (int)$id, 'code' => 'USD', 'name' => 'US Dollar']]);
    }

    public function createCurrency(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Currency created', 'data' => ['id' => 4]], 201);
    }

    public function updateCurrency(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Currency updated']);
    }

    public function deleteCurrency($id): JsonResponse
    {
        return response()->json(['message' => 'Currency deleted']);
    }

    // ========================
    // Exchange Rates
    // ========================
    public function listExchangeRates(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'from' => 'USD', 'to' => 'EUR', 'rate' => 0.9200, 'date' => '2026-07-03'],
            ['id' => 2, 'from' => 'USD', 'to' => 'GBP', 'rate' => 0.7900, 'date' => '2026-07-03'],
            ['id' => 3, 'from' => 'EUR', 'to' => 'USD', 'rate' => 1.0870, 'date' => '2026-07-03'],
        ]]);
    }

    public function getExchangeRate($id): JsonResponse
    {
        return response()->json(['data' => ['id' => (int)$id]]);
    }

    public function createExchangeRate(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Exchange rate created', 'data' => ['id' => 4]], 201);
    }

    public function updateExchangeRate(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Exchange rate updated']);
    }

    public function deleteExchangeRate($id): JsonResponse
    {
        return response()->json(['message' => 'Exchange rate deleted']);
    }

    // ========================
    // Fiscal Years
    // ========================
    public function listFiscalYears(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'name' => 'Fiscal Year 2026', 'code' => 'FY2025-26', 'start' => '2025-07-01', 'end' => '2026-06-30', 'duration' => '12 Months', 'periods' => 12, 'status' => 'Open', 'current' => true, 'creator' => 'Finance Admin', 'created' => '2025-07-05', 'updated' => '2026-07-01'],
            ['id' => 2, 'name' => 'Fiscal Year 2025', 'code' => 'FY2024-25', 'start' => '2024-07-01', 'end' => '2025-06-30', 'duration' => '12 Months', 'periods' => 12, 'status' => 'Closed', 'current' => false, 'creator' => 'Super Admin', 'created' => '2024-07-02', 'updated' => '2025-06-30'],
            ['id' => 3, 'name' => 'Fiscal Year 2027 (Draft)', 'code' => 'FY2026-27', 'start' => '2026-07-01', 'end' => '2027-06-30', 'duration' => '12 Months', 'periods' => 12, 'status' => 'Draft', 'current' => false, 'creator' => 'Finance Admin', 'created' => '2026-06-28', 'updated' => '2026-07-02'],
        ]]);
    }

    public function getFiscalYear($id): JsonResponse
    {
        return response()->json(['data' => [
            'id' => (int)$id, 'name' => 'Fiscal Year 2026', 'code' => 'FY2025-26', 'start' => '2025-07-01', 'end' => '2026-06-30', 'duration' => '12 Months', 'periods' => 12, 'status' => 'Open', 'current' => true,
        ]]);
    }

    public function createFiscalYear(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Fiscal year created', 'data' => ['id' => 4]], 201);
    }

    public function updateFiscalYear(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Fiscal year updated']);
    }

    public function deleteFiscalYear($id): JsonResponse
    {
        return response()->json(['message' => 'Fiscal year deleted']);
    }

    public function closeFiscalYear(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Fiscal year closed successfully']);
    }

    // ========================
    // Fiscal Periods
    // ========================
    public function listFiscalPeriods($fiscalYearId): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'name' => 'Period 1 (July)', 'start' => '2025-07-01', 'end' => '2025-07-31', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 2, 'name' => 'Period 2 (August)', 'start' => '2025-08-01', 'end' => '2025-08-31', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 3, 'name' => 'Period 3 (September)', 'start' => '2025-09-01', 'end' => '2025-09-30', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 4, 'name' => 'Period 4 (October)', 'start' => '2025-10-01', 'end' => '2025-10-31', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 5, 'name' => 'Period 5 (November)', 'start' => '2025-11-01', 'end' => '2025-11-30', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 6, 'name' => 'Period 6 (December)', 'start' => '2025-12-01', 'end' => '2025-12-31', 'status' => 'Closed', 'postingAllowed' => 'No'],
            ['id' => 7, 'name' => 'Period 7 (January)', 'start' => '2026-01-01', 'end' => '2026-01-31', 'status' => 'Open', 'postingAllowed' => 'Yes'],
            ['id' => 8, 'name' => 'Period 8 (February)', 'start' => '2026-02-01', 'end' => '2026-02-28', 'status' => 'Open', 'postingAllowed' => 'Yes'],
            ['id' => 9, 'name' => 'Period 9 (March)', 'start' => '2026-03-01', 'end' => '2026-03-31', 'status' => 'Open', 'postingAllowed' => 'Yes'],
            ['id' => 10, 'name' => 'Period 10 (April)', 'start' => '2026-04-01', 'end' => '2026-04-30', 'status' => 'Open', 'postingAllowed' => 'Yes'],
            ['id' => 11, 'name' => 'Period 11 (May)', 'start' => '2026-05-01', 'end' => '2026-05-31', 'status' => 'Open', 'postingAllowed' => 'Yes'],
            ['id' => 12, 'name' => 'Period 12 (June)', 'start' => '2026-06-01', 'end' => '2026-06-30', 'status' => 'Open', 'postingAllowed' => 'Yes'],
        ]]);
    }

    public function lockFiscalPeriod(Request $request, $fiscalYearId, $periodId): JsonResponse
    {
        return response()->json(['message' => 'Period locked']);
    }

    public function unlockFiscalPeriod(Request $request, $fiscalYearId, $periodId): JsonResponse
    {
        return response()->json(['message' => 'Period unlocked']);
    }

    // ========================
    // Account Types
    // ========================
    public function listAccountTypes(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'name' => 'Asset', 'code' => '1', 'normalBalance' => 'Debit', 'description' => 'Resources controlled by the entity', 'color' => '#10b981', 'icon' => 'fa-building-columns', 'isSystem' => true, 'sortOrder' => 1, 'status' => 'active', 'totalAccounts' => 15, 'created' => '2025-01-01'],
            ['id' => 2, 'name' => 'Liability', 'code' => '2', 'normalBalance' => 'Credit', 'description' => 'Obligations arising from past transactions', 'color' => '#f59e0b', 'icon' => 'fa-credit-card', 'isSystem' => true, 'sortOrder' => 2, 'status' => 'active', 'totalAccounts' => 10, 'created' => '2025-01-01'],
            ['id' => 3, 'name' => 'Equity', 'code' => '3', 'normalBalance' => 'Credit', 'description' => 'Shareholder funds and retained earnings', 'color' => '#8b5cf6', 'icon' => 'fa-chart-pie', 'isSystem' => true, 'sortOrder' => 3, 'status' => 'active', 'totalAccounts' => 5, 'created' => '2025-01-01'],
            ['id' => 4, 'name' => 'Revenue', 'code' => '4', 'normalBalance' => 'Credit', 'description' => 'Income from primary business operations', 'color' => '#06b6d4', 'icon' => 'fa-chart-line', 'isSystem' => true, 'sortOrder' => 4, 'status' => 'active', 'totalAccounts' => 8, 'created' => '2025-01-01'],
            ['id' => 5, 'name' => 'Expense', 'code' => '5', 'normalBalance' => 'Debit', 'description' => 'Costs incurred in generating revenue', 'color' => '#f43f5e', 'icon' => 'fa-cart-shopping', 'isSystem' => true, 'sortOrder' => 5, 'status' => 'active', 'totalAccounts' => 12, 'created' => '2025-01-01'],
            ['id' => 6, 'name' => 'Contra Account', 'code' => '6', 'normalBalance' => 'Opposite', 'description' => 'Offsets related accounts', 'color' => '#ec4899', 'icon' => 'fa-arrows-rotate', 'isSystem' => false, 'sortOrder' => 6, 'status' => 'inactive', 'totalAccounts' => 2, 'created' => '2025-06-15'],
        ]]);
    }

    public function getAccountType($id): JsonResponse
    {
        return response()->json(['data' => ['id' => (int)$id, 'name' => 'Asset', 'code' => '1']]);
    }

    public function createAccountType(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Account type created', 'data' => ['id' => 7]], 201);
    }

    public function updateAccountType(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Account type updated']);
    }

    public function deleteAccountType($id): JsonResponse
    {
        return response()->json(['message' => 'Account type deleted']);
    }

    // ========================
    // Account Groups
    // ========================
    public function listAccountGroups(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'name' => 'Current Assets', 'code' => '101', 'typeId' => 1, 'typeName' => 'Asset', 'parentId' => null, 'parentName' => '—', 'description' => 'Short-term assets expected to convert within 12 months', 'color' => '#10b981', 'icon' => 'fa-coins', 'totalAccounts' => 3, 'totalTransactions' => 1428, 'sortOrder' => 1, 'status' => 'active', 'created' => '2025-01-01'],
            ['id' => 2, 'name' => 'Non Current Assets', 'code' => '102', 'typeId' => 1, 'typeName' => 'Asset', 'parentId' => null, 'parentName' => '—', 'description' => 'Long-term assets with useful life > 12 months', 'color' => '#059669', 'icon' => 'fa-building', 'totalAccounts' => 4, 'totalTransactions' => 876, 'sortOrder' => 2, 'status' => 'active', 'created' => '2025-01-01'],
            ['id' => 3, 'name' => 'Current Liabilities', 'code' => '201', 'typeId' => 2, 'typeName' => 'Liability', 'parentId' => null, 'parentName' => '—', 'description' => 'Obligations due within 12 months', 'color' => '#f59e0b', 'icon' => 'fa-credit-card', 'totalAccounts' => 3, 'totalTransactions' => 2156, 'sortOrder' => 3, 'status' => 'active', 'created' => '2025-01-01'],
            ['id' => 4, 'name' => 'Direct Revenue', 'code' => '401', 'typeId' => 4, 'typeName' => 'Revenue', 'parentId' => null, 'parentName' => '—', 'description' => 'Revenue from core business operations', 'color' => '#06b6d4', 'icon' => 'fa-chart-line', 'totalAccounts' => 2, 'totalTransactions' => 3402, 'sortOrder' => 4, 'status' => 'active', 'created' => '2025-01-01'],
            ['id' => 5, 'name' => 'Operating Expenses', 'code' => '501', 'typeId' => 5, 'typeName' => 'Expense', 'parentId' => null, 'parentName' => '—', 'description' => 'Costs directly tied to business operations', 'color' => '#f43f5e', 'icon' => 'fa-cart-shopping', 'totalAccounts' => 5, 'totalTransactions' => 4720, 'sortOrder' => 5, 'status' => 'active', 'created' => '2025-01-01'],
        ]]);
    }

    public function getAccountGroup($id): JsonResponse
    {
        return response()->json(['data' => ['id' => (int)$id, 'name' => 'Current Assets']]);
    }

    public function createAccountGroup(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Account group created', 'data' => ['id' => 6]], 201);
    }

    public function updateAccountGroup(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Account group updated']);
    }

    public function deleteAccountGroup($id): JsonResponse
    {
        return response()->json(['message' => 'Account group deleted']);
    }

    // ========================
    // Chart of Accounts
    // ========================
    public function listChartOfAccounts(): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'code' => '1001-01', 'name' => 'Cash Vault Dublin', 'type' => 'Asset', 'typeId' => 1, 'group' => 'Current Assets', 'groupId' => 1, 'normalBalance' => 'Debit', 'balance' => 2500000, 'status' => 'active', 'systemLocked' => true, 'currency' => 'USD', 'openingBalance' => 2000000, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 2, 'code' => '1002-01', 'name' => 'Silicon Valley Bank', 'type' => 'Asset', 'typeId' => 1, 'group' => 'Current Assets', 'groupId' => 1, 'normalBalance' => 'Debit', 'balance' => 4800000, 'status' => 'active', 'systemLocked' => true, 'currency' => 'USD', 'openingBalance' => 4500000, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 3, 'code' => '2001-01', 'name' => 'Accounts Payable', 'type' => 'Liability', 'typeId' => 2, 'group' => 'Current Liabilities', 'groupId' => 3, 'normalBalance' => 'Credit', 'balance' => 890000, 'status' => 'active', 'systemLocked' => true, 'currency' => 'USD', 'openingBalance' => 750000, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 4, 'code' => '3001-01', 'name' => 'Retained Earnings Control', 'type' => 'Equity', 'typeId' => 3, 'group' => '—', 'groupId' => null, 'normalBalance' => 'Credit', 'balance' => 8700000, 'status' => 'active', 'systemLocked' => true, 'currency' => 'USD', 'openingBalance' => 8000000, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 5, 'code' => '4001-01', 'name' => 'Software Sales Revenue', 'type' => 'Revenue', 'typeId' => 4, 'group' => 'Direct Revenue', 'groupId' => 4, 'normalBalance' => 'Credit', 'balance' => 5200000, 'status' => 'active', 'systemLocked' => false, 'currency' => 'USD', 'openingBalance' => 0, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 6, 'code' => '5001-01', 'name' => 'Vendor Cost of Goods', 'type' => 'Expense', 'typeId' => 5, 'group' => 'Operating Expenses', 'groupId' => 5, 'normalBalance' => 'Debit', 'balance' => 2400000, 'status' => 'active', 'systemLocked' => true, 'currency' => 'USD', 'openingBalance' => 0, 'created' => '2025-01-01', 'updated' => '2026-07-01'],
            ['id' => 7, 'code' => '1001-02', 'name' => 'Petty Cash Fund', 'type' => 'Asset', 'typeId' => 1, 'group' => 'Current Assets', 'groupId' => 1, 'normalBalance' => 'Debit', 'balance' => 25000, 'status' => 'active', 'systemLocked' => false, 'currency' => 'USD', 'openingBalance' => 25000, 'created' => '2025-06-01', 'updated' => '2026-07-01'],
            ['id' => 8, 'code' => '5002-01', 'name' => 'Office Rent Expense', 'type' => 'Expense', 'typeId' => 5, 'group' => 'Operating Expenses', 'groupId' => 5, 'normalBalance' => 'Debit', 'balance' => 180000, 'status' => 'active', 'systemLocked' => false, 'currency' => 'USD', 'openingBalance' => 0, 'created' => '2025-01-01', 'updated' => '2026-06-30'],
        ]]);
    }

    public function getChartOfAccount($id): JsonResponse
    {
        return response()->json(['data' => ['id' => (int)$id, 'code' => '1001-01', 'name' => 'Cash Vault Dublin']]);
    }

    public function createChartOfAccount(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Account created', 'data' => ['id' => 9]], 201);
    }

    public function updateChartOfAccount(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'Account updated']);
    }

    public function deleteChartOfAccount($id): JsonResponse
    {
        return response()->json(['message' => 'Account deleted']);
    }

    // ========================
    // Opening Balances
    // ========================
    private const OPENING_BALANCES_CACHE_KEY = 'fms_opening_balances';

    /**
     * Cache backends may hydrate array records as stdClass instances. Keep the
     * controller contract array-based before any opening-balance mutation.
     */
    protected function normalizeOpeningBalances($balances): array
    {
        if ($balances instanceof \Traversable) {
            $balances = iterator_to_array($balances);
        }

        if (!is_array($balances)) {
            return [];
        }

        return array_values(array_map(static function ($balance): array {
            if ($balance instanceof \JsonSerializable) {
                $balance = $balance->jsonSerialize();
            }

            if (is_object($balance)) {
                $balance = get_object_vars($balance);
            }

            return is_array($balance) ? $balance : [];
        }, $balances));
    }

    protected function getInitialOpeningBalances(): array
    {
        $balances = [
            ['id' => 1, 'accountCode' => '1001-01', 'accountName' => 'Cash Vault Dublin', 'account' => '1001-01 - Cash Vault Dublin', 'type' => 'GL', 'debit' => 2000000, 'credit' => 0, 'customerName' => '—', 'status' => 'Posted', 'date' => '2025-07-01'],
            ['id' => 2, 'accountCode' => '1002-01', 'accountName' => 'Silicon Valley Bank', 'account' => '1002-01 - Silicon Valley Bank', 'type' => 'GL', 'debit' => 4500000, 'credit' => 0, 'customerName' => '—', 'status' => 'Posted', 'date' => '2025-07-01'],
            ['id' => 3, 'accountCode' => '2001-01', 'accountName' => 'Accounts Payable', 'account' => '2001-01 - Accounts Payable', 'type' => 'GL', 'debit' => 0, 'credit' => 750000, 'customerName' => '—', 'status' => 'Posted', 'date' => '2025-07-01'],
            ['id' => 4, 'accountCode' => '3001-01', 'accountName' => 'Retained Earnings Control', 'account' => '3001-01 - Retained Earnings Control', 'type' => 'GL', 'debit' => 0, 'credit' => 8000000, 'customerName' => '—', 'status' => 'Posted', 'date' => '2025-07-01'],
        ];

        try {
            $clients = \App\Models\Client::all();
            $nextId = 100;
            foreach ($clients as $client) {
                $displayName = $client->company_name ?: $client->name;
                $balances[] = [
                    'id' => $nextId++,
                    'clientDbId' => $client->id,
                    'accountCode' => 'CUST-' . str_pad($client->id, 3, '0', STR_PAD_LEFT),
                    'accountName' => $displayName,
                    'account' => $displayName,
                    'type' => 'Customer',
                    'debit' => 0,
                    'credit' => 0,
                    'customerName' => $displayName,
                    'entity' => $displayName,
                    'outstanding' => '$0',
                    'terms' => '30 Days',
                    'status' => 'Pending',
                    'date' => now()->toDateString(),
                ];
            }
        } catch (\Exception $e) {
            // fallback if clients table is not available
            $balances[] = ['id' => 5, 'accountCode' => 'CUST-001', 'accountName' => 'Acme Corp', 'account' => 'Acme Corp', 'type' => 'Customer', 'debit' => 150000, 'credit' => 0, 'customerName' => 'Acme Corp', 'entity' => 'Acme Corp', 'outstanding' => '$150,000', 'terms' => '30 Days', 'status' => 'Pending', 'date' => '2025-07-01'];
            $balances[] = ['id' => 6, 'accountCode' => 'CUST-002', 'accountName' => 'Globex Inc', 'account' => 'Globex Inc', 'type' => 'Customer', 'debit' => 85000, 'credit' => 0, 'customerName' => 'Globex Inc', 'entity' => 'Globex Inc', 'outstanding' => '$85,000', 'terms' => 'Immediate', 'status' => 'Posted', 'date' => '2025-07-01'];
        }

        return $balances;
    }

    public function listOpeningBalances(): JsonResponse
    {
        $balances = Cache::get(self::OPENING_BALANCES_CACHE_KEY);
        if ($balances === null) {
            $balances = $this->getInitialOpeningBalances();
        } else {
            $balances = $this->normalizeOpeningBalances($balances);
            $balances = $this->syncCustomerBalances($balances);
        }
        Cache::forever(self::OPENING_BALANCES_CACHE_KEY, $balances);
        return response()->json(['data' => $balances]);
    }

    protected function syncCustomerBalances(array $balances): array
    {
        try {
            $clients = \App\Models\Client::all();
            $clientMap = [];
            foreach ($clients as $client) {
                $clientMap[$client->id] = $client;
            }

            $deletedClientIds = Cache::get(self::OPENING_BALANCES_CACHE_KEY . '_deleted_clients', []);

            $synced = [];
            $seenClientIds = [];

            foreach ($balances as $b) {
                if (($b['type'] ?? '') === 'Customer' && isset($b['clientDbId'])) {
                    $clientId = $b['clientDbId'];
                    if (in_array($clientId, $deletedClientIds, true)) {
                        continue;
                    }
                    if (isset($clientMap[$clientId])) {
                        $client = $clientMap[$clientId];
                        $displayName = $client->company_name ?: $client->name;
                        $b['accountName'] = $displayName;
                        $b['entity'] = $displayName;
                        $b['customerName'] = $displayName;
                        $synced[] = $b;
                        $seenClientIds[$clientId] = true;
                    }
                } else {
                    $synced[] = $b;
                }
            }

            $nextId = count($synced) > 0 ? max(array_column($synced, 'id')) + 1 : 100;
            foreach ($clients as $client) {
                if (!isset($seenClientIds[$client->id]) && !in_array($client->id, $deletedClientIds, true)) {
                    $displayName = $client->company_name ?: $client->name;
                    $synced[] = [
                        'id' => $nextId++,
                        'clientDbId' => $client->id,
                        'accountCode' => 'CUST-' . str_pad($client->id, 3, '0', STR_PAD_LEFT),
                        'accountName' => $displayName,
                        'account' => $displayName,
                        'type' => 'Customer',
                        'debit' => 0,
                        'credit' => 0,
                        'customerName' => $displayName,
                        'entity' => $displayName,
                        'outstanding' => '$0',
                        'terms' => '30 Days',
                        'status' => 'Pending',
                        'date' => now()->toDateString(),
                    ];
                }
            }

            return $synced;
        } catch (\Exception $e) {
            return $balances;
        }
    }

    public function getOpeningBalance($id): JsonResponse
    {
        $balances = $this->normalizeOpeningBalances(Cache::get(self::OPENING_BALANCES_CACHE_KEY) ?? $this->getInitialOpeningBalances());
        $found = collect($balances)->firstWhere('id', (int)$id);
        if (!$found) {
            return response()->json(['message' => 'Opening balance not found'], 404);
        }
        return response()->json(['data' => $found]);
    }

    public function createOpeningBalance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:GL,Customer',
            'accountCode' => 'nullable|string',
            'accountName' => 'required|string',
            'debit' => 'nullable|numeric',
            'credit' => 'nullable|numeric',
            'terms' => 'nullable|string',
        ]);

        $balances = Cache::get(self::OPENING_BALANCES_CACHE_KEY);
        if ($balances === null) {
            $balances = $this->getInitialOpeningBalances();
        } else {
            $balances = $this->normalizeOpeningBalances($balances);
        }

        $newId = count($balances) > 0 ? max(array_column($balances, 'id')) + 1 : 1;
        
        $type = $validated['type'];
        $debit = (float)($validated['debit'] ?? 0);
        $credit = (float)($validated['credit'] ?? 0);
        $accountCode = $validated['accountCode'] ?: ($type === 'Customer' ? 'CUST-' . str_pad($newId, 3, '0', STR_PAD_LEFT) : 'GL-' . str_pad($newId, 3, '0', STR_PAD_LEFT));
        $accountName = $validated['accountName'];
        
        $newItem = [
            'id' => $newId,
            'accountCode' => $accountCode,
            'accountName' => $accountName,
            'type' => $type,
            'debit' => $debit,
            'credit' => $credit,
            'customerName' => $type === 'Customer' ? $accountName : '—',
            'status' => 'Pending',
            'date' => now()->toDateString(),
        ];

        if ($type === 'GL') {
            $newItem['account'] = $accountCode . ' - ' . $accountName;
        } else {
            $newItem['entity'] = $accountName;
            $newItem['outstanding'] = '$' . number_format($debit);
            $newItem['terms'] = $validated['terms'] ?: '30 Days';
        }

        $balances[] = $newItem;
        Cache::forever(self::OPENING_BALANCES_CACHE_KEY, $balances);

        return response()->json(['message' => 'Opening balance created successfully', 'data' => $newItem], 201);
    }

    public function updateOpeningBalance(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:GL,Customer',
            'accountCode' => 'nullable|string',
            'accountName' => 'required|string',
            'debit' => 'nullable|numeric',
            'credit' => 'nullable|numeric',
            'terms' => 'nullable|string',
        ]);

        $balances = Cache::get(self::OPENING_BALANCES_CACHE_KEY);
        if ($balances === null) {
            $balances = $this->getInitialOpeningBalances();
        } else {
            $balances = $this->normalizeOpeningBalances($balances);
        }

        $foundIndex = -1;
        foreach ($balances as $idx => $b) {
            if ((int)$b['id'] === (int)$id) {
                $foundIndex = $idx;
                break;
            }
        }

        if ($foundIndex === -1) {
            return response()->json(['message' => 'Opening balance not found'], 404);
        }

        $type = $validated['type'];
        $debit = (float)($validated['debit'] ?? 0);
        $credit = (float)($validated['credit'] ?? 0);
        $accountCode = $validated['accountCode'] ?: ($type === 'Customer' ? 'CUST-' . str_pad($id, 3, '0', STR_PAD_LEFT) : 'GL-' . str_pad($id, 3, '0', STR_PAD_LEFT));
        $accountName = $validated['accountName'];

        $updatedItem = [
            'id' => (int)$id,
            'accountCode' => $accountCode,
            'accountName' => $accountName,
            'type' => $type,
            'debit' => $debit,
            'credit' => $credit,
            'customerName' => $type === 'Customer' ? $accountName : '—',
            'status' => $balances[$foundIndex]['status'] ?? 'Pending',
            'date' => $balances[$foundIndex]['date'] ?? now()->toDateString(),
        ];

        if ($type === 'GL') {
            $updatedItem['account'] = $accountCode . ' - ' . $accountName;
        } else {
            $updatedItem['entity'] = $accountName;
            $updatedItem['outstanding'] = '$' . number_format($debit);
            $updatedItem['terms'] = $validated['terms'] ?: '30 Days';
        }

        $balances[$foundIndex] = $updatedItem;
        Cache::forever(self::OPENING_BALANCES_CACHE_KEY, $balances);

        return response()->json(['message' => 'Opening balance updated successfully', 'data' => $updatedItem]);
    }

    public function deleteOpeningBalance($id): JsonResponse
    {
        $balances = Cache::get(self::OPENING_BALANCES_CACHE_KEY);
        if ($balances === null) {
            $balances = $this->getInitialOpeningBalances();
        } else {
            $balances = $this->normalizeOpeningBalances($balances);
        }

        $deleted = null;
        foreach ($balances as $b) {
            if ((int)$b['id'] === (int)$id) {
                $deleted = $b;
                break;
            }
        }

        $balances = array_values(array_filter($balances, fn($b) => (int)$b['id'] !== (int)$id));
        Cache::forever(self::OPENING_BALANCES_CACHE_KEY, $balances);

        // Track deleted client entries so sync does not re-add them
        if ($deleted && ($deleted['type'] ?? '') === 'Customer' && isset($deleted['clientDbId'])) {
            $deletedClientIds = Cache::get(self::OPENING_BALANCES_CACHE_KEY . '_deleted_clients', []);
            $deletedClientIds[] = $deleted['clientDbId'];
            Cache::forever(self::OPENING_BALANCES_CACHE_KEY . '_deleted_clients', array_unique($deletedClientIds));
        }

        return response()->json(['message' => 'Opening balance deleted successfully']);
    }

    public function postOpeningBalances(Request $request): JsonResponse
    {
        $balances = $this->normalizeOpeningBalances(Cache::get(self::OPENING_BALANCES_CACHE_KEY) ?? $this->getInitialOpeningBalances());
        foreach ($balances as &$b) {
            $b['status'] = 'Posted';
        }
        Cache::forever(self::OPENING_BALANCES_CACHE_KEY, $balances);
        return response()->json(['message' => 'All opening balances posted successfully']);
    }

    // ========================
    // Accounting Settings
    // ========================
    public function getAccountingSettings(): JsonResponse
    {
        $settings = [
            'baseCurrency' => 'USD',
            'decimalSeparator' => '.',
            'thousandSeparator' => ',',
            'currencyPosition' => 'Before',
            'currencyPrecision' => '2',
            'fiscalYearStart' => 'January',
            'taxMethod' => 'Exclusive Tax',
            'decimalPlaces' => '2',
            'retainedEarningsAccount' => '3001-01 - Retained Earnings Control',
            'plClosingAccount' => '9999-99 - Year-End Closing Account',
            'companyName' => 'ManageCore Global Corporate Ltd',
            'requireJournalApproval' => true,
            'lockPosted' => true,
            'allowNegativeCash' => false,
            'autoPost' => true,
            'multiCurrency' => true,
            'costCenters' => true,
            'budgetControl' => true,
            'auditMode' => true,
            'accountingStatus' => 'Active',
        ];
        $templates = Cache::get('fms_accounting_templates', []);
        $enabledTemplates = Cache::get('fms_accounting_enabled_templates', []);
        // merge images from templates cache back into settings (they were stripped on save to avoid TEXT overflow)
        foreach ($templates as $type => $tpl) {
            if (!empty($tpl['dataUrl'])) { $settings['companyLogo'] = $tpl['dataUrl']; break; }
        }
        foreach ($templates as $type => $tpl) {
            if (!empty($tpl['footerUrl'])) { $settings['footerLogo'] = $tpl['footerUrl']; break; }
        }
        return response()->json(['data' => $settings, 'templates' => $templates, 'enabledTemplates' => $enabledTemplates]);
    }

    public function saveAccountingSettings(Request $request): JsonResponse
    {
        $payload = $request->all();
        // persist template enable/disable states
        if (isset($payload['enabledTemplates']) && is_array($payload['enabledTemplates'])) {
            Cache::forever('fms_accounting_enabled_templates', $payload['enabledTemplates']);
        }
        // populate company branding into templates cache so all exports pick up logo/footer
        $templates = Cache::get('fms_accounting_templates', []);
        $docTypes = ['invoice','quotation','purchase','credit','receipt','report','delivery_challan','sales_order','sales_return'];
        foreach ($docTypes as $type) {
            if (!isset($templates[$type])) {
                $templates[$type] = [];
            }
            if (!empty($payload['companyLogo'])) {
                $templates[$type]['dataUrl'] = $payload['companyLogo'];
            }
            if (!empty($payload['footerLogo'])) {
                $templates[$type]['footerUrl'] = $payload['footerLogo'];
            }
        }
        Cache::forever('fms_accounting_templates', $templates);
        // strip large base64 images before storing to settings cache (avoids SQLSTATE TEXT column overflow)
        $settingsPayload = $payload;
        unset($settingsPayload['companyLogo'], $settingsPayload['footerLogo'], $settingsPayload['enabledTemplates']);
        Cache::forever('fms_accounting_settings', $settingsPayload);
        return response()->json(['message' => 'Accounting settings saved']);
    }

    /**
     * Build PDF HTML using an optional HTML template file (preferred) or falling back to header image + table.
     * Template placeholders supported: {{company}}, {{date}}, {{items_table}} (HTML table rows).
     */
    private function addDocxCompanyHeader($section): void
    {
        $settings = Cache::get('fms_accounting_settings', []);
        $companyName = $settings['companyName'] ?? '';
        $address = $settings['address'] ?? '';
        if ($companyName) {
            $section->addText($companyName, ['bold' => true, 'size' => 16]);
        }
        if ($address) {
            $section->addText($address, ['size' => 10]);
        }
        $section->addText('');
    }

    private function buildPdfHtml(string $title, array $rows, array $columns, array $templateKeys = []) : string
    {
        $templates = Cache::get('fms_accounting_templates', []);
        $settings = Cache::get('fms_accounting_settings', []);
        // Look for an HTML template file in provided keys
        $tplFile = null;
        foreach ($templateKeys as $k) {
            if (!empty($templates[$k]['file_path'] ?? null)) {
                $p = $templates[$k]['file_path'];
                if (is_file($p) && in_array(strtolower(pathinfo($p, PATHINFO_EXTENSION)), ['html','htm'])) { $tplFile = $p; break; }
            }
        }
        // Build items table rows HTML
        $rowsHtml = '';
        foreach ($rows as $r) {
            $rowsHtml .= '<tr>';
            foreach ($columns as $col) {
                $val = $r[$col] ?? ($r->{$col} ?? '');
                $rowsHtml .= '<td>' . htmlspecialchars((string)$val) . '</td>';
            }
            $rowsHtml .= '</tr>';
        }
        if ($tplFile) {
            $tpl = file_get_contents($tplFile);
            $tpl = str_replace('{{company}}', htmlspecialchars($settings['companyName'] ?? ''), $tpl);
            $tpl = str_replace('{{date}}', date('Y-m-d'), $tpl);
            $tpl = str_replace('{{items_table}}', $rowsHtml, $tpl);
            return $tpl;
        }
        // fallback: company branding header
        $headerHtml = '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><tr>';
        $logoUrl = $templates['report']['dataUrl'] ?? $templates['invoice']['dataUrl'] ?? $templates['quotation']['dataUrl'] ?? null;
        if (!empty($logoUrl)) {
            $headerHtml .= '<td style="width:120px;vertical-align:top;padding-right:12px;"><img src="' . $logoUrl . '" style="max-height:80px;max-width:120px;" /></td>';
        }
        $companyName = htmlspecialchars($settings['companyName'] ?? '');
        $address = htmlspecialchars($settings['address'] ?? '');
        $email = htmlspecialchars($settings['email'] ?? '');
        $phone = htmlspecialchars($settings['phone'] ?? '');
        $headerHtml .= '<td style="vertical-align:top;">';
        if ($companyName) {
            $headerHtml .= '<div style="font-size:18px;font-weight:bold;margin-bottom:4px;">' . $companyName . '</div>';
        }
        if ($address) {
            $headerHtml .= '<div style="font-size:10px;color:#555;margin-bottom:2px;">' . $address . '</div>';
        }
        if ($email || $phone) {
            $headerHtml .= '<div style="font-size:10px;color:#555;">';
            if ($email) { $headerHtml .= 'Email: ' . $email; }
            if ($email && $phone) { $headerHtml .= ' | '; }
            if ($phone) { $headerHtml .= 'Phone: ' . $phone; }
            $headerHtml .= '</div>';
        }
        $headerHtml .= '</td></tr></table>';
        $thead = '<tr>';
        foreach ($columns as $c) { $thead .= '<th>' . htmlspecialchars($c) . '</th>'; }
        $thead .= '</tr>';
        $footerLogoUrl = null;
        foreach ($templateKeys as $k) {
            if (!empty($templates[$k]['footerUrl'] ?? null)) { $footerLogoUrl = $templates[$k]['footerUrl']; break; }
        }
        $footerHtml = '';
        if (!empty($footerLogoUrl)) {
            $footerHtml = '<div style="text-align:center;margin-top:24px;padding-top:12px;border-top:1px solid #ccc;"><img src="' . $footerLogoUrl . '" style="width:100%;max-height:80px;object-fit:contain;" /></div>';
        }
        if (!empty($settings['invoiceFooter'])) {
            $footerHtml .= '<div style="text-align:center;font-size:9px;color:#888;margin-top:8px;font-style:italic;">' . htmlspecialchars($settings['invoiceFooter']) . '</div>';
        }
        $html = $headerHtml . '<h2 style="margin-bottom:12px;">' . htmlspecialchars($title) . '</h2>' . '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%"><thead>' . $thead . '</thead><tbody>' . $rowsHtml . '</tbody></table>' . $footerHtml;
        return $html;
    }

    public function getAuditLogs(Request $request): JsonResponse
    {
        return response()->json(['data' => [
            ['id' => 1, 'user' => 'System Admin', 'action' => 'Settings Updated', 'target' => 'Base Currency', 'details' => 'Changed from EUR to USD', 'timestamp' => '2026-07-02 14:30:00', 'ip' => '192.168.1.100'],
            ['id' => 2, 'user' => 'Finance Admin', 'action' => 'Account Created', 'target' => 'Petty Cash Fund', 'details' => 'Created new account with code 1001-02', 'timestamp' => '2026-06-28 09:15:00', 'ip' => '192.168.1.101'],
            ['id' => 3, 'user' => 'System Admin', 'action' => 'Fiscal Year Locked', 'target' => 'FY2024-25', 'details' => 'Locked fiscal year after year-end close', 'timestamp' => '2025-06-30 23:59:00', 'ip' => '192.168.1.100'],
        ]]);
    }

    public function exportSettings(): JsonResponse
    {
        return response()->json(['data' => ['settings' => []]]);
    }

    public function importSettings(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Settings imported']);
    }

    // ========================
    // Quotations
    // ========================
    private const QUOTATIONS_CACHE_KEY = 'fms_quotations';

    protected function getInitialQuotations(): array
    {
        return [
            ['id' => 1, 'number' => 'QTN-2026-0001', 'customer' => 'Acme Corporation', 'date' => '2026-06-15', 'validUntil' => '2026-07-15', 'amount' => 45000, 'currency' => 'USD', 'status' => 'Approved', 'items' => 3, 'salesPerson' => 'John Smith'],
            ['id' => 2, 'number' => 'QTN-2026-0002', 'customer' => 'Globex Industries', 'date' => '2026-06-18', 'validUntil' => '2026-07-18', 'amount' => 28500, 'currency' => 'USD', 'status' => 'Pending', 'items' => 2, 'salesPerson' => 'Sarah Lee'],
            ['id' => 3, 'number' => 'QTN-2026-0003', 'customer' => 'Initech Global', 'date' => '2026-06-20', 'validUntil' => '2026-07-20', 'amount' => 92000, 'currency' => 'USD', 'status' => 'Draft', 'items' => 5, 'salesPerson' => 'Mike Chen'],
        ];
    }

    public function listQuotations(): JsonResponse
    {
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialQuotations(); Cache::forever(self::QUOTATIONS_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getQuotation($id): JsonResponse
    {
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Quotation not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createQuotation(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('QTN-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'customer' => $payload['customer_name'] ?? ($payload['customer_id'] ?? 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'validUntil' => $payload['valid_until'] ?? now()->addDays(30)->toDateString(),
            'amount' => $payload['grand_total'] ?? 0,
            'currency' => $payload['currency'] ?? 'USD',
            'status' => $payload['status'] ?? 'Draft',
            'items' => count($payload['lines'] ?? []),
            'salesPerson' => $payload['salesperson'] ?? auth()->user()?->name ?? 'System',
        ];
        $items[] = $new; Cache::forever(self::QUOTATIONS_CACHE_KEY, $items);
        return response()->json(['message' => 'Quotation created', 'data' => $new], 201);
    }

    public function updateQuotation(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Quotation not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::QUOTATIONS_CACHE_KEY, $items);
        return response()->json(['message' => 'Quotation updated', 'data' => $updated]);
    }

    public function deleteQuotation($id): JsonResponse
    {
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::QUOTATIONS_CACHE_KEY, $items);
        return response()->json(['message' => 'Quotation deleted']);
    }

    public function convertQuotationToSalesOrder($id): JsonResponse
    {
        // Simplified conversion: create a sales order from the quotation and return its id
        $quotations = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $found = collect($quotations)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Quotation not found'], 404);
        // Create sales order
        $soItems = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $newId = count($soItems) > 0 ? max(array_column($soItems, 'id')) + 1 : 1;
        $newSo = [
            'id' => $newId,
            'number' => 'SO-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT),
            'customer' => $found['customer'],
            'date' => now()->toDateString(),
            'deliveryDate' => now()->addDays(7)->toDateString(),
            'amount' => $found['amount'] ?? 0,
            'currency' => $found['currency'] ?? 'USD',
            'status' => 'Confirmed',
            'items' => $found['items'] ?? 0,
            'salesPerson' => $found['salesPerson'] ?? auth()->user()?->name ?? 'System',
        ];
        $soItems[] = $newSo; Cache::forever(self::SALES_ORDERS_CACHE_KEY, $soItems);
        return response()->json(['message' => 'Quotation converted to sales order', 'data' => ['orderId' => $newId]]);
    }

    // ========================
    // Sales Orders
    // ========================
    private const SALES_ORDERS_CACHE_KEY = 'fms_sales_orders';

    protected function getInitialSalesOrders(): array
    {
        return [
            ['id' => 1, 'number' => 'SO-2026-0042', 'customer' => 'Acme Corporation', 'date' => '2026-06-20', 'deliveryDate' => '2026-07-10', 'amount' => 45000, 'currency' => 'USD', 'status' => 'Confirmed', 'items' => 3, 'salesPerson' => 'John Smith'],
            ['id' => 2, 'number' => 'SO-2026-0043', 'customer' => 'Stark Industries', 'date' => '2026-06-22', 'deliveryDate' => '2026-07-15', 'amount' => 128000, 'currency' => 'USD', 'status' => 'Processing', 'items' => 8, 'salesPerson' => 'Sarah Lee'],
            ['id' => 3, 'number' => 'SO-2026-0044', 'customer' => 'Wayne Enterprises', 'date' => '2026-06-25', 'deliveryDate' => '2026-07-20', 'amount' => 75000, 'currency' => 'USD', 'status' => 'Draft', 'items' => 4, 'salesPerson' => 'Mike Chen'],
        ];
    }

    public function listSalesOrders(): JsonResponse
    {
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY);
        if ($items === null) {
            $items = $this->getInitialSalesOrders();
            Cache::forever(self::SALES_ORDERS_CACHE_KEY, $items);
        }
        return response()->json(['data' => $items]);
    }

    public function getSalesOrder($id): JsonResponse
    {
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Sales order not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createSalesOrder(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('SO-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'customer' => $payload['customer_name'] ?? ($payload['customer_id'] ?? 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'deliveryDate' => $payload['due_date'] ?? $payload['delivery_date'] ?? now()->addDays(7)->toDateString(),
            'amount' => $payload['grand_total'] ?? $payload['amount'] ?? 0,
            'currency' => $payload['currency'] ?? 'USD',
            'status' => $payload['status'] ?? 'Draft',
            'items' => count($payload['lines'] ?? []),
            'salesPerson' => $payload['salesperson'] ?? auth()->user()?->name ?? 'System',
        ];
        $items[] = $new;
        Cache::forever(self::SALES_ORDERS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales order created', 'data' => $new], 201);
    }

    public function updateSalesOrder(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Sales order not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all());
        $items[$foundIndex] = $updated;
        Cache::forever(self::SALES_ORDERS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales order updated', 'data' => $updated]);
    }

    public function deleteSalesOrder($id): JsonResponse
    {
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::SALES_ORDERS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales order deleted']);
    }

    public function exportSalesOrders($format)
    {
        $items = Cache::get(self::SALES_ORDERS_CACHE_KEY) ?? $this->getInitialSalesOrders();
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,customer,date,deliveryDate,amount,currency,status,items,salesPerson\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r['id'], $r['number'], $r['customer'], $r['date'], $r['deliveryDate'], $r['amount'], $r['currency'], $r['status'], $r['items'], $r['salesPerson'] ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="sales-orders.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            $reportImg = $templates['report']['dataUrl'] ?? null;
            if (!empty($reportImg)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $reportImg . '" style="max-height:120px;" /></div>';
            }

            $html = $this->buildPdfHtml('Sales Orders', $items, ['id','number','customer','date','deliveryDate','amount','status'], ['sales_order','sales-order','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="sales-orders.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','Customer','Date','DeliveryDate','Amount','Currency','Status','Items','SalesPerson'];
            $sheet->fromArray($headers, null, 'A1');
            $row = 2;
            foreach ($items as $r) {
                $sheet->fromArray([ $r['id'], $r['number'], $r['customer'], $r['date'], $r['deliveryDate'], $r['amount'], $r['currency'], $r['status'], $r['items'], $r['salesPerson'] ], null, 'A' . $row);
                $row++;
            }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($tmpfname);
            $content = file_get_contents($tmpfname);
            unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="sales-orders.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            $templates = Cache::get('fms_accounting_templates', []);
            $tplFile = $templates['sales_order']['file_path'] ?? ($templates['sales-order']['file_path'] ?? null);
            if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                // Use TemplateProcessor to merge scalars and rows. Template expects TemplateProcessor placeholders like ${company} and a table row with ${items#id}, ${items#number}, etc.
                $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx';
                copy($tplFile, $tmpTpl);
                $tp = new TemplateProcessor($tmpTpl);
                $settings = Cache::get('fms_accounting_settings', []);
                $tp->setValue('company', $settings['companyName'] ?? '');
                $tp->setValue('address', $settings['address'] ?? '');
                $tp->setValue('phone', $settings['phone'] ?? '');
                $tp->setValue('email', $settings['email'] ?? '');
                $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                $tp->setValue('date', date('Y-m-d'));
                $num = count($items);
                if ($num > 0) {
                    // clone 'items' row in template and set column arrays
                    $tp->cloneRow('items', $num);
                    $ids = array_map(fn($r) => $r['id'], $items);
                    $nums = array_map(fn($r) => $r['number'], $items);
                    $custs = array_map(fn($r) => $r['customer'], $items);
                    $dates = array_map(fn($r) => $r['date'], $items);
                    $dDates = array_map(fn($r) => $r['deliveryDate'], $items);
                    $amounts = array_map(fn($r) => (string)$r['amount'], $items);
                    $currs = array_map(fn($r) => $r['currency'], $items);
                    $stats = array_map(fn($r) => $r['status'], $items);
                    $tp->setValue('items#id', $ids);
                    $tp->setValue('items#number', $nums);
                    $tp->setValue('items#customer', $custs);
                    $tp->setValue('items#date', $dates);
                    $tp->setValue('items#deliveryDate', $dDates);
                    $tp->setValue('items#amount', $amounts);
                    $tp->setValue('items#currency', $currs);
                    $tp->setValue('items#status', $stats);
                }
                $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx';
                $tp->saveAs($outTmp);
                $content = file_get_contents($outTmp);
                @unlink($tmpTpl);
                @unlink($outTmp);
                return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-orders.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
            }
            // fallback to generated docx
            $phpWord = new \PhpOffice\PhpWord\PhpWord();
            $section = $phpWord->addSection();
            $this->addDocxCompanyHeader($section);
            $table = $section->addTable();
            $table->addRow();
            foreach (['ID','Number','Customer','Date','DeliveryDate','Amount','Currency','Status'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) {
                $table->addRow();
                $table->addCell(1500)->addText($r['id']);
                $table->addCell(1500)->addText($r['number']);
                $table->addCell(1500)->addText($r['customer']);
                $table->addCell(1500)->addText($r['date']);
                $table->addCell(1500)->addText($r['deliveryDate']);
                $table->addCell(1500)->addText((string)$r['amount']);
                $table->addCell(1500)->addText($r['currency']);
                $table->addCell(1500)->addText($r['status']);
            }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord);
            $tmpfname = tempnam(sys_get_temp_dir(), 'docx');
            $writer->save($tmpfname);
            $content = file_get_contents($tmpfname);
            unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-orders.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    // Export Quotations, Delivery Challans, Invoices, Credit Notes, Sales Returns
    public function exportQuotations($format)
    {
        $items = Cache::get(self::QUOTATIONS_CACHE_KEY) ?? $this->getInitialQuotations();
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,customer,date,validUntil,amount,currency,status,items,salesPerson\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r['id'], $r['number'], $r['customer'], $r['date'], $r['validUntil'], $r['amount'], $r['currency'], $r['status'], $r['items'], $r['salesPerson'] ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="quotations.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            $qImg = $templates['quotation']['dataUrl'] ?? null;
            if (!empty($qImg)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $qImg . '" style="max-height:120px;" /></div>';
            }

            $html = $this->buildPdfHtml('Quotations', $items, ['id','number','customer','date','validUntil','amount','status'], ['quotation','quote','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="quotations.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','Customer','Date','ValidUntil','Amount','Currency','Status','Items','SalesPerson'];
            $sheet->fromArray($headers, null, 'A1');
            $row = 2;
            foreach ($items as $r) {
                $sheet->fromArray([ $r['id'], $r['number'], $r['customer'], $r['date'], $r['validUntil'], $r['amount'], $r['currency'], $r['status'], $r['items'], $r['salesPerson'] ], null, 'A' . $row);
                $row++;
            }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($tmpfname);
            $content = file_get_contents($tmpfname);
            unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="quotations.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            $templates = Cache::get('fms_accounting_templates', []);
            $tplFile = $templates['quotation']['file_path'] ?? ($templates['quote']['file_path'] ?? null);
            if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx';
                copy($tplFile, $tmpTpl);
                $tp = new TemplateProcessor($tmpTpl);
                $settings = Cache::get('fms_accounting_settings', []);
                $tp->setValue('company', $settings['companyName'] ?? '');
                $tp->setValue('address', $settings['address'] ?? '');
                $tp->setValue('phone', $settings['phone'] ?? '');
                $tp->setValue('email', $settings['email'] ?? '');
                $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                $tp->setValue('date', date('Y-m-d'));
                $num = count($items);
                if ($num > 0) {
                    $tp->cloneRow('items', $num);
                    $ids = array_map(fn($r) => $r['id'], $items);
                    $nums = array_map(fn($r) => $r['number'], $items);
                    $custs = array_map(fn($r) => $r['customer'], $items);
                    $dates = array_map(fn($r) => $r['date'], $items);
                    $vUntil = array_map(fn($r) => $r['validUntil'], $items);
                    $amounts = array_map(fn($r) => (string)$r['amount'], $items);
                    $currs = array_map(fn($r) => $r['currency'], $items);
                    $stats = array_map(fn($r) => $r['status'], $items);
                    $tp->setValue('items#id', $ids);
                    $tp->setValue('items#number', $nums);
                    $tp->setValue('items#customer', $custs);
                    $tp->setValue('items#date', $dates);
                    $tp->setValue('items#validUntil', $vUntil);
                    $tp->setValue('items#amount', $amounts);
                    $tp->setValue('items#currency', $currs);
                    $tp->setValue('items#status', $stats);
                }
                $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx';
                $tp->saveAs($outTmp);
                $content = file_get_contents($outTmp);
                @unlink($tmpTpl);
                @unlink($outTmp);
                return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="quotations.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
            }
            // fallback
            $phpWord = new \PhpOffice\PhpWord\PhpWord(); $section = $phpWord->addSection(); $this->addDocxCompanyHeader($section); $table = $section->addTable(); $table->addRow(); foreach (['ID','Number','Customer','Date','ValidUntil','Amount','Currency','Status'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) { $table->addRow(); $table->addCell(1500)->addText($r['id']); $table->addCell(1500)->addText($r['number']); $table->addCell(1500)->addText($r['customer']); $table->addCell(1500)->addText($r['date']); $table->addCell(1500)->addText($r['validUntil']); $table->addCell(1500)->addText((string)$r['amount']); $table->addCell(1500)->addText($r['currency']); $table->addCell(1500)->addText($r['status']); }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord); $tmpfname = tempnam(sys_get_temp_dir(), 'docx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="quotations.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    public function exportDeliveryChallans($format)
    {
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY) ?? $this->getInitialDeliveryChallans();
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,orderNumber,customer,date,deliveryDate,items,amount,vehicle,driver,status\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r['id'], $r['number'], $r['orderNumber'] ?? '', $r['customer'], $r['date'], $r['deliveryDate'], $r['items'], $r['amount'], $r['vehicle'] ?? '', $r['driver'] ?? '', $r['status'] ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="delivery-challans.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            $dcImg = $templates['delivery_challan']['dataUrl'] ?? $templates['purchase']['dataUrl'] ?? $templates['report']['dataUrl'] ?? null;
            if (!empty($dcImg)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $dcImg . '" style="max-height:120px;" /></div>';
            }

            $html = $this->buildPdfHtml('Delivery Challans', $items, ['id','number','orderNumber','customer','date','deliveryDate','amount','status'], ['delivery_challan','delivery-challan','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="delivery-challans.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet(); $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','OrderNumber','Customer','Date','DeliveryDate','Items','Amount','Vehicle','Driver','Status']; $sheet->fromArray($headers, null, 'A1'); $row = 2;
            foreach ($items as $r) { $sheet->fromArray([ $r['id'], $r['number'], $r['orderNumber'] ?? '', $r['customer'], $r['date'], $r['deliveryDate'], $r['items'], $r['amount'], $r['vehicle'] ?? '', $r['driver'] ?? '', $r['status'] ], null, 'A' . $row); $row++; }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($tmpfname);
            $content = file_get_contents($tmpfname);
            unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="delivery-challans.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            $templates = Cache::get('fms_accounting_templates', []);
            $tplFile = $templates['delivery_challan']['file_path'] ?? ($templates['delivery-challan']['file_path'] ?? null);
            if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx'; copy($tplFile, $tmpTpl);
                $tp = new TemplateProcessor($tmpTpl);
                $settings = Cache::get('fms_accounting_settings', []);
                $tp->setValue('company', $settings['companyName'] ?? '');
                $tp->setValue('address', $settings['address'] ?? '');
                $tp->setValue('phone', $settings['phone'] ?? '');
                $tp->setValue('email', $settings['email'] ?? '');
                $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                $tp->setValue('date', date('Y-m-d'));
                $num = count($items);
                if ($num > 0) {
                    $tp->cloneRow('items', $num);
                    $ids = array_map(fn($r) => $r['id'], $items);
                    $nums = array_map(fn($r) => $r['number'], $items);
                    $orders = array_map(fn($r) => $r['orderNumber'] ?? '', $items);
                    $custs = array_map(fn($r) => $r['customer'], $items);
                    $dates = array_map(fn($r) => $r['date'], $items);
                    $dDates = array_map(fn($r) => $r['deliveryDate'], $items);
                    $amounts = array_map(fn($r) => (string)$r['amount'], $items);
                    $stats = array_map(fn($r) => $r['status'], $items);
                    $tp->setValue('items#id', $ids);
                    $tp->setValue('items#number', $nums);
                    $tp->setValue('items#orderNumber', $orders);
                    $tp->setValue('items#customer', $custs);
                    $tp->setValue('items#date', $dates);
                    $tp->setValue('items#deliveryDate', $dDates);
                    $tp->setValue('items#amount', $amounts);
                    $tp->setValue('items#status', $stats);
                }
                $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx'; $tp->saveAs($outTmp); $content = file_get_contents($outTmp); @unlink($tmpTpl); @unlink($outTmp);
                return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="delivery-challans.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
            }
            // fallback
            $phpWord = new \PhpOffice\PhpWord\PhpWord(); $section = $phpWord->addSection(); $this->addDocxCompanyHeader($section); $table = $section->addTable(); $table->addRow(); foreach (['ID','Number','Order','Customer','Date','Delivery','Amount','Status'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) { $table->addRow(); $table->addCell(1500)->addText($r['id']); $table->addCell(1500)->addText($r['number']); $table->addCell(1500)->addText($r['orderNumber'] ?? ''); $table->addCell(1500)->addText($r['customer']); $table->addCell(1500)->addText($r['date']); $table->addCell(1500)->addText($r['deliveryDate']); $table->addCell(1500)->addText((string)$r['amount']); $table->addCell(1500)->addText($r['status']); }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord); $tmpfname = tempnam(sys_get_temp_dir(), 'docx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="delivery-challans.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    public function exportSalesInvoices($format)
    {
        $items = $this->listSalesInvoices()->getData()->data ?? [];
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,customer,date,dueDate,amount,currency,status,items,billingMethod\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r->id, $r->number, $r->customer, $r->date, $r->due ?? $r->dueDate ?? '', $r->amount, $r->currency ?? '', $r->status, $r->items ?? 0, $r->billingMethod ?? '' ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="sales-invoices.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            $invImg = $templates['invoice']['dataUrl'] ?? $templates['report']['dataUrl'] ?? null;
            if (!empty($invImg)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $invImg . '" style="max-height:120px;" /></div>';
            }
            $html = $this->buildPdfHtml('Sales Invoices', $items, ['id','number','customer','date','due','amount','status'], ['invoice','sales_invoice','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="sales-invoices.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','Customer','Date','DueDate','Amount','Currency','Status','Items','BillingMethod'];
            $sheet->fromArray($headers, null, 'A1');
            $row = 2;
            foreach ($items as $r) {
                $sheet->fromArray([ $r->id, $r->number, $r->customer, $r->date, $r->due ?? $r->dueDate ?? '', $r->amount, $r->currency ?? '', $r->status, $r->items ?? 0, $r->billingMethod ?? '' ], null, 'A' . $row);
                $row++;
            }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($tmpfname);
            $content = file_get_contents($tmpfname);
            unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="sales-invoices.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            try {
                $templates = Cache::get('fms_accounting_templates', []);
                $tplFile = $templates['invoice']['file_path'] ?? ($templates['sales_invoice']['file_path'] ?? null);
                if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                    $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx'; copy($tplFile, $tmpTpl);
                    $tp = new TemplateProcessor($tmpTpl);
                    $settings = Cache::get('fms_accounting_settings', []);
                    $tp->setValue('company', $settings['companyName'] ?? '');
                    $tp->setValue('address', $settings['address'] ?? '');
                    $tp->setValue('phone', $settings['phone'] ?? '');
                    $tp->setValue('email', $settings['email'] ?? '');
                    $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                    $tp->setValue('date', date('Y-m-d'));
                    $num = count($items);
                    if ($num > 0) {
                        $tp->cloneRow('items', $num);
                        $ids = array_map(fn($r) => $r->id, $items);
                        $nums = array_map(fn($r) => $r->number, $items);
                        $custs = array_map(fn($r) => $r->customer, $items);
                        $dates = array_map(fn($r) => $r->date, $items);
                        $dDates = array_map(fn($r) => $r->due ?? $r->dueDate ?? '', $items);
                        $amounts = array_map(fn($r) => (string)$r->amount, $items);
                        $stats = array_map(fn($r) => $r->status, $items);
                        $tp->setValue('items#id', $ids);
                        $tp->setValue('items#number', $nums);
                        $tp->setValue('items#customer', $custs);
                        $tp->setValue('items#date', $dates);
                        $tp->setValue('items#dueDate', $dDates);
                        $tp->setValue('items#amount', $amounts);
                        $tp->setValue('items#status', $stats);
                    }
                    $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx'; $tp->saveAs($outTmp); $content = file_get_contents($outTmp); @unlink($tmpTpl); @unlink($outTmp);
                    return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-invoices.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
                }
            } catch (\Exception $e) {
                // Fall through to fallback
            }
            // fallback
            $phpWord = new \PhpOffice\PhpWord\PhpWord(); $section = $phpWord->addSection(); $this->addDocxCompanyHeader($section); $table = $section->addTable(); $table->addRow(); foreach (['ID','Number','Customer','Date','DueDate','Amount','Status'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) { $table->addRow(); $table->addCell(1500)->addText($r->id); $table->addCell(1500)->addText($r->number); $table->addCell(1500)->addText($r->customer); $table->addCell(1500)->addText($r->date); $table->addCell(1500)->addText($r->due ?? $r->dueDate ?? ''); $table->addCell(1500)->addText((string)$r->amount); $table->addCell(1500)->addText($r->status); }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord); $tmpfname = tempnam(sys_get_temp_dir(), 'docx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-invoices.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    public function exportCreditNotes($format)
    {
        $items = $this->listCreditNotes()->getData()->data ?? [];
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,invoiceRef,customer,date,amount,currency,reason,status,items\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r->id, $r->number, $r->linkedInvoice ?? $r->invoiceRef ?? '', $r->customer, $r->date, $r->amount, $r->currency ?? '', $r->reason ?? '', $r->status, $r->items ?? 0 ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="credit-notes.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            if (!empty($templates['credit_note']['dataUrl'] ?? null)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $templates['credit_note']['dataUrl'] . '" style="max-height:120px;" /></div>';
            }
            $html = $this->buildPdfHtml('Credit Notes', $items, ['id','number','linkedInvoice','customer','date','amount','status'], ['credit_note','credit-note','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="credit-notes.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet(); $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','InvoiceRef','Customer','Date','Amount','Currency','Status','Items']; $sheet->fromArray($headers, null, 'A1'); $row = 2;
            foreach ($items as $r) { $sheet->fromArray([ $r->id, $r->number, $r->linkedInvoice ?? $r->invoiceRef ?? '', $r->customer, $r->date, $r->amount, $r->currency ?? '', $r->status, $r->items ?? 0 ], null, 'A' . $row); $row++; }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet); $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="credit-notes.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            try {
                $templates = Cache::get('fms_accounting_templates', []);
                $tplFile = $templates['credit_note']['file_path'] ?? ($templates['credit-note']['file_path'] ?? null);
                if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                    $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx'; copy($tplFile, $tmpTpl);
                    $tp = new TemplateProcessor($tmpTpl);
                    $settings = Cache::get('fms_accounting_settings', []);
                    $tp->setValue('company', $settings['companyName'] ?? '');
                    $tp->setValue('address', $settings['address'] ?? '');
                    $tp->setValue('phone', $settings['phone'] ?? '');
                    $tp->setValue('email', $settings['email'] ?? '');
                    $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                    $tp->setValue('date', date('Y-m-d'));
                    $num = count($items);
                    if ($num > 0) {
                        $tp->cloneRow('items', $num);
                        $ids = array_map(fn($r) => $r->id, $items);
                        $nums = array_map(fn($r) => $r->number, $items);
                        $invoices = array_map(fn($r) => $r->linkedInvoice ?? $r->invoiceRef ?? '', $items);
                        $custs = array_map(fn($r) => $r->customer, $items);
                        $dates = array_map(fn($r) => $r->date, $items);
                        $amounts = array_map(fn($r) => (string)$r->amount, $items);
                        $tp->setValue('items#id', $ids);
                        $tp->setValue('items#number', $nums);
                        $tp->setValue('items#invoiceRef', $invoices);
                        $tp->setValue('items#customer', $custs);
                        $tp->setValue('items#date', $dates);
                        $tp->setValue('items#amount', $amounts);
                    }
                    $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx'; $tp->saveAs($outTmp); $content = file_get_contents($outTmp); @unlink($tmpTpl); @unlink($outTmp);
                    return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="credit-notes.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
                }
            } catch (\Exception $e) {
                // Fall through to fallback
            }
            // fallback
            $phpWord = new \PhpOffice\PhpWord\PhpWord(); $section = $phpWord->addSection(); $this->addDocxCompanyHeader($section); $table = $section->addTable(); $table->addRow(); foreach (['ID','Number','InvoiceRef','Customer','Date','Amount'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) { $table->addRow(); $table->addCell(1500)->addText($r->id); $table->addCell(1500)->addText($r->number); $table->addCell(1500)->addText($r->linkedInvoice ?? $r->invoiceRef ?? ''); $table->addCell(1500)->addText($r->customer); $table->addCell(1500)->addText($r->date); $table->addCell(1500)->addText((string)$r->amount); }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord); $tmpfname = tempnam(sys_get_temp_dir(), 'docx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="credit-notes.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    public function exportSalesReturns($format)
    {
        $items = $this->listSalesReturns()->getData()->data ?? [];
        $fmt = strtolower($format);
        if ($fmt === 'csv') {
            $csv = "id,number,invoiceRef,customer,date,amount,currency,reason,status,items\n";
            foreach ($items as $r) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [ $r->id, $r->number, $r->linkedInvoice ?? $r->invoiceRef ?? '', $r->customer, $r->date, $r->amount, $r->currency ?? '', $r->reason ?? '', $r->status, $r->items ?? 0 ])) . "\n";
            }
            $bom = "\xEF\xBB\xBF";
            return response($bom . $csv, 200)->header('Content-Type', 'text/csv; charset=UTF-8')->header('Content-Disposition', 'attachment; filename="sales-returns.csv"')->header('Content-Length', strlen($bom.$csv));
        }
        if ($fmt === 'pdf') {
            $templates = Cache::get('fms_accounting_templates', []);
            $headerHtml = '';
            if (!empty($templates['sales_return']['dataUrl'] ?? null)) {
                $headerHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' . $templates['sales_return']['dataUrl'] . '" style="max-height:120px;" /></div>';
            }
            $html = $this->buildPdfHtml('Sales Returns', $items, ['id','number','linkedInvoice','customer','date','amount','status'], ['sales_return','sales-return','report']);
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            return response($output, 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'attachment; filename="sales-returns.pdf"')->header('Content-Length', strlen($output))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'xlsx') {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet(); $sheet = $spreadsheet->getActiveSheet();
            $headers = ['ID','Number','InvoiceRef','Customer','Date','Amount','Currency','Status','Items']; $sheet->fromArray($headers, null, 'A1'); $row = 2;
            foreach ($items as $r) { $sheet->fromArray([ $r->id, $r->number, $r->linkedInvoice ?? $r->invoiceRef ?? '', $r->customer, $r->date, $r->amount, $r->currency ?? '', $r->status, $r->items ?? 0 ], null, 'A' . $row); $row++; }
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet); $tmpfname = tempnam(sys_get_temp_dir(), 'xlsx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')->header('Content-Disposition', 'attachment; filename="sales-returns.xlsx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        if ($fmt === 'docx') {
            try {
                $templates = Cache::get('fms_accounting_templates', []);
                $tplFile = $templates['sales_return']['file_path'] ?? ($templates['sales-return']['file_path'] ?? null);
                if (!empty($tplFile) && file_exists($tplFile) && strtolower(pathinfo($tplFile, PATHINFO_EXTENSION)) === 'docx') {
                    $tmpTpl = tempnam(sys_get_temp_dir(), 'tpl') . '.docx'; copy($tplFile, $tmpTpl);
                    $tp = new TemplateProcessor($tmpTpl);
                    $settings = Cache::get('fms_accounting_settings', []);
                    $tp->setValue('company', $settings['companyName'] ?? '');
                    $tp->setValue('address', $settings['address'] ?? '');
                    $tp->setValue('phone', $settings['phone'] ?? '');
                    $tp->setValue('email', $settings['email'] ?? '');
                    $tp->setValue('footer', $settings['invoiceFooter'] ?? '');
                    $tp->setValue('date', date('Y-m-d'));
                    $num = count($items);
                    if ($num > 0) {
                        $tp->cloneRow('items', $num);
                        $ids = array_map(fn($r) => $r->id, $items);
                        $nums = array_map(fn($r) => $r->number, $items);
                        $invoices = array_map(fn($r) => $r->linkedInvoice ?? $r->invoiceRef ?? '', $items);
                        $custs = array_map(fn($r) => $r->customer, $items);
                        $dates = array_map(fn($r) => $r->date, $items);
                        $amounts = array_map(fn($r) => (string)$r->amount, $items);
                        $tp->setValue('items#id', $ids);
                        $tp->setValue('items#number', $nums);
                        $tp->setValue('items#invoiceRef', $invoices);
                        $tp->setValue('items#customer', $custs);
                        $tp->setValue('items#date', $dates);
                        $tp->setValue('items#amount', $amounts);
                    }
                    $outTmp = tempnam(sys_get_temp_dir(), 'out') . '.docx'; $tp->saveAs($outTmp); $content = file_get_contents($outTmp); @unlink($tmpTpl); @unlink($outTmp);
                    return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-returns.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
                }
            } catch (\Exception $e) {
                // Fall through to fallback
            }
            // fallback
            $phpWord = new \PhpOffice\PhpWord\PhpWord(); $section = $phpWord->addSection(); $this->addDocxCompanyHeader($section); $table = $section->addTable(); $table->addRow(); foreach (['ID','Number','InvoiceRef','Customer','Date','Amount'] as $h) { $table->addCell(1500)->addText($h); }
            foreach ($items as $r) { $table->addRow(); $table->addCell(1500)->addText($r->id); $table->addCell(1500)->addText($r->number); $table->addCell(1500)->addText($r->linkedInvoice ?? $r->invoiceRef ?? ''); $table->addCell(1500)->addText($r->customer); $table->addCell(1500)->addText($r->date); $table->addCell(1500)->addText((string)$r->amount); }
            $writer = new \PhpOffice\PhpWord\Writer\Word2007($phpWord); $tmpfname = tempnam(sys_get_temp_dir(), 'docx'); $writer->save($tmpfname); $content = file_get_contents($tmpfname); unlink($tmpfname);
            return response($content, 200)->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')->header('Content-Disposition', 'attachment; filename="sales-returns.docx"')->header('Content-Length', strlen($content))->header('Content-Transfer-Encoding','binary');
        }
        return response()->json(['message' => 'Unsupported export format'], 400);
    }

    // ========================
    // Delivery Challans
    // ========================
    private const DELIVERY_CHALLANS_CACHE_KEY = 'fms_delivery_challans';
    protected function getInitialDeliveryChallans(): array
    {
        return [
            ['id' => 1, 'number' => 'DC-2026-0031', 'orderNumber' => 'SO-2026-0042', 'customer' => 'Acme Corporation', 'date' => '2026-06-28', 'deliveryDate' => '2026-06-30', 'items' => 3, 'amount' => 45000, 'vehicle' => 'VH-7821', 'driver' => 'Robert Wilson', 'status' => 'Delivered'],
            ['id' => 2, 'number' => 'DC-2026-0032', 'orderNumber' => 'SO-2026-0041', 'customer' => 'Globex Industries', 'date' => '2026-06-29', 'deliveryDate' => '2026-07-01', 'items' => 5, 'amount' => 62000, 'vehicle' => 'VH-4512', 'driver' => 'James Brown', 'status' => 'In Transit'],
            ['id' => 3, 'number' => 'DC-2026-0033', 'orderNumber' => 'SO-2026-0040', 'customer' => 'Initech Global', 'date' => '2026-06-30', 'deliveryDate' => '2026-07-02', 'items' => 2, 'amount' => 18500, 'vehicle' => 'VH-9034', 'driver' => 'Emily Davis', 'status' => 'Pending'],
        ];
    }

    public function listDeliveryChallans(): JsonResponse
    {
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialDeliveryChallans(); Cache::forever(self::DELIVERY_CHALLANS_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getDeliveryChallan($id): JsonResponse
    {
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY) ?? $this->getInitialDeliveryChallans();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Delivery challan not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createDeliveryChallan(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY) ?? $this->getInitialDeliveryChallans();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('DC-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'orderNumber' => $payload['order_number'] ?? null,
            'customer' => $payload['customer_name'] ?? ($payload['customer_id'] ?? 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'deliveryDate' => $payload['delivery_date'] ?? now()->addDays(3)->toDateString(),
            'items' => count($payload['lines'] ?? []),
            'amount' => $payload['grand_total'] ?? 0,
            'vehicle' => $payload['vehicle_no'] ?? null,
            'driver' => $payload['driver_name'] ?? null,
            'status' => $payload['status'] ?? 'Draft',
        ];
        $items[] = $new; Cache::forever(self::DELIVERY_CHALLANS_CACHE_KEY, $items);
        return response()->json(['message' => 'Delivery challan created', 'data' => $new], 201);
    }

    public function updateDeliveryChallan(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY) ?? $this->getInitialDeliveryChallans();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Delivery challan not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::DELIVERY_CHALLANS_CACHE_KEY, $items);
        return response()->json(['message' => 'Delivery challan updated', 'data' => $updated]);
    }

    public function deleteDeliveryChallan($id): JsonResponse
    {
        $items = Cache::get(self::DELIVERY_CHALLANS_CACHE_KEY) ?? $this->getInitialDeliveryChallans();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::DELIVERY_CHALLANS_CACHE_KEY, $items);
        return response()->json(['message' => 'Delivery challan deleted']);
    }

    // ========================
    // Sales Invoices
    // ========================
    private const SALES_INVOICES_CACHE_KEY = 'fms_sales_invoices';

    protected function getInitialSalesInvoices(): array
    {
        return [
            ['id' => 1, 'number' => 'INV-2026-0102', 'customer' => 'Acme Corporation', 'date' => '2026-06-25', 'due' => '2026-07-25', 'amount' => 45000, 'currency' => 'USD', 'status' => 'Sent', 'items' => 3, 'billingMethod' => 'Credit'],
            ['id' => 2, 'number' => 'INV-2026-0103', 'customer' => 'Stark Industries', 'date' => '2026-06-26', 'due' => '2026-07-26', 'amount' => 128000, 'currency' => 'USD', 'status' => 'Pending', 'items' => 8, 'billingMethod' => 'Net 30'],
            ['id' => 3, 'number' => 'INV-2026-0104', 'customer' => 'Wayne Enterprises', 'date' => '2026-06-28', 'due' => '2026-07-28', 'amount' => 75000, 'currency' => 'USD', 'status' => 'Draft', 'items' => 4, 'billingMethod' => 'Due on Receipt'],
        ];
    }

    public function listSalesInvoices(): JsonResponse
    {
        $items = Cache::get(self::SALES_INVOICES_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialSalesInvoices(); Cache::forever(self::SALES_INVOICES_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getSalesInvoice($id): JsonResponse
    {
        $items = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Invoice not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createSalesInvoice(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('INV-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'customer' => $payload['customer_name'] ?? ((isset($payload['customer_id']) && $payload['customer_id'] !== '') ? 'Customer #' . $payload['customer_id'] : 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'due' => $payload['due_date'] ?? now()->addDays(30)->toDateString(),
            'amount' => $payload['grand_total'] ?? 0,
            'currency' => $payload['currency'] ?? 'USD',
            'status' => $payload['status'] ?? 'Draft',
            'items' => count($payload['lines'] ?? []),
            'billingMethod' => $payload['payment_terms'] ?? 'Net 30',
        ];
        $items[] = $new; Cache::forever(self::SALES_INVOICES_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales invoice created', 'data' => $new], 201);
    }

    public function updateSalesInvoice(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Invoice not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::SALES_INVOICES_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales invoice updated', 'data' => $updated]);
    }

    public function deleteSalesInvoice($id): JsonResponse
    {
        $items = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::SALES_INVOICES_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales invoice deleted']);
    }

    // ========================
    // Sales Invoice Share Links (QR / public link)
    // ========================
    private const SALES_INVOICE_SHARES_CACHE_KEY = 'fms_sales_invoice_shares';

    private function getInvoiceShares(): array
    {
        return Cache::get(self::SALES_INVOICE_SHARES_CACHE_KEY) ?? [];
    }

    private function findShareForInvoice(int $invoiceId): ?array
    {
        $shares = $this->getInvoiceShares();
        foreach ($shares as $share) {
            if ((int)$share['invoice_id'] === $invoiceId && !($share['revoked'] ?? false)) return $share;
        }
        return null;
    }

    public function createSalesInvoiceShare(Request $request, $id): JsonResponse
    {
        $invoices = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $invoice = collect($invoices)->firstWhere('id', (int)$id);
        if (!$invoice) return response()->json(['message' => 'Invoice not found'], 404);

        // Reuse existing active share unless ?regenerate=1
        $existing = $this->findShareForInvoice((int)$id);
        if ($existing && !$request->boolean('regenerate')) {
            return response()->json(['data' => ['share' => $existing]]);
        }

        $shares = array_values(array_filter($this->getInvoiceShares(), fn($s) => (int)$s['invoice_id'] !== (int)$id));
        $expiresDays = (int)($request->input('expires_in_days') ?? 0);
        $share = [
            'token' => Str::random(48),
            'invoice_id' => (int)$id,
            'created_at' => now()->toIso8601String(),
            'expires_at' => $expiresDays > 0 ? now()->addDays($expiresDays)->toIso8601String() : null,
            'views' => 0,
            'revoked' => false,
        ];
        $shares[] = $share;
        Cache::forever(self::SALES_INVOICE_SHARES_CACHE_KEY, $shares);

        return response()->json(['message' => 'Share link created', 'data' => ['share' => $share]], 201);
    }

    public function revokeSalesInvoiceShare($id): JsonResponse
    {
        $shares = $this->getInvoiceShares();
        $found = false;
        foreach ($shares as &$share) {
            if ((int)$share['invoice_id'] === (int)$id && !($share['revoked'] ?? false)) {
                $share['revoked'] = true;
                $share['revoked_at'] = now()->toIso8601String();
                $found = true;
            }
        }
        unset($share);
        if (!$found) return response()->json(['message' => 'No active share link for this invoice'], 404);
        Cache::forever(self::SALES_INVOICE_SHARES_CACHE_KEY, $shares);
        return response()->json(['message' => 'Share link revoked']);
    }

    public function getPublicSalesInvoice(string $token): JsonResponse
    {
        $shares = $this->getInvoiceShares();
        $share = collect($shares)->first(fn($s) => hash_equals($s['token'], $token));
        if (!$share || ($share['revoked'] ?? false)) {
            return response()->json(['message' => 'This invoice link is invalid or has been revoked.'], 404);
        }
        if (!empty($share['expires_at']) && now()->isAfter(\Carbon\Carbon::parse($share['expires_at']))) {
            return response()->json(['message' => 'This invoice link has expired.'], 410);
        }

        $invoices = Cache::get(self::SALES_INVOICES_CACHE_KEY) ?? $this->getInitialSalesInvoices();
        $invoice = collect($invoices)->firstWhere('id', (int)$share['invoice_id']);
        if (!$invoice || ($invoice['status'] ?? '') === 'Trash') {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $shares[$share['token']]['views'] = ($share['views'] ?? 0) + 1;
        Cache::forever(self::SALES_INVOICE_SHARES_CACHE_KEY, $shares);

        return response()->json([
            'data' => [
                'invoice' => $invoice,
                'shared_at' => $share['created_at'],
                'expires_at' => $share['expires_at'],
                'views' => $shares[$share['token']]['views'],
            ],
        ]);
    }

    // ========================
    // Credit Notes
    // ========================
    private const CREDIT_NOTES_CACHE_KEY = 'fms_credit_notes';

    protected function getInitialCreditNotes(): array
    {
        return [
            ['id' => 1, 'number' => 'CN-2026-0015', 'linkedInvoice' => 'INV-2026-0098', 'customer' => 'Acme Corporation', 'date' => '2026-06-22', 'amount' => 4500, 'currency' => 'USD', 'reason' => 'Damaged goods - RMA #8842', 'status' => 'Approved', 'items' => 1],
            ['id' => 2, 'number' => 'CN-2026-0016', 'linkedInvoice' => 'INV-2026-0100', 'customer' => 'Globex Industries', 'date' => '2026-06-24', 'amount' => 2800, 'currency' => 'USD', 'reason' => 'Price adjustment per agreement', 'status' => 'Pending', 'items' => 2],
            ['id' => 3, 'number' => 'CN-2026-0017', 'linkedInvoice' => 'INV-2026-0095', 'customer' => 'Initech Global', 'date' => '2026-06-26', 'amount' => 12000, 'currency' => 'USD', 'reason' => 'Service credit for downtime SLA breach', 'status' => 'Draft', 'items' => 1],
        ];
    }

    public function listCreditNotes(): JsonResponse
    {
        $items = Cache::get(self::CREDIT_NOTES_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialCreditNotes(); Cache::forever(self::CREDIT_NOTES_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getCreditNote($id): JsonResponse
    {
        $items = Cache::get(self::CREDIT_NOTES_CACHE_KEY) ?? $this->getInitialCreditNotes();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Credit note not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createCreditNote(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::CREDIT_NOTES_CACHE_KEY) ?? $this->getInitialCreditNotes();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('CN-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'linkedInvoice' => $payload['linked_invoice'] ?? '',
            'customer' => $payload['customer_name'] ?? ($payload['customer_id'] ?? 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'amount' => $payload['grand_total'] ?? 0,
            'currency' => $payload['currency'] ?? 'USD',
            'reason' => $payload['reason'] ?? '',
            'status' => $payload['status'] ?? 'Draft',
            'items' => count($payload['lines'] ?? []),
        ];
        $items[] = $new; Cache::forever(self::CREDIT_NOTES_CACHE_KEY, $items);
        return response()->json(['message' => 'Credit note created', 'data' => $new], 201);
    }

    public function updateCreditNote(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::CREDIT_NOTES_CACHE_KEY) ?? $this->getInitialCreditNotes();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Credit note not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::CREDIT_NOTES_CACHE_KEY, $items);
        return response()->json(['message' => 'Credit note updated', 'data' => $updated]);
    }

    public function deleteCreditNote($id): JsonResponse
    {
        $items = Cache::get(self::CREDIT_NOTES_CACHE_KEY) ?? $this->getInitialCreditNotes();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::CREDIT_NOTES_CACHE_KEY, $items);
        return response()->json(['message' => 'Credit note deleted']);
    }

    public function convertCreditNoteToRefund($id): JsonResponse
    {
        return response()->json(['message' => 'Credit note converted to refund']);
    }

    // ========================
    // Sales Returns
    // ========================
    private const SALES_RETURNS_CACHE_KEY = 'fms_sales_returns';

    protected function getInitialSalesReturns(): array
    {
        return [
            ['id' => 1, 'number' => 'SR-2026-0008', 'linkedInvoice' => 'INV-2026-0098', 'customer' => 'Acme Corporation', 'date' => '2026-06-20', 'amount' => 4500, 'currency' => 'USD', 'reason' => 'Damaged upon arrival', 'status' => 'Inspected', 'items' => 1],
            ['id' => 2, 'number' => 'SR-2026-0009', 'linkedInvoice' => 'INV-2026-0101', 'customer' => 'Globex Industries', 'date' => '2026-06-23', 'amount' => 3200, 'currency' => 'USD', 'reason' => 'Wrong specification delivered', 'status' => 'Pending', 'items' => 2],
            ['id' => 3, 'number' => 'SR-2026-0010', 'linkedInvoice' => 'INV-2026-0097', 'customer' => 'Initech Global', 'date' => '2026-06-25', 'amount' => 8700, 'currency' => 'USD', 'reason' => 'Customer return - change of mind', 'status' => 'Pending', 'items' => 1],
        ];
    }

    public function listSalesReturns(): JsonResponse
    {
        $items = Cache::get(self::SALES_RETURNS_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialSalesReturns(); Cache::forever(self::SALES_RETURNS_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getSalesReturn($id): JsonResponse
    {
        $items = Cache::get(self::SALES_RETURNS_CACHE_KEY) ?? $this->getInitialSalesReturns();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Sales return not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createSalesReturn(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::SALES_RETURNS_CACHE_KEY) ?? $this->getInitialSalesReturns();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'number' => $payload['document_number'] ?? ('SR-' . date('Y') . '-' . str_pad($newId, 4, '0', STR_PAD_LEFT)),
            'linkedInvoice' => $payload['linked_invoice'] ?? '',
            'customer' => $payload['customer_name'] ?? ($payload['customer_id'] ?? 'Unknown'),
            'date' => $payload['document_date'] ?? now()->toDateString(),
            'amount' => $payload['grand_total'] ?? 0,
            'currency' => $payload['currency'] ?? 'USD',
            'reason' => $payload['reason'] ?? '',
            'status' => $payload['status'] ?? 'Pending',
            'items' => count($payload['lines'] ?? []),
        ];
        $items[] = $new; Cache::forever(self::SALES_RETURNS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales return created', 'data' => $new], 201);
    }

    public function updateSalesReturn(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::SALES_RETURNS_CACHE_KEY) ?? $this->getInitialSalesReturns();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Sales return not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::SALES_RETURNS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales return updated', 'data' => $updated]);
    }

    public function deleteSalesReturn($id): JsonResponse
    {
        $items = Cache::get(self::SALES_RETURNS_CACHE_KEY) ?? $this->getInitialSalesReturns();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::SALES_RETURNS_CACHE_KEY, $items);
        return response()->json(['message' => 'Sales return deleted']);
    }

    // ========================
    // Contractor Payments
    // ========================
    private const CONTRACTORS_CACHE_KEY = 'fms_contractors';

    protected function getInitialContractors(): array
    {
        return [
            ['id' => 1, 'name' => 'Alex Rivers', 'type' => 'Individual', 'skill' => 'React Developer', 'rate' => 85, 'currency' => 'USD', 'status' => 'Active', 'country' => 'USA', 'totalPaid' => 40800, 'lastPayment' => '2026-06-08'],
            ['id' => 2, 'name' => 'DevOps Solutions', 'type' => 'Agency', 'skill' => 'Infrastructure', 'rate' => 0, 'currency' => 'USD', 'status' => 'Active', 'country' => 'UK', 'totalPaid' => 144000, 'lastPayment' => '2026-06-07'],
            ['id' => 3, 'name' => 'Sarah Chen', 'type' => 'Individual', 'skill' => 'UI Designer', 'rate' => 75, 'currency' => 'USD', 'status' => 'Active', 'country' => 'Canada', 'totalPaid' => 27000, 'lastPayment' => '2026-06-07'],
            ['id' => 4, 'name' => 'Cloud Architects', 'type' => 'Agency', 'skill' => 'Cloud Migration', 'rate' => 0, 'currency' => 'USD', 'status' => 'Active', 'country' => 'Germany', 'totalPaid' => 66000, 'lastPayment' => '2026-06-06'],
            ['id' => 5, 'name' => 'Mark Thompson', 'type' => 'Individual', 'skill' => 'Content Writer', 'rate' => 50, 'currency' => 'USD', 'status' => 'On Hold', 'country' => 'Australia', 'totalPaid' => 12000, 'lastPayment' => '2026-05-28'],
        ];
    }

    public function listContractors(): JsonResponse
    {
        $items = Cache::get(self::CONTRACTORS_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialContractors(); Cache::forever(self::CONTRACTORS_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getContractor($id): JsonResponse
    {
        $items = Cache::get(self::CONTRACTORS_CACHE_KEY) ?? $this->getInitialContractors();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Contractor not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createContractor(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::CONTRACTORS_CACHE_KEY) ?? $this->getInitialContractors();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'name' => $payload['name'] ?? '',
            'type' => $payload['type'] ?? 'Individual',
            'skill' => $payload['skill'] ?? '',
            'rate' => (float)($payload['rate'] ?? 0),
            'currency' => $payload['currency'] ?? 'USD',
            'status' => $payload['status'] ?? 'Active',
            'country' => $payload['country'] ?? '',
            'totalPaid' => (float)($payload['total_paid'] ?? 0),
            'lastPayment' => $payload['last_payment'] ?? now()->toDateString(),
        ];
        $items[] = $new; Cache::forever(self::CONTRACTORS_CACHE_KEY, $items);
        return response()->json(['message' => 'Contractor created', 'data' => $new], 201);
    }

    public function updateContractor(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::CONTRACTORS_CACHE_KEY) ?? $this->getInitialContractors();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Contractor not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::CONTRACTORS_CACHE_KEY, $items);
        return response()->json(['message' => 'Contractor updated', 'data' => $updated]);
    }

    public function deleteContractor($id): JsonResponse
    {
        $items = Cache::get(self::CONTRACTORS_CACHE_KEY) ?? $this->getInitialContractors();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::CONTRACTORS_CACHE_KEY, $items);
        return response()->json(['message' => 'Contractor deleted']);
    }

    // ========================
    // Expense Claims
    // ========================
    private const EXPENSE_CLAIMS_CACHE_KEY = 'fms_expense_claims';

    protected function getInitialExpenseClaims(): array
    {
        return [
            ['id' => 1, 'user' => 'Marcus Aurelius', 'type' => 'Travel', 'amount' => 1250.00, 'currency' => 'USD', 'date' => '2026-06-08', 'status' => 'In Review', 'risk' => 'Low', 'notes' => 'Flight tickets to NYC'],
            ['id' => 2, 'user' => 'Julia Domna', 'type' => 'Meals', 'amount' => 85.40, 'currency' => 'USD', 'date' => '2026-06-07', 'status' => 'Approved', 'risk' => 'Low', 'notes' => 'Client dinner'],
            ['id' => 3, 'user' => 'Lucius Verus', 'type' => 'Fuel', 'amount' => 120.00, 'currency' => 'USD', 'date' => '2026-06-07', 'status' => 'Pending', 'risk' => 'Medium', 'notes' => 'Business trip fuel'],
            ['id' => 4, 'user' => 'Septimius Severus', 'type' => 'Office', 'amount' => 450.00, 'currency' => 'USD', 'date' => '2026-06-06', 'status' => 'Paid', 'risk' => 'Low', 'notes' => 'Office supplies'],
            ['id' => 5, 'user' => 'Antoninus Pius', 'type' => 'Travel', 'amount' => 3200.00, 'currency' => 'USD', 'date' => '2026-06-05', 'status' => 'Pending', 'risk' => 'High', 'notes' => 'International conference'],
        ];
    }

    public function listExpenseClaims(): JsonResponse
    {
        $items = Cache::get(self::EXPENSE_CLAIMS_CACHE_KEY);
        if ($items === null) { $items = $this->getInitialExpenseClaims(); Cache::forever(self::EXPENSE_CLAIMS_CACHE_KEY, $items); }
        return response()->json(['data' => $items]);
    }

    public function getExpenseClaim($id): JsonResponse
    {
        $items = Cache::get(self::EXPENSE_CLAIMS_CACHE_KEY) ?? $this->getInitialExpenseClaims();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Expense claim not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createExpenseClaim(Request $request): JsonResponse
    {
        $payload = $request->all();
        $items = Cache::get(self::EXPENSE_CLAIMS_CACHE_KEY) ?? $this->getInitialExpenseClaims();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = [
            'id' => $newId,
            'user' => $payload['user'] ?? '',
            'type' => $payload['type'] ?? 'Other',
            'amount' => (float)($payload['amount'] ?? 0),
            'currency' => $payload['currency'] ?? 'USD',
            'date' => $payload['date'] ?? now()->toDateString(),
            'status' => $payload['status'] ?? 'Pending',
            'risk' => $payload['risk'] ?? 'Low',
            'notes' => $payload['notes'] ?? '',
        ];
        $items[] = $new; Cache::forever(self::EXPENSE_CLAIMS_CACHE_KEY, $items);
        return response()->json(['message' => 'Expense claim created', 'data' => $new], 201);
    }

    public function updateExpenseClaim(Request $request, $id): JsonResponse
    {
        $items = Cache::get(self::EXPENSE_CLAIMS_CACHE_KEY) ?? $this->getInitialExpenseClaims();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Expense claim not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated; Cache::forever(self::EXPENSE_CLAIMS_CACHE_KEY, $items);
        return response()->json(['message' => 'Expense claim updated', 'data' => $updated]);
    }

    public function deleteExpenseClaim($id): JsonResponse
    {
        $items = Cache::get(self::EXPENSE_CLAIMS_CACHE_KEY) ?? $this->getInitialExpenseClaims();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever(self::EXPENSE_CLAIMS_CACHE_KEY, $items);
        return response()->json(['message' => 'Expense claim deleted']);
    }

    // ========================
    // System Module Statuses
    // ========================
    public function systemModules(): JsonResponse
    {
        $modules = [
            ['code' => 'HRMS', 'name' => 'Human Capital', 'icon' => 'faUsers', 'color' => '#4f46e5', 'status' => 'Operational', 'uptime' => '99.9%', 'activeCount' => 128, 'description' => 'Complete human resources management covering employee records, payroll processing, attendance, leave tracking, and performance reviews.'],
            ['code' => 'PMS', 'name' => 'Project Control', 'icon' => 'faProjectDiagram', 'color' => '#10b981', 'status' => 'Operational', 'uptime' => '100%', 'activeCount' => 47, 'description' => 'End-to-end project lifecycle management with planning, resource allocation, milestone tracking, and deliverable coordination.'],
            ['code' => 'TMS', 'name' => 'Workflow Engine', 'icon' => 'faTasks', 'color' => '#f59e0b', 'status' => 'Operational', 'uptime' => '99.7%', 'activeCount' => 8, 'description' => 'Task and workflow automation engine for orchestrating approvals, assignments, deadlines, and cross-team collaboration.'],
            ['code' => 'DMS', 'name' => 'Global Repository', 'icon' => 'faFileAlt', 'color' => '#3b82f6', 'status' => 'Operational', 'uptime' => '99.9%', 'activeCount' => 2456, 'description' => 'Centralized document management with version control, access permissions, full-text search, and secure file sharing.'],
            ['code' => 'CRM', 'name' => 'Client Relations', 'icon' => 'faHandshake', 'color' => '#06b6d4', 'status' => 'Operational', 'uptime' => '100%', 'activeCount' => 0, 'description' => 'Enterprise customer relationship management for tracking leads, contacts, deals, pipelines, campaigns, and client communication history.'],
            ['code' => 'FMS', 'name' => 'Treasury Management', 'icon' => 'faWallet', 'color' => '#8b5cf6', 'status' => 'Audited', 'uptime' => '100%', 'activeCount' => 156, 'description' => 'Financial management suite covering accounts, ledgers, budgets, expense claims, invoicing, and real-time cash positions.'],
            ['code' => 'ASST', 'name' => 'Asset Management', 'icon' => 'faTools', 'color' => '#06b6d4', 'status' => 'In Building', 'uptime' => '--', 'activeCount' => 0, 'description' => 'Fixed asset lifecycle management including acquisition, depreciation, maintenance schedules, and disposal tracking.'],
            ['code' => 'INV', 'name' => 'Supply Chain', 'icon' => 'faBoxes', 'color' => '#f97316', 'status' => 'In Building', 'uptime' => '--', 'activeCount' => 0, 'description' => 'Inventory and supply chain control with stock levels, warehouses, purchase orders, vendors, and reorder automation.'],
            ['code' => 'MFG', 'name' => 'Manufacturing', 'icon' => 'faIndustry', 'color' => '#059669', 'status' => 'Operational', 'uptime' => '99.8%', 'activeCount' => 64, 'description' => 'Production and manufacturing operations covering bills of materials, work orders, quality control, and shop floor scheduling.'],
            ['code' => 'FX', 'name' => 'Multi-Currency', 'icon' => 'faDollarSign', 'color' => '#8b5cf6', 'status' => 'Operational', 'uptime' => '100%', 'activeCount' => 12, 'description' => 'Multi-currency and foreign exchange management with live rate handling, conversions, hedging, and exposure reporting.'],
            ['code' => 'AI', 'name' => 'AI Workspace', 'icon' => 'faBrain', 'color' => '#6366f1', 'status' => 'Operational', 'uptime' => '99.9%', 'activeCount' => 892, 'description' => 'Centralized enterprise reasoning over projects, documents, tasks, financial reports, HR policies, and organizational knowledge.'],
        ];

        return response()->json(['data' => $modules]);
    }

    // ========================================================================
    // Generic Tab Data Entity Handler (for 30+ FMS tab components)
    // ========================================================================
    private const ENTITY_MAP = [
        'white-labeling' => 'seedWhiteLabeling',
        'branding' => 'seedBranding',
        'client-billing' => 'seedClientBilling',
        'client-portal' => 'seedClientPortal',
        'online-payments' => 'seedOnlinePayments',
        'subscription-billing' => 'seedSubscriptionBilling',
        'treasury' => 'seedTreasury',
        'risk' => 'seedRisk',
        'cash-reserve' => 'seedCashReserve',
        'bi-reports' => 'seedBiReports',
        'executive-summary' => 'seedExecutiveSummary',
        'forecast-actual' => 'seedForecastActual',
        'data-viz' => 'seedDataViz',
        'drill-down' => 'seedDrillDown',
        'usage-analytics' => 'seedUsageAnalytics',
        'expense-reimbursement' => 'seedExpenseReimbursement',
        'employee-reimbursement' => 'seedEmployeeReimbursement',
        'receipt-upload' => 'seedReceiptUpload',
        'expense-categories' => 'seedExpenseCategories',
        'income-categories' => 'seedIncomeCategories',
        'recurring-transactions' => 'seedRecurringTransactions',
        'vat-gst' => 'seedVatGst',
        'withholding-tax' => 'seedWithholdingTax',
        'currency-exchange' => 'seedCurrencyExchange',
        'overtime' => 'seedOvertime',
        'commission' => 'seedCommission',
        'inventory-accounting' => 'seedInventoryAccounting',
        'stock-valuation' => 'seedStockValuation',
        'inventory-cost' => 'seedInventoryCost',
        'warehouse-financial' => 'seedWarehouseFinancial',
        'asset-tracking' => 'seedAssetTracking',
        'investment' => 'seedInvestment',
        'loan' => 'seedLoan',
        'emi' => 'seedEmi',
        'recurring-billing' => 'seedRecurringBilling',
        'export-reports' => 'seedExportReports',
        'automated-reports' => 'seedAutomatedReports',
        'data-backup' => 'seedDataBackup',
        'file-attachments' => 'seedFileAttachments',
        'e-signature' => 'seedESignature',
        'compliance-management' => 'seedComplianceManagement',
        'audit-compliance-reports' => 'seedAuditComplianceReports',
        'data-recovery' => 'seedDataRecovery',
        'ip-restrictions' => 'seedIpRestrictions',
        'regional-accounting' => 'seedRegionalAccounting',
        'financial-approval' => 'seedFinancialApproval',
        'budget-approval' => 'seedBudgetApproval',
        'scheduled-payments' => 'seedScheduledPayments',
        'refund-management' => 'seedRefundManagement',
        'refund-tracking' => 'seedRefundTracking',
        'kpi-monitoring' => 'seedKpiMonitoring',
        'goal-tracking' => 'seedGoalTracking',
        'calendar-integration' => 'seedCalendarIntegration',
        'financial-calendar' => 'seedFinancialCalendar',
        'reminder-system' => 'seedReminderSystem',
        'realtime-collaboration' => 'seedRealtimeCollaboration',
        'department-budgeting' => 'seedDepartmentBudgeting',
        'cost-center' => 'seedCostCenter',
        'profit-center' => 'seedProfitCenter',
        'project-cost' => 'seedProjectCost',
        'project-budget' => 'seedProjectBudget',
        'time-billing' => 'seedTimeBilling',
        'resource-cost' => 'seedResourceCost',
        'payroll-management' => 'seedPayrollManagement',
        'salary-processing' => 'seedSalaryProcessing',
        'payslip-generation' => 'seedPayslipGeneration',
        'tax-calculations' => 'seedTaxCalculations',
        'tax-management' => 'seedTaxManagement',
        'custom-report' => 'seedCustomReport',
        'session-management' => 'seedSessionManagement',
        'internal-notes' => 'seedInternalNotes',
        'approval-chains' => 'seedApprovalChains',
        'workflow-automation' => 'seedWorkflowAutomation',
        'csv-import-export' => 'seedCsvImportExport',
        'excel-import-export' => 'seedExcelImportExport',
        'pdf-export' => 'seedPdfExport',
        'tenant-management' => 'seedTenantManagement',
    ];

    public function listTabData($entity): JsonResponse
    {
        if (!isset(self::ENTITY_MAP[$entity])) return response()->json(['message' => 'Unknown entity'], 404);
        $key = 'fms_tab_' . $entity;
        $items = Cache::get($key);
        if ($items === null) { $method = self::ENTITY_MAP[$entity]; $items = $this->$method(); Cache::forever($key, $items); }
        return response()->json(['data' => $items]);
    }

    public function getTabDataItem($entity, $id): JsonResponse
    {
        if (!isset(self::ENTITY_MAP[$entity])) return response()->json(['message' => 'Unknown entity'], 404);
        $key = 'fms_tab_' . $entity; $method = self::ENTITY_MAP[$entity];
        $items = Cache::get($key) ?? $this->$method();
        $found = collect($items)->firstWhere('id', (int)$id);
        if (!$found) return response()->json(['message' => 'Item not found'], 404);
        return response()->json(['data' => $found]);
    }

    public function createTabData(Request $request, $entity): JsonResponse
    {
        if (!isset(self::ENTITY_MAP[$entity])) return response()->json(['message' => 'Unknown entity'], 404);
        $key = 'fms_tab_' . $entity; $method = self::ENTITY_MAP[$entity];
        $items = Cache::get($key) ?? $this->$method();
        $newId = count($items) > 0 ? max(array_column($items, 'id')) + 1 : 1;
        $new = array_merge(['id' => $newId], $request->all());
        $items[] = $new; Cache::forever($key, $items);
        return response()->json(['message' => 'Created', 'data' => $new], 201);
    }

    public function updateTabData(Request $request, $entity, $id): JsonResponse
    {
        if (!isset(self::ENTITY_MAP[$entity])) return response()->json(['message' => 'Unknown entity'], 404);
        $key = 'fms_tab_' . $entity; $method = self::ENTITY_MAP[$entity];
        $items = Cache::get($key) ?? $this->$method();
        $foundIndex = collect($items)->search(fn($i) => (int)$i['id'] === (int)$id);
        if ($foundIndex === false) return response()->json(['message' => 'Item not found'], 404);
        $updated = array_merge($items[$foundIndex], $request->all()); $items[$foundIndex] = $updated;
        Cache::forever($key, $items);
        return response()->json(['message' => 'Updated', 'data' => $updated]);
    }

    public function deleteTabData($entity, $id): JsonResponse
    {
        if (!isset(self::ENTITY_MAP[$entity])) return response()->json(['message' => 'Unknown entity'], 404);
        $key = 'fms_tab_' . $entity; $method = self::ENTITY_MAP[$entity];
        $items = Cache::get($key) ?? $this->$method();
        $items = array_values(array_filter($items, fn($i) => (int)$i['id'] !== (int)$id));
        Cache::forever($key, $items);
        return response()->json(['message' => 'Deleted']);
    }

    // ----- Seed Data Methods -----
    protected function seedWhiteLabeling(): array { return [
        ['id' => 1, 'name' => 'Acme Corp', 'domain' => 'acme.managecore.com', 'logo' => '/logos/acme.png', 'primaryColor' => '#4f46e5', 'status' => 'Published', 'lastModified' => '2026-06-15'],
        ['id' => 2, 'name' => 'Globex Inc', 'domain' => 'globex.managecore.com', 'logo' => '/logos/globex.png', 'primaryColor' => '#0ea5e9', 'status' => 'Draft', 'lastModified' => '2026-06-10'],
        ['id' => 3, 'name' => 'Initech', 'domain' => 'initech.managecore.com', 'logo' => '/logos/initech.png', 'primaryColor' => '#10b981', 'status' => 'Published', 'lastModified' => '2026-06-08'],
    ];}
    protected function seedBranding(): array { return [
        ['id' => 1, 'name' => 'Default Theme', 'type' => 'Light', 'primaryColor' => '#4f46e5', 'font' => 'Inter', 'status' => 'Active', 'lastModified' => '2026-06-01'],
        ['id' => 2, 'name' => 'Dark Mode Pro', 'type' => 'Dark', 'primaryColor' => '#6366f1', 'font' => 'Inter', 'status' => 'Active', 'lastModified' => '2026-06-05'],
        ['id' => 3, 'name' => 'High Contrast', 'type' => 'Accessibility', 'primaryColor' => '#2563eb', 'font' => 'Arial', 'status' => 'Draft', 'lastModified' => '2026-06-12'],
        ['id' => 4, 'name' => 'Minimal Light', 'type' => 'Light', 'primaryColor' => '#0ea5e9', 'font' => 'SF Pro', 'status' => 'Inactive', 'lastModified' => '2026-05-28'],
    ];}
    protected function seedClientBilling(): array { return [
        ['id' => 1, 'client' => 'Acme Corp', 'amount' => 12500, 'date' => '2026-06-01', 'due' => '2026-06-30', 'status' => 'Pending', 'method' => 'Bank Transfer'],
        ['id' => 2, 'client' => 'Globex Industries', 'amount' => 8400, 'date' => '2026-06-05', 'due' => '2026-07-05', 'status' => 'Sent', 'method' => 'Credit Card'],
        ['id' => 3, 'client' => 'Initech Global', 'amount' => 22000, 'date' => '2026-06-10', 'due' => '2026-06-25', 'status' => 'Paid', 'method' => 'Wire Transfer'],
        ['id' => 4, 'client' => 'Umbrella Corp', 'amount' => 5600, 'date' => '2026-06-12', 'due' => '2026-07-12', 'status' => 'Overdue', 'method' => 'Check'],
    ];}
    protected function seedClientPortal(): array { return [
        ['id' => 1, 'name' => 'ERP Integration', 'client' => 'Acme Corp', 'status' => 'In Progress', 'progress' => 75, 'due' => '2026-07-15', 'priority' => 'High', 'budget' => 45000],
        ['id' => 2, 'name' => 'Mobile App v2', 'client' => 'Globex Inc', 'status' => 'Completed', 'progress' => 100, 'due' => '2026-06-01', 'priority' => 'Medium', 'budget' => 32000],
        ['id' => 3, 'name' => 'Cloud Migration', 'client' => 'Initech', 'status' => 'On Hold', 'progress' => 40, 'due' => '2026-08-01', 'priority' => 'Low', 'budget' => 78000],
        ['id' => 4, 'name' => 'Security Audit', 'client' => 'Umbrella', 'status' => 'Not Started', 'progress' => 0, 'due' => '2026-09-01', 'priority' => 'High', 'budget' => 15000],
    ];}
    protected function seedOnlinePayments(): array { return [
        ['id' => 1, 'name' => 'Stripe', 'status' => 'Active', 'volume' => 245000, 'fee' => 2.9, 'uptime' => '99.99%', 'color' => '#6366f1'],
        ['id' => 2, 'name' => 'PayPal', 'status' => 'Active', 'volume' => 182000, 'fee' => 3.5, 'uptime' => '99.95%', 'color' => '#0ea5e9'],
        ['id' => 3, 'name' => 'Square', 'status' => 'Active', 'volume' => 96000, 'fee' => 2.6, 'uptime' => '99.90%', 'color' => '#10b981'],
        ['id' => 4, 'name' => 'Authorize.net', 'status' => 'Inactive', 'volume' => 0, 'fee' => 2.9, 'uptime' => '99.80%', 'color' => '#f59e0b'],
    ];}
    protected function seedSubscriptionBilling(): array { return [
        ['id' => 1, 'name' => 'Enterprise Plan', 'price' => 299, 'cycle' => 'Monthly', 'users' => 100, 'storage' => '1TB', 'apiLimit' => 'Unlimited', 'status' => 'Active', 'subscribers' => 48],
        ['id' => 2, 'name' => 'Professional Plan', 'price' => 149, 'cycle' => 'Monthly', 'users' => 50, 'storage' => '500GB', 'apiLimit' => '100K/day', 'status' => 'Active', 'subscribers' => 124],
        ['id' => 3, 'name' => 'Starter Plan', 'price' => 49, 'cycle' => 'Monthly', 'users' => 10, 'storage' => '100GB', 'apiLimit' => '10K/day', 'status' => 'Active', 'subscribers' => 312],
        ['id' => 4, 'name' => 'Enterprise Annual', 'price' => 2990, 'cycle' => 'Yearly', 'users' => 100, 'storage' => '1TB', 'apiLimit' => 'Unlimited', 'status' => 'Active', 'subscribers' => 12],
    ];}
    protected function seedTreasury(): array { return [
        ['id' => 1, 'name' => 'Chase Business', 'balance' => 842000, 'status' => 'Active', 'type' => 'Checking', 'accountNo' => '****4521'],
        ['id' => 2, 'name' => 'BOA Reserve', 'balance' => 520000, 'status' => 'Active', 'type' => 'Savings', 'accountNo' => '****7893'],
        ['id' => 3, 'name' => 'Wells Fargo Ops', 'balance' => 315000, 'status' => 'Active', 'type' => 'Checking', 'accountNo' => '****3356'],
        ['id' => 4, 'name' => 'Citi Forex', 'balance' => 228000, 'status' => 'Active', 'type' => 'Multi-Currency', 'accountNo' => '****9012'],
        ['id' => 5, 'name' => 'Credit Suisse', 'balance' => 145000, 'status' => 'Inactive', 'type' => 'Savings', 'accountNo' => '****6743'],
    ];}
    protected function seedRisk(): array { return [
        ['id' => 1, 'title' => 'Payment Gateway Outage', 'cat' => 'Operational', 'severity' => 'High', 'score' => 85, 'status' => 'Active', 'owner' => 'IT Ops'],
        ['id' => 2, 'title' => 'Currency Fluctuation', 'cat' => 'Market', 'severity' => 'Medium', 'score' => 62, 'status' => 'Active', 'owner' => 'Treasury'],
        ['id' => 3, 'title' => 'Data Privacy Compliance', 'cat' => 'Regulatory', 'severity' => 'High', 'score' => 91, 'status' => 'Monitoring', 'owner' => 'Legal'],
        ['id' => 4, 'title' => 'Vendor Concentration', 'cat' => 'Strategic', 'severity' => 'Low', 'score' => 34, 'status' => 'Mitigated', 'owner' => 'Procurement'],
        ['id' => 5, 'title' => 'Liquidity Shortfall', 'cat' => 'Financial', 'severity' => 'Critical', 'score' => 78, 'status' => 'Active', 'owner' => 'CFO'],
    ];}
    protected function seedCashReserve(): array { return [
        ['id' => 1, 'name' => 'Operating Reserve', 'amount' => 1200000, 'status' => 'Funded', 'target' => 1500000, 'monthly' => 50000],
        ['id' => 2, 'name' => 'Emergency Fund', 'amount' => 800000, 'status' => 'Funded', 'target' => 800000, 'monthly' => 0],
        ['id' => 3, 'name' => 'Capital Expenditure', 'amount' => 350000, 'status' => 'In Progress', 'target' => 600000, 'monthly' => 25000],
        ['id' => 4, 'name' => 'Tax Reserve', 'amount' => 450000, 'status' => 'Funded', 'target' => 500000, 'monthly' => 10000],
    ];}
    protected function seedBiReports(): array { return [
        ['id' => 1, 'name' => 'Revenue Dashboard', 'desc' => 'Real-time revenue tracking and forecasts', 'icon' => 'faChartLine', 'category' => 'Financial', 'lastRun' => '2026-06-15'],
        ['id' => 2, 'name' => 'Customer Analytics', 'desc' => 'Acquisition, retention, and churn analysis', 'icon' => 'faUsers', 'category' => 'CRM', 'lastRun' => '2026-06-14'],
        ['id' => 3, 'name' => 'Inventory Intelligence', 'desc' => 'Stock levels, turnover, and demand forecasting', 'icon' => 'faBoxes', 'category' => 'Supply Chain', 'lastRun' => '2026-06-13'],
        ['id' => 4, 'name' => 'HR Workforce Insights', 'desc' => 'Headcount, attrition, and productivity metrics', 'icon' => 'faUserTie', 'category' => 'HR', 'lastRun' => '2026-06-12'],
    ];}
    protected function seedExecutiveSummary(): array { return [
        ['id' => 1, 'title' => 'Q2 Revenue Growth', 'status' => 'On Track', 'trend' => 'up', 'value' => '+18.5%', 'target' => '+15%'],
        ['id' => 2, 'title' => 'Cost Reduction Initiative', 'status' => 'At Risk', 'trend' => 'down', 'value' => '-8.2%', 'target' => '-12%'],
        ['id' => 3, 'title' => 'Customer Acquisition', 'status' => 'On Track', 'trend' => 'up', 'value' => '+22.1%', 'target' => '+20%'],
        ['id' => 4, 'title' => 'Employee Satisfaction', 'status' => 'Completed', 'trend' => 'up', 'value' => '87/100', 'target' => '85/100'],
        ['id' => 5, 'title' => 'Market Expansion', 'status' => 'Delayed', 'trend' => 'down', 'value' => '3 Regions', 'target' => '5 Regions'],
    ];}
    protected function seedForecastActual(): array { return [
        ['id' => 1, 'name' => 'Revenue', 'projected' => 1200000, 'actual' => 1150000, 'variance' => -4.2, 'accuracy' => 95.8],
        ['id' => 2, 'name' => 'Cost of Goods', 'projected' => 600000, 'actual' => 585000, 'variance' => 2.5, 'accuracy' => 97.5],
        ['id' => 3, 'name' => 'Operating Expenses', 'projected' => 350000, 'actual' => 368000, 'variance' => -5.1, 'accuracy' => 94.9],
        ['id' => 4, 'name' => 'Net Profit', 'projected' => 250000, 'actual' => 197000, 'variance' => -21.2, 'accuracy' => 78.8],
    ];}
    protected function seedDataViz(): array { return [
        ['id' => 1, 'name' => 'Sales Performance', 'type' => 'Bar', 'dataPoints' => 24, 'lastUpdated' => '2026-06-15', 'status' => 'Published'],
        ['id' => 2, 'name' => 'User Growth', 'type' => 'Line', 'dataPoints' => 36, 'lastUpdated' => '2026-06-14', 'status' => 'Published'],
        ['id' => 3, 'name' => 'Market Share', 'type' => 'Pie', 'dataPoints' => 8, 'lastUpdated' => '2026-06-10', 'status' => 'Draft'],
        ['id' => 4, 'name' => 'Revenue Forecast', 'type' => 'Area', 'dataPoints' => 12, 'lastUpdated' => '2026-06-13', 'status' => 'Published'],
    ];}
    protected function seedDrillDown(): array { return [
        ['id' => 1, 'label' => 'North America', 'value' => 452000, 'change' => 12.5, 'sub' => 'Regional', 'type' => 'region', 'children' => 4],
        ['id' => 2, 'label' => 'Europe', 'value' => 328000, 'change' => 8.3, 'sub' => 'Regional', 'type' => 'region', 'children' => 3],
        ['id' => 3, 'label' => 'Asia Pacific', 'value' => 215000, 'change' => 22.1, 'sub' => 'Regional', 'type' => 'region', 'children' => 5],
        ['id' => 4, 'label' => 'Latin America', 'value' => 98000, 'change' => -3.7, 'sub' => 'Regional', 'type' => 'region', 'children' => 2],
    ];}
    protected function seedUsageAnalytics(): array { return [
        ['id' => 1, 'step' => 'Dashboard', 'hits' => 45200, 'drop' => 12],
        ['id' => 2, 'step' => 'Search', 'hits' => 39800, 'drop' => 8],
        ['id' => 3, 'step' => 'View Details', 'hits' => 32500, 'drop' => 15],
        ['id' => 4, 'step' => 'Add to Cart', 'hits' => 22100, 'drop' => 32],
        ['id' => 5, 'step' => 'Checkout', 'hits' => 15000, 'drop' => 25],
        ['id' => 6, 'step' => 'Payment', 'hits' => 11200, 'drop' => 10],
    ];}
    protected function seedExpenseReimbursement(): array { return [
        ['id' => 1, 'user' => 'Marcus Aurelius', 'dept' => 'Engineering', 'cat' => 'Travel', 'amt' => 1250, 'date' => '2026-06-08', 'status' => 'In Review', 'risk' => 'Low'],
        ['id' => 2, 'user' => 'Julia Domna', 'dept' => 'Marketing', 'cat' => 'Meals', 'amt' => 85.40, 'date' => '2026-06-07', 'status' => 'Approved', 'risk' => 'Low'],
        ['id' => 3, 'user' => 'Lucius Verus', 'dept' => 'Sales', 'cat' => 'Fuel', 'amt' => 120, 'date' => '2026-06-07', 'status' => 'Pending', 'risk' => 'Medium'],
        ['id' => 4, 'user' => 'Septimius Severus', 'dept' => 'Operations', 'cat' => 'Office', 'amt' => 450, 'date' => '2026-06-06', 'status' => 'Paid', 'risk' => 'Low'],
        ['id' => 5, 'user' => 'Antoninus Pius', 'dept' => 'Engineering', 'cat' => 'Travel', 'amt' => 3200, 'date' => '2026-06-05', 'status' => 'Pending', 'risk' => 'High'],
    ];}
    protected function seedEmployeeReimbursement(): array { return [
        ['id' => 1, 'emp' => 'Marcus Aurelius', 'cat' => 'Travel', 'amt' => 1250, 'date' => '2026-06-08', 'status' => 'In Review'],
        ['id' => 2, 'emp' => 'Julia Domna', 'cat' => 'Meals', 'amt' => 85.40, 'date' => '2026-06-07', 'status' => 'Approved'],
        ['id' => 3, 'emp' => 'Lucius Verus', 'cat' => 'Fuel', 'amt' => 120, 'date' => '2026-06-07', 'status' => 'Pending'],
        ['id' => 4, 'emp' => 'Septimius Severus', 'cat' => 'Office', 'amt' => 450, 'date' => '2026-06-06', 'status' => 'Paid'],
    ];}
    protected function seedReceiptUpload(): array { return [
        ['id' => 1, 'vendor' => 'Delta Airlines', 'amt' => 850, 'date' => '2026-06-08', 'cat' => 'Travel', 'status' => 'Verified', 'uploader' => 'Marcus A.', 'project' => 'Client Visit', 'dept' => 'Sales'],
        ['id' => 2, 'vendor' => 'Staples', 'amt' => 234.50, 'date' => '2026-06-07', 'cat' => 'Office', 'status' => 'Pending', 'uploader' => 'Julia D.', 'project' => 'Office Supply', 'dept' => 'Admin'],
        ['id' => 3, 'vendor' => 'Shell Gas', 'amt' => 67.80, 'date' => '2026-06-06', 'cat' => 'Fuel', 'status' => 'Verified', 'uploader' => 'Lucius V.', 'project' => 'Field Visit', 'dept' => 'Operations'],
        ['id' => 4, 'vendor' => 'Marriott Hotel', 'amt' => 450, 'date' => '2026-06-05', 'cat' => 'Accommodation', 'status' => 'Flagged', 'uploader' => 'Septimius S.', 'project' => 'Conference', 'dept' => 'Marketing'],
    ];}
    protected function seedExpenseCategories(): array { return [
        ['id' => 1, 'name' => 'Travel', 'code' => 'TRV', 'budget' => 120000, 'spent' => 78200, 'color' => '#4f46e5', 'status' => 'Active'],
        ['id' => 2, 'name' => 'Meals & Entertainment', 'code' => 'M&E', 'budget' => 60000, 'spent' => 42100, 'color' => '#10b981', 'status' => 'Active'],
        ['id' => 3, 'name' => 'Office Supplies', 'code' => 'OFS', 'budget' => 30000, 'spent' => 18500, 'color' => '#f59e0b', 'status' => 'Active'],
        ['id' => 4, 'name' => 'Utilities', 'code' => 'UTL', 'budget' => 45000, 'spent' => 38200, 'color' => '#0ea5e9', 'status' => 'Active'],
        ['id' => 5, 'name' => 'Training & Development', 'code' => 'T&D', 'budget' => 25000, 'spent' => 9200, 'color' => '#8b5cf6', 'status' => 'Inactive'],
    ];}
    protected function seedIncomeCategories(): array { return [
        ['id' => 1, 'name' => 'Product Sales', 'cat' => 'Core Revenue', 'rev' => 520000, 'delta' => 12.5, 'color' => '#4f46e5'],
        ['id' => 2, 'name' => 'Subscription Fees', 'cat' => 'Recurring', 'rev' => 285000, 'delta' => 22.3, 'color' => '#10b981'],
        ['id' => 3, 'name' => 'Consulting Services', 'cat' => 'Services', 'rev' => 145000, 'delta' => -3.2, 'color' => '#f59e0b'],
        ['id' => 4, 'name' => 'Licensing', 'cat' => 'Passive', 'rev' => 98000, 'delta' => 8.1, 'color' => '#0ea5e9'],
        ['id' => 5, 'name' => 'Investment Income', 'cat' => 'Passive', 'rev' => 42000, 'delta' => 15.7, 'color' => '#8b5cf6'],
    ];}
    protected function seedRecurringTransactions(): array { return [
        ['id' => 1, 'name' => 'AWS Cloud Services', 'amt' => 1250, 'freq' => 'Monthly', 'next' => '2026-07-01', 'status' => 'Active', 'vendor' => 'Amazon'],
        ['id' => 2, 'name' => 'Office Rent', 'amt' => 5000, 'freq' => 'Monthly', 'next' => '2026-07-01', 'status' => 'Active', 'vendor' => 'REIT Properties'],
        ['id' => 3, 'name' => 'Insurance Premium', 'amt' => 2400, 'freq' => 'Quarterly', 'next' => '2026-08-01', 'status' => 'Active', 'vendor' => 'Aetna'],
        ['id' => 4, 'name' => 'Software Licenses', 'amt' => 3200, 'freq' => 'Annual', 'next' => '2027-01-15', 'status' => 'Active', 'vendor' => 'Various'],
    ];}
    protected function seedVatGst(): array { return [
        ['id' => 1, 'region' => 'United States', 'type' => 'Sales Tax', 'rate' => 8.5, 'status' => 'Active', 'filingPeriod' => 'Quarterly'],
        ['id' => 2, 'region' => 'United Kingdom', 'type' => 'VAT', 'rate' => 20.0, 'status' => 'Active', 'filingPeriod' => 'Quarterly'],
        ['id' => 3, 'region' => 'Germany', 'type' => 'VAT', 'rate' => 19.0, 'status' => 'Active', 'filingPeriod' => 'Monthly'],
        ['id' => 4, 'region' => 'Australia', 'type' => 'GST', 'rate' => 10.0, 'status' => 'Active', 'filingPeriod' => 'Quarterly'],
        ['id' => 5, 'region' => 'UAE', 'type' => 'VAT', 'rate' => 5.0, 'status' => 'Active', 'filingPeriod' => 'Quarterly'],
    ];}
    protected function seedWithholdingTax(): array { return [
        ['id' => 1, 'name' => 'Freelance Solutions', 'cat' => 'Services', 'rate' => 10.0, 'withheld' => 8500, 'country' => 'USA', 'tin' => 'XX-XXXXXXX'],
        ['id' => 2, 'name' => 'Global Consulting Ltd', 'cat' => 'Consulting', 'rate' => 15.0, 'withheld' => 12400, 'country' => 'UK', 'tin' => 'GB-XXXXXX'],
        ['id' => 3, 'name' => 'Tech Partners GmbH', 'cat' => 'Technology', 'rate' => 19.0, 'withheld' => 9200, 'country' => 'Germany', 'tin' => 'DE-XXXXXXX'],
        ['id' => 4, 'name' => 'Design Studio Pty', 'cat' => 'Creative', 'rate' => 10.0, 'withheld' => 3400, 'country' => 'Australia', 'tin' => 'AU-XXXXX'],
    ];}
    protected function seedCurrencyExchange(): array { return [
        ['id' => 1, 'pair' => 'USD/EUR', 'rate' => 0.92, 'change' => 0.32, 'trend' => 'up', 'volume' => 125000000],
        ['id' => 2, 'pair' => 'USD/GBP', 'rate' => 0.79, 'change' => -0.15, 'trend' => 'down', 'volume' => 89200000],
        ['id' => 3, 'pair' => 'USD/JPY', 'rate' => 148.50, 'change' => 0.85, 'trend' => 'up', 'volume' => 156000000],
        ['id' => 4, 'pair' => 'EUR/GBP', 'rate' => 0.86, 'change' => -0.22, 'trend' => 'down', 'volume' => 45200000],
        ['id' => 5, 'pair' => 'USD/AUD', 'rate' => 1.52, 'change' => 0.41, 'trend' => 'up', 'volume' => 38100000],
    ];}
    protected function seedOvertime(): array { return [
        ['id' => 1, 'emp' => 'Marcus Aurelius', 'dept' => 'Engineering', 'hours' => 12, 'rate' => 45, 'total' => 540, 'status' => 'Approved', 'date' => '2026-06-14'],
        ['id' => 2, 'emp' => 'Julia Domna', 'dept' => 'Marketing', 'hours' => 8, 'rate' => 38, 'total' => 304, 'status' => 'Pending', 'date' => '2026-06-14'],
        ['id' => 3, 'emp' => 'Lucius Verus', 'dept' => 'Sales', 'hours' => 15, 'rate' => 42, 'total' => 630, 'status' => 'Approved', 'date' => '2026-06-13'],
        ['id' => 4, 'emp' => 'Septimius Severus', 'dept' => 'Operations', 'hours' => 6, 'rate' => 35, 'total' => 210, 'status' => 'Rejected', 'date' => '2026-06-12'],
    ];}
    protected function seedCommission(): array { return [
        ['id' => 1, 'name' => 'Sarah Mitchell', 'sales' => 145000, 'rate' => 5.0, 'comm' => 7250, 'target' => 120000, 'status' => 'Achieved'],
        ['id' => 2, 'name' => 'John Davis', 'sales' => 98000, 'rate' => 4.5, 'comm' => 4410, 'target' => 100000, 'status' => 'Below Target'],
        ['id' => 3, 'name' => 'Emily Chen', 'sales' => 210000, 'rate' => 6.0, 'comm' => 12600, 'target' => 150000, 'status' => 'Exceeded'],
        ['id' => 4, 'name' => 'Robert Kim', 'sales' => 75000, 'rate' => 4.0, 'comm' => 3000, 'target' => 90000, 'status' => 'Below Target'],
    ];}
    protected function seedInventoryAccounting(): array { return [
        ['id' => 1, 'account' => 'Raw Materials', 'debit' => 15000, 'credit' => 0, 'date' => '2026-06-15', 'desc' => 'Purchase of steel inventory'],
        ['id' => 2, 'account' => 'Work In Progress', 'debit' => 8200, 'credit' => 0, 'date' => '2026-06-14', 'desc' => 'Assembly labor allocation'],
        ['id' => 3, 'account' => 'Finished Goods', 'debit' => 0, 'credit' => 23400, 'date' => '2026-06-13', 'desc' => 'COGS recognition for orders'],
        ['id' => 4, 'account' => 'Inventory Reserve', 'debit' => 3200, 'credit' => 0, 'date' => '2026-06-12', 'desc' => 'Obsolete stock write-off'],
    ];}
    protected function seedStockValuation(): array { return [
        ['id' => 1, 'name' => 'Widget A', 'qty' => 1500, 'val' => 45000, 'total' => 67500000, 'model' => 'FIFO', 'category' => 'Components', 'location' => 'Warehouse A'],
        ['id' => 2, 'name' => 'Gadget B', 'qty' => 820, 'val' => 125, 'total' => 102500, 'model' => 'Weighted Avg', 'category' => 'Finished Goods', 'location' => 'Warehouse B'],
        ['id' => 3, 'name' => 'Raw Material X', 'qty' => 5000, 'val' => 8.50, 'total' => 42500, 'model' => 'FIFO', 'category' => 'Raw Materials', 'location' => 'Warehouse A'],
    ];}
    protected function seedInventoryCost(): array { return [
        ['id' => 1, 'name' => 'Steel Sheets', 'sku' => 'SS-001', 'category' => 'Raw Materials', 'unit_cost' => 45.00, 'effective_date' => '2026-06-01', 'variance' => 2.3],
        ['id' => 2, 'name' => 'Aluminum Bars', 'sku' => 'AB-002', 'category' => 'Raw Materials', 'unit_cost' => 32.50, 'effective_date' => '2026-06-01', 'variance' => -1.1],
        ['id' => 3, 'name' => 'Control Module', 'sku' => 'CM-003', 'category' => 'Components', 'unit_cost' => 128.00, 'effective_date' => '2026-05-15', 'variance' => 4.7],
        ['id' => 4, 'name' => 'Packaging Unit', 'sku' => 'PK-004', 'category' => 'Supplies', 'unit_cost' => 12.75, 'effective_date' => '2026-06-10', 'variance' => 0.5],
    ];}
    protected function seedWarehouseFinancial(): array { return [
        ['id' => 1, 'name' => 'Warehouse A - North', 'location' => 'Chicago, IL', 'operationalCost' => 45000, 'revenueGenerated' => 125000, 'margin' => 64.0, 'utilization' => 85],
        ['id' => 2, 'name' => 'Warehouse B - South', 'location' => 'Atlanta, GA', 'operationalCost' => 38000, 'revenueGenerated' => 98000, 'margin' => 61.2, 'utilization' => 72],
        ['id' => 3, 'name' => 'Warehouse C - West', 'location' => 'Los Angeles, CA', 'operationalCost' => 52000, 'revenueGenerated' => 142000, 'margin' => 63.4, 'utilization' => 91],
    ];}
    protected function seedAssetTracking(): array { return [
        ['id' => 1, 'name' => 'Server Rack X1', 'asset_code' => 'AST-001', 'category' => 'IT Equipment', 'purchase_cost' => 45000, 'current_value' => 32000, 'status' => 'In Use', 'location' => 'Data Center A', 'purchase_date' => '2024-03-15'],
        ['id' => 2, 'name' => 'Forklift B3', 'asset_code' => 'AST-002', 'category' => 'Heavy Machinery', 'purchase_cost' => 85000, 'current_value' => 62000, 'status' => 'In Use', 'location' => 'Warehouse B', 'purchase_date' => '2023-11-01'],
        ['id' => 3, 'name' => 'Office Building HQ', 'asset_code' => 'AST-003', 'category' => 'Real Estate', 'purchase_cost' => 2500000, 'current_value' => 2750000, 'status' => 'Active', 'location' => 'New York, NY', 'purchase_date' => '2020-06-01'],
        ['id' => 4, 'name' => 'Fleet Van V7', 'asset_code' => 'AST-004', 'category' => 'Vehicles', 'purchase_cost' => 42000, 'current_value' => 28000, 'status' => 'Under Maintenance', 'location' => 'Depot', 'purchase_date' => '2024-01-20'],
    ];}
    protected function seedInvestment(): array { return [
        ['id' => 1, 'name' => 'Tech Growth Fund', 'type' => 'Mutual Fund', 'capital' => 100000, 'current' => 128000, 'returns' => 28.0, 'risk' => 'High', 'allocation' => 25],
        ['id' => 2, 'name' => 'Corporate Bonds AAA', 'type' => 'Bonds', 'capital' => 150000, 'current' => 154500, 'returns' => 3.0, 'risk' => 'Low', 'allocation' => 30],
        ['id' => 3, 'name' => 'Real Estate REIT', 'type' => 'REIT', 'capital' => 80000, 'current' => 92000, 'returns' => 15.0, 'risk' => 'Medium', 'allocation' => 20],
        ['id' => 4, 'name' => 'S&P 500 Index', 'type' => 'Index Fund', 'capital' => 120000, 'current' => 141600, 'returns' => 18.0, 'risk' => 'Medium', 'allocation' => 25],
    ];}
    protected function seedLoan(): array { return [
        ['id' => 1, 'institution' => 'Chase Bank', 'type' => 'Term Loan', 'principal' => 500000, 'interest' => 6.5, 'tenure' => 60, 'balance' => 420000, 'status' => 'Active', 'nextPayment' => '2026-07-15'],
        ['id' => 2, 'institution' => 'Bank of America', 'type' => 'Line of Credit', 'principal' => 250000, 'interest' => 8.0, 'tenure' => 36, 'balance' => 150000, 'status' => 'Active', 'nextPayment' => '2026-07-01'],
        ['id' => 3, 'institution' => 'Wells Fargo', 'type' => 'Equipment Loan', 'principal' => 180000, 'interest' => 5.8, 'tenure' => 48, 'balance' => 110000, 'status' => 'Active', 'nextPayment' => '2026-08-01'],
    ];}
    protected function seedEmi(): array { return [
        ['id' => 1, 'loanId' => 1, 'amount' => 9750, 'dueDate' => '2026-07-15', 'daysLeft' => 15, 'status' => 'Upcoming', 'bank' => 'Chase Bank'],
        ['id' => 2, 'loanId' => 1, 'amount' => 9750, 'dueDate' => '2026-08-15', 'daysLeft' => 46, 'status' => 'Scheduled', 'bank' => 'Chase Bank'],
        ['id' => 3, 'loanId' => 2, 'amount' => 7850, 'dueDate' => '2026-07-01', 'daysLeft' => 1, 'status' => 'Due Soon', 'bank' => 'Bank of America'],
        ['id' => 4, 'loanId' => 2, 'amount' => 7850, 'dueDate' => '2026-06-01', 'daysLeft' => 0, 'status' => 'Paid', 'bank' => 'Bank of America'],
    ];}
    protected function seedRecurringBilling(): array { return [
        ['id' => 1, 'client' => 'Acme Corp', 'amount' => 12500, 'frequency' => 'Monthly', 'next' => '2026-07-01', 'status' => 'Active', 'method' => 'Bank Transfer'],
        ['id' => 2, 'client' => 'Globex Inc', 'amount' => 8400, 'frequency' => 'Monthly', 'next' => '2026-07-05', 'status' => 'Active', 'method' => 'Credit Card'],
        ['id' => 3, 'client' => 'Initech', 'amount' => 22000, 'frequency' => 'Quarterly', 'next' => '2026-08-01', 'status' => 'Active', 'method' => 'Wire Transfer'],
        ['id' => 4, 'client' => 'Umbrella Corp', 'amount' => 5600, 'frequency' => 'Monthly', 'next' => '2026-07-12', 'status' => 'Paused', 'method' => 'Check'],
        ['id' => 5, 'client' => 'Stark Industries', 'amount' => 45000, 'frequency' => 'Annual', 'next' => '2027-01-01', 'status' => 'Active', 'method' => 'Wire Transfer'],
    ];}
    protected function seedExportReports(): array { return [
        ['id' => 1, 'type' => 'CSV', 'name' => 'Chart of Accounts', 'rows' => 2450, 'status' => 'Completed', 'date' => '2026-06-15'],
        ['id' => 2, 'type' => 'Excel', 'name' => 'Revenue Report', 'rows' => 12800, 'status' => 'Failed', 'date' => '2026-06-14'],
        ['id' => 3, 'type' => 'PDF', 'name' => 'Invoice #INV-0098', 'rows' => 1, 'status' => 'Completed', 'date' => '2026-06-13'],
        ['id' => 4, 'type' => 'CSV', 'name' => 'Vendor Payments', 'rows' => 560, 'status' => 'Processing', 'date' => '2026-06-12'],
    ];}
    protected function seedAutomatedReports(): array { return [
        ['id' => 1, 'name' => 'Daily Revenue Summary', 'frequency' => 'Daily', 'recipient' => 'finance@acme.com', 'lastRun' => '2026-06-15', 'status' => 'Active'],
        ['id' => 2, 'name' => 'Weekly Payroll Report', 'frequency' => 'Weekly', 'recipient' => 'hr@acme.com', 'lastRun' => '2026-06-12', 'status' => 'Active'],
        ['id' => 3, 'name' => 'Monthly P&L Statement', 'frequency' => 'Monthly', 'recipient' => 'exec@acme.com', 'lastRun' => '2026-06-01', 'status' => 'Active'],
        ['id' => 4, 'name' => 'Quarterly Tax Filing', 'frequency' => 'Quarterly', 'recipient' => 'tax@acme.com', 'lastRun' => '2026-04-15', 'status' => 'Paused'],
    ];}
    protected function seedDataBackup(): array { return [
        ['id' => 1, 'name' => 'Full System Backup', 'type' => 'Full', 'size' => '2.4 TB', 'retention' => '30 Days', 'date' => '2026-06-15', 'status' => 'Completed'],
        ['id' => 2, 'name' => 'Database Snapshot', 'type' => 'Incremental', 'size' => '450 GB', 'retention' => '7 Days', 'date' => '2026-06-15', 'status' => 'Completed'],
        ['id' => 3, 'name' => 'File Server Backup', 'type' => 'Full', 'size' => '1.8 TB', 'retention' => '14 Days', 'date' => '2026-06-14', 'status' => 'Failed'],
        ['id' => 4, 'name' => 'Configuration Export', 'type' => 'Incremental', 'size' => '12 GB', 'retention' => '90 Days', 'date' => '2026-06-13', 'status' => 'Completed'],
    ];}
    protected function seedFileAttachments(): array { return [
        ['id' => 1, 'name' => 'Tax Invoice Q2.pdf', 'type' => 'PDF', 'category' => 'Tax', 'size' => '2.4 MB', 'owner' => 'Finance', 'date' => '2026-06-15'],
        ['id' => 2, 'name' => 'Bank Statement June.xlsx', 'type' => 'Excel', 'category' => 'Banking', 'size' => '1.1 MB', 'owner' => 'Treasury', 'date' => '2026-06-14'],
        ['id' => 3, 'name' => 'Audit Report 2025.pdf', 'type' => 'PDF', 'category' => 'Audit', 'size' => '8.5 MB', 'owner' => 'Compliance', 'date' => '2026-06-10'],
        ['id' => 4, 'name' => 'Contract - Vendor.pdf', 'type' => 'PDF', 'category' => 'Contracts', 'size' => '3.2 MB', 'owner' => 'Legal', 'date' => '2026-06-08'],
    ];}
    protected function seedESignature(): array { return [
        ['id' => 1, 'doc' => 'NDA Agreement - Acme', 'signer' => 'John Smith', 'status' => 'Signed', 'requested' => '2026-06-10', 'priority' => 'High'],
        ['id' => 2, 'doc' => 'Contract Renewal - Globex', 'signer' => 'Sarah Connor', 'status' => 'Pending', 'requested' => '2026-06-12', 'priority' => 'Medium'],
        ['id' => 3, 'doc' => 'Tax Filing Authorization', 'signer' => 'CFO Office', 'status' => 'Sent', 'requested' => '2026-06-14', 'priority' => 'High'],
        ['id' => 4, 'doc' => 'Employment Agreement', 'signer' => 'New Hire #12', 'status' => 'Draft', 'requested' => '2026-06-15', 'priority' => 'Low'],
    ];}
    protected function seedComplianceManagement(): array { return [
        ['id' => 1, 'title' => 'GDPR Data Audit Due', 'date' => '2026-07-15', 'impact' => 'High', 'status' => 'Open', 'owner' => 'DPO'],
        ['id' => 2, 'title' => 'SOX Financial Controls', 'date' => '2026-08-01', 'impact' => 'Critical', 'status' => 'In Progress', 'owner' => 'CFO'],
        ['id' => 3, 'title' => 'PCI DSS Recertification', 'date' => '2026-09-10', 'impact' => 'High', 'status' => 'Open', 'owner' => 'IT Security'],
        ['id' => 4, 'title' => 'AML/KYC Review', 'date' => '2026-06-30', 'impact' => 'Medium', 'status' => 'Closed', 'owner' => 'Compliance'],
    ];}
    protected function seedAuditComplianceReports(): array { return [
        ['id' => 1, 'name' => 'Q2 Financial Audit', 'date' => '2026-07-01', 'size' => '12.5 MB', 'status' => 'Draft', 'type' => 'Internal'],
        ['id' => 2, 'name' => 'SOC 2 Type II Report', 'date' => '2026-06-15', 'size' => '28.0 MB', 'status' => 'Final', 'type' => 'External'],
        ['id' => 3, 'name' => 'Tax Compliance 2025', 'date' => '2026-04-30', 'size' => '8.2 MB', 'status' => 'Final', 'type' => 'Regulatory'],
        ['id' => 4, 'name' => 'ITGC Audit Findings', 'date' => '2026-06-20', 'size' => '4.8 MB', 'status' => 'In Review', 'type' => 'Internal'],
    ];}
    protected function seedDataRecovery(): array { return [
        ['id' => 1, 'version' => 'v2026.06.15.01', 'date' => '2026-06-15', 'size' => '2.4 TB', 'type' => 'Full', 'status' => 'Validated'],
        ['id' => 2, 'version' => 'v2026.06.14.01', 'date' => '2026-06-14', 'size' => '450 GB', 'type' => 'Incremental', 'status' => 'Validated'],
        ['id' => 3, 'version' => 'v2026.06.13.01', 'date' => '2026-06-13', 'size' => '380 GB', 'type' => 'Incremental', 'status' => 'Validated'],
        ['id' => 4, 'version' => 'v2026.06.12.01', 'date' => '2026-06-12', 'size' => '2.3 TB', 'type' => 'Full', 'status' => 'Corrupted'],
    ];}
    protected function seedIpRestrictions(): array { return [
        ['id' => 1, 'ip' => '192.168.1.0/24', 'label' => 'HQ Network', 'type' => 'Allowlist', 'added' => '2026-01-15', 'status' => 'Active'],
        ['id' => 2, 'ip' => '10.0.0.0/8', 'label' => 'VPN Pool', 'type' => 'Allowlist', 'added' => '2026-02-01', 'status' => 'Active'],
        ['id' => 3, 'ip' => '185.220.101.0/24', 'label' => 'Blocked Region', 'type' => 'Blocklist', 'added' => '2026-03-10', 'status' => 'Active'],
        ['id' => 4, 'ip' => '203.0.113.0/24', 'label' => 'Suspicious Range', 'type' => 'Blocklist', 'added' => '2026-04-22', 'status' => 'Inactive'],
    ];}
    protected function seedRegionalAccounting(): array { return [
        ['id' => 1, 'region' => 'United States', 'standard' => 'GAAP', 'taxRule' => 'FIFO/IFRS', 'status' => 'Active', 'localization' => 'English (US)'],
        ['id' => 2, 'region' => 'United Kingdom', 'standard' => 'IFRS', 'taxRule' => 'VAT 20%', 'status' => 'Active', 'localization' => 'English (UK)'],
        ['id' => 3, 'region' => 'Germany', 'standard' => 'HGB', 'taxRule' => 'VAT 19%', 'status' => 'Active', 'localization' => 'German'],
        ['id' => 4, 'region' => 'Japan', 'standard' => 'JGAAP', 'taxRule' => 'Consumption 10%', 'status' => 'Active', 'localization' => 'Japanese'],
    ];}
    protected function seedFinancialApproval(): array { return [
        ['id' => 1, 'name' => 'Expense Reimbursement', 'steps' => 3, 'active' => 2, 'owner' => 'Finance', 'status' => 'Active', 'type' => 'Sequential'],
        ['id' => 2, 'name' => 'Purchase Order Approval', 'steps' => 4, 'active' => 3, 'owner' => 'Procurement', 'status' => 'Active', 'type' => 'Parallel'],
        ['id' => 3, 'name' => 'Vendor Payment Release', 'steps' => 2, 'active' => 1, 'owner' => 'Treasury', 'status' => 'Active', 'type' => 'Sequential'],
        ['id' => 4, 'name' => 'Budget Amendment', 'steps' => 5, 'active' => 0, 'owner' => 'CFO', 'status' => 'Draft', 'type' => 'Sequential'],
    ];}
    protected function seedBudgetApproval(): array { return [
        ['id' => 1, 'dept' => 'Engineering', 'amount' => 150000, 'period' => 'Q3 2026', 'status' => 'Approved', 'owner' => 'CTO', 'submitted' => '2026-06-01'],
        ['id' => 2, 'dept' => 'Marketing', 'amount' => 85000, 'period' => 'Q3 2026', 'status' => 'Pending', 'owner' => 'CMO', 'submitted' => '2026-06-05'],
        ['id' => 3, 'dept' => 'Operations', 'amount' => 120000, 'period' => 'Q3 2026', 'status' => 'In Review', 'owner' => 'COO', 'submitted' => '2026-06-03'],
        ['id' => 4, 'dept' => 'HR', 'amount' => 45000, 'period' => 'Q3 2026', 'status' => 'Draft', 'owner' => 'CHRO', 'submitted' => '2026-06-10'],
    ];}
    protected function seedScheduledPayments(): array { return [
        ['id' => 1, 'vendor' => 'AWS Cloud Services', 'amount' => 12500, 'date' => '2026-07-01', 'freq' => 'Monthly', 'status' => 'Scheduled', 'category' => 'Infrastructure'],
        ['id' => 2, 'vendor' => 'Office Rent - REIT', 'amount' => 5000, 'date' => '2026-07-01', 'freq' => 'Monthly', 'status' => 'Scheduled', 'category' => 'Operations'],
        ['id' => 3, 'vendor' => 'Insurance Premium', 'amount' => 2400, 'date' => '2026-08-01', 'freq' => 'Quarterly', 'status' => 'Upcoming', 'category' => 'Insurance'],
        ['id' => 4, 'vendor' => 'Vendor - Tech Supplies', 'amount' => 8500, 'date' => '2026-06-20', 'freq' => 'Monthly', 'status' => 'Processing', 'category' => 'Procurement'],
    ];}
    protected function seedRefundManagement(): array { return [
        ['id' => 1, 'customer' => 'Acme Corp', 'amount' => 4500, 'date' => '2026-06-10', 'reason' => 'Damaged goods', 'status' => 'Approved', 'method' => 'Bank Transfer'],
        ['id' => 2, 'customer' => 'Globex Inc', 'amount' => 1200, 'date' => '2026-06-12', 'reason' => 'Overpayment', 'status' => 'Pending', 'method' => 'Credit Card'],
        ['id' => 3, 'customer' => 'Initech', 'amount' => 8900, 'date' => '2026-06-08', 'reason' => 'Service cancellation', 'status' => 'Completed', 'method' => 'Wire Transfer'],
        ['id' => 4, 'customer' => 'Umbrella Corp', 'amount' => 750, 'date' => '2026-06-14', 'reason' => 'Wrong item', 'status' => 'Rejected', 'method' => 'Check'],
    ];}
    protected function seedRefundTracking(): array { return [
        ['id' => 1, 'item' => 'Refund #RF-2026-0042', 'status' => 'In Transit', 'loc' => 'Bank Processing', 'update' => '2026-06-15', 'progress' => 65],
        ['id' => 2, 'item' => 'Refund #RF-2026-0043', 'status' => 'Initiated', 'loc' => 'Finance Review', 'update' => '2026-06-14', 'progress' => 25],
        ['id' => 3, 'item' => 'Refund #RF-2026-0044', 'status' => 'Completed', 'loc' => 'Settled', 'update' => '2026-06-13', 'progress' => 100],
        ['id' => 4, 'item' => 'Refund #RF-2026-0045', 'status' => 'On Hold', 'loc' => 'Compliance Check', 'update' => '2026-06-12', 'progress' => 40],
    ];}
    protected function seedKpiMonitoring(): array { return [
        ['id' => 1, 'title' => 'Revenue Growth', 'actual' => 18.5, 'target' => 15.0, 'status' => 'On Track', 'color' => '#10b981', 'unit' => '%'],
        ['id' => 2, 'title' => 'Profit Margin', 'actual' => 22.3, 'target' => 25.0, 'status' => 'At Risk', 'color' => '#f59e0b', 'unit' => '%'],
        ['id' => 3, 'title' => 'Customer Acquisition Cost', 'actual' => 125, 'target' => 150, 'status' => 'On Track', 'color' => '#10b981', 'unit' => 'USD'],
        ['id' => 4, 'title' => 'Employee Satisfaction', 'actual' => 87, 'target' => 85, 'status' => 'Exceeded', 'color' => '#6366f1', 'unit' => 'Score'],
        ['id' => 5, 'title' => 'Net Promoter Score', 'actual' => 42, 'target' => 50, 'status' => 'Behind', 'color' => '#ef4444', 'unit' => 'Points'],
    ];}
    protected function seedGoalTracking(): array { return [
        ['id' => 1, 'title' => 'Q3 Revenue Target', 'type' => 'Revenue', 'target' => 5000000, 'progress' => 68, 'status' => 'On Track', 'deadline' => '2026-09-30'],
        ['id' => 2, 'title' => 'Cost Reduction Initiative', 'type' => 'Cost', 'target' => 500000, 'progress' => 42, 'status' => 'At Risk', 'deadline' => '2026-12-31'],
        ['id' => 3, 'title' => 'Market Expansion', 'type' => 'Growth', 'target' => 5, 'progress' => 60, 'status' => 'On Track', 'deadline' => '2026-12-31'],
        ['id' => 4, 'title' => 'Customer Retention Rate', 'type' => 'Quality', 'target' => 95, 'progress' => 94, 'status' => 'On Track', 'deadline' => '2026-12-31'],
    ];}
    protected function seedCalendarIntegration(): array { return [
        ['id' => 1, 'title' => 'Q2 Board Review', 'date' => '2026-07-15', 'type' => 'Meeting', 'priority' => 'High', 'status' => 'Confirmed'],
        ['id' => 2, 'title' => 'Tax Filing Deadline', 'date' => '2026-07-31', 'type' => 'Deadline', 'priority' => 'Critical', 'status' => 'Upcoming'],
        ['id' => 3, 'title' => 'Payroll Processing', 'date' => '2026-06-30', 'type' => 'Recurring', 'priority' => 'High', 'status' => 'Scheduled'],
        ['id' => 4, 'title' => 'Audit Committee Meeting', 'date' => '2026-08-10', 'type' => 'Meeting', 'priority' => 'Medium', 'status' => 'Tentative'],
    ];}
    protected function seedFinancialCalendar(): array { return [
        ['id' => 1, 'title' => 'Month-End Close', 'date' => '2026-06-30', 'entity' => 'All Departments', 'status' => 'Upcoming', 'type' => 'Recurring'],
        ['id' => 2, 'title' => 'Quarterly Reporting', 'date' => '2026-07-10', 'entity' => 'Finance', 'status' => 'Upcoming', 'type' => 'Recurring'],
        ['id' => 3, 'title' => 'Annual Budget Submission', 'date' => '2026-08-15', 'entity' => 'All Departments', 'status' => 'Planning', 'type' => 'Once'],
        ['id' => 4, 'title' => 'Tax Payment Due', 'date' => '2026-07-31', 'entity' => 'Tax Team', 'status' => 'Reminder', 'type' => 'Deadline'],
    ];}
    protected function seedReminderSystem(): array { return [
        ['id' => 1, 'title' => 'Invoice Due - Acme Corp', 'time' => '2026-06-20 09:00', 'channel' => 'Email', 'priority' => 'High', 'type' => 'Payment'],
        ['id' => 2, 'title' => 'Vendor Contract Renewal', 'time' => '2026-07-01 00:00', 'channel' => 'In-App', 'priority' => 'Medium', 'type' => 'Contract'],
        ['id' => 3, 'title' => 'Payroll Approval Required', 'time' => '2026-06-25 17:00', 'channel' => 'SMS', 'priority' => 'High', 'type' => 'Approval'],
        ['id' => 4, 'title' => 'System Backup Verification', 'time' => '2026-06-16 08:00', 'channel' => 'Email', 'priority' => 'Low', 'type' => 'System'],
    ];}
    protected function seedRealtimeCollaboration(): array { return [
        ['id' => 1, 'title' => 'Q3 Budget Planning', 'owner' => 'Alice M.', 'users' => 5, 'lastEdit' => '2 min ago', 'status' => 'Active', 'type' => 'Spreadsheet'],
        ['id' => 2, 'title' => 'Financial Statement Review', 'owner' => 'Bob K.', 'users' => 3, 'lastEdit' => '15 min ago', 'status' => 'Active', 'type' => 'Document'],
        ['id' => 3, 'title' => 'Audit Findings Resolution', 'owner' => 'Carol S.', 'users' => 7, 'lastEdit' => '1 hour ago', 'status' => 'Active', 'type' => 'Worksheet'],
        ['id' => 4, 'title' => 'Vendor Onboarding Checklist', 'owner' => 'Dave L.', 'users' => 2, 'lastEdit' => '1 day ago', 'status' => 'Idle', 'type' => 'Checklist'],
    ];}
    protected function seedDepartmentBudgeting(): array { return [
        ['id' => 1, 'dept' => 'Engineering', 'budget' => 500000, 'spent' => 325000, 'variance' => 35, 'status' => 'Under Budget', 'remaining' => 175000],
        ['id' => 2, 'dept' => 'Marketing', 'budget' => 300000, 'spent' => 245000, 'variance' => 18.3, 'status' => 'Under Budget', 'remaining' => 55000],
        ['id' => 3, 'dept' => 'Operations', 'budget' => 400000, 'spent' => 410000, 'variance' => -2.5, 'status' => 'Over Budget', 'remaining' => -10000],
        ['id' => 4, 'dept' => 'HR', 'budget' => 150000, 'spent' => 98000, 'variance' => 34.7, 'status' => 'Under Budget', 'remaining' => 52000],
    ];}
    protected function seedCostCenter(): array { return [
        ['id' => 1, 'name' => 'North America Ops', 'code' => 'CC-NA-001', 'type' => 'Regional', 'budget' => 2500000, 'branches' => 12, 'status' => 'Active'],
        ['id' => 2, 'name' => 'Europe Division', 'code' => 'CC-EU-002', 'type' => 'Regional', 'budget' => 1800000, 'branches' => 8, 'status' => 'Active'],
        ['id' => 3, 'name' => 'IT Infrastructure', 'code' => 'CC-IT-003', 'type' => 'Functional', 'budget' => 950000, 'branches' => 1, 'status' => 'Active'],
        ['id' => 4, 'name' => 'R&D Innovation Lab', 'code' => 'CC-RD-004', 'type' => 'Project', 'budget' => 650000, 'branches' => 2, 'status' => 'Inactive'],
    ];}
    protected function seedProfitCenter(): array { return [
        ['id' => 1, 'region' => 'North America', 'revenue' => 3200000, 'expenses' => 2100000, 'margin' => 34.4, 'status' => 'Profitable', 'growth' => 12.5],
        ['id' => 2, 'region' => 'Europe', 'revenue' => 2100000, 'expenses' => 1550000, 'margin' => 26.2, 'status' => 'Profitable', 'growth' => 8.3],
        ['id' => 3, 'region' => 'Asia Pacific', 'revenue' => 1400000, 'expenses' => 1100000, 'margin' => 21.4, 'status' => 'Profitable', 'growth' => 22.1],
        ['id' => 4, 'region' => 'Latin America', 'revenue' => 600000, 'expenses' => 580000, 'margin' => 3.3, 'status' => 'Break-even', 'growth' => -3.7],
    ];}
    protected function seedProjectCost(): array { return [
        ['id' => 1, 'name' => 'ERP Implementation', 'code' => 'PRJ-001', 'labor' => 450000, 'procurement' => 120000, 'travel' => 35000, 'profitability' => 18.5, 'status' => 'In Progress'],
        ['id' => 2, 'name' => 'Mobile App v3', 'code' => 'PRJ-002', 'labor' => 280000, 'procurement' => 45000, 'travel' => 12000, 'profitability' => 32.1, 'status' => 'Completed'],
        ['id' => 3, 'name' => 'Cloud Migration', 'code' => 'PRJ-003', 'labor' => 320000, 'procurement' => 180000, 'travel' => 8000, 'profitability' => 12.8, 'status' => 'At Risk'],
    ];}
    protected function seedProjectBudget(): array { return [
        ['id' => 1, 'name' => 'ERP Implementation', 'total' => 1200000, 'spent' => 780000, 'remaining' => 420000, 'health' => 'On Track', 'progress' => 65],
        ['id' => 2, 'name' => 'Mobile App v3', 'total' => 600000, 'spent' => 590000, 'remaining' => 10000, 'health' => 'Completed', 'progress' => 100],
        ['id' => 3, 'name' => 'Cloud Migration', 'total' => 800000, 'spent' => 560000, 'remaining' => 240000, 'health' => 'At Risk', 'progress' => 45],
        ['id' => 4, 'name' => 'Security Audit', 'total' => 150000, 'spent' => 75000, 'remaining' => 75000, 'health' => 'On Track', 'progress' => 30],
    ];}
    protected function seedTimeBilling(): array { return [
        ['id' => 1, 'resource' => 'Alice M. - Sr Developer', 'project' => 'ERP Implementation', 'hours' => 160, 'rate' => 150, 'total' => 24000, 'status' => 'Billed', 'period' => 'June 2026'],
        ['id' => 2, 'resource' => 'Bob K. - PM', 'project' => 'Mobile App v3', 'hours' => 120, 'rate' => 175, 'total' => 21000, 'status' => 'Pending', 'period' => 'June 2026'],
        ['id' => 3, 'resource' => 'Carol S. - Designer', 'project' => 'Cloud Migration', 'hours' => 80, 'rate' => 125, 'total' => 10000, 'status' => 'Approved', 'period' => 'June 2026'],
    ];}
    protected function seedResourceCost(): array { return [
        ['id' => 1, 'name' => 'Software Engineering', 'size' => 45, 'cost' => 6750000, 'capacity' => 85, 'optimization' => 'High', 'billable' => 92],
        ['id' => 2, 'name' => 'Design Team', 'size' => 12, 'cost' => 1440000, 'capacity' => 78, 'optimization' => 'Medium', 'billable' => 85],
        ['id' => 3, 'name' => 'Operations', 'size' => 28, 'cost' => 2240000, 'capacity' => 92, 'optimization' => 'High', 'billable' => 95],
        ['id' => 4, 'name' => 'Sales & Marketing', 'size' => 18, 'cost' => 2160000, 'capacity' => 70, 'optimization' => 'Low', 'billable' => 78],
    ];}
    protected function seedPayrollManagement(): array { return [
        ['id' => 1, 'period' => 'June 1-15, 2026', 'employees' => 128, 'gross' => 485000, 'net' => 368000, 'deductions' => 117000, 'status' => 'Completed', 'date' => '2026-06-15'],
        ['id' => 2, 'period' => 'May 16-31, 2026', 'employees' => 125, 'gross' => 472000, 'net' => 359000, 'deductions' => 113000, 'status' => 'Completed', 'date' => '2026-05-31'],
        ['id' => 3, 'period' => 'June 16-30, 2026', 'employees' => 130, 'gross' => 495000, 'net' => 0, 'deductions' => 0, 'status' => 'Processing', 'date' => '2026-06-30'],
    ];}
    protected function seedSalaryProcessing(): array { return [
        ['id' => 1, 'grade' => 'L1', 'min' => 35000, 'max' => 52000, 'median' => 42000, 'employees' => 42, 'color' => '#6366f1'],
        ['id' => 2, 'grade' => 'L2', 'min' => 52000, 'max' => 78000, 'median' => 62000, 'employees' => 35, 'color' => '#10b981'],
        ['id' => 3, 'grade' => 'L3', 'min' => 78000, 'max' => 110000, 'median' => 92000, 'employees' => 28, 'color' => '#f59e0b'],
        ['id' => 4, 'grade' => 'L4', 'min' => 110000, 'max' => 160000, 'median' => 135000, 'employees' => 15, 'color' => '#0ea5e9'],
        ['id' => 5, 'grade' => 'L5', 'min' => 160000, 'max' => 250000, 'median' => 200000, 'employees' => 8, 'color' => '#8b5cf6'],
    ];}
    protected function seedPayslipGeneration(): array { return [
        ['id' => 1, 'employee' => 'Marcus Aurelius', 'dept' => 'Engineering', 'period' => 'June 1-15, 2026', 'gross' => 5200, 'net' => 3950, 'status' => 'Generated', 'date' => '2026-06-15'],
        ['id' => 2, 'employee' => 'Julia Domna', 'dept' => 'Marketing', 'period' => 'June 1-15, 2026', 'gross' => 4200, 'net' => 3200, 'status' => 'Sent', 'date' => '2026-06-15'],
        ['id' => 3, 'employee' => 'Lucius Verus', 'dept' => 'Sales', 'period' => 'June 1-15, 2026', 'gross' => 4800, 'net' => 3650, 'status' => 'Generated', 'date' => '2026-06-15'],
        ['id' => 4, 'employee' => 'Septimius Severus', 'dept' => 'Operations', 'period' => 'May 16-31, 2026', 'gross' => 4500, 'net' => 3400, 'status' => 'Archived', 'date' => '2026-05-31'],
    ];}
    protected function seedTaxCalculations(): array { return [
        ['id' => 1, 'slab' => '0 – $11,000', 'rate' => 10, 'bracket' => 'Low', 'min' => 0, 'max' => 11000, 'employees' => 18],
        ['id' => 2, 'slab' => '$11,001 – $45,000', 'rate' => 12, 'bracket' => 'Medium', 'min' => 11001, 'max' => 45000, 'employees' => 42],
        ['id' => 3, 'slab' => '$45,001 – $95,000', 'rate' => 22, 'bracket' => 'High', 'min' => 45001, 'max' => 95000, 'employees' => 38],
        ['id' => 4, 'slab' => '$95,001 – $182,000', 'rate' => 24, 'bracket' => 'Very High', 'min' => 95001, 'max' => 182000, 'employees' => 22],
        ['id' => 5, 'slab' => '$182,001+', 'rate' => 37, 'bracket' => 'Top', 'min' => 182001, 'max' => 9999999, 'employees' => 8],
    ];}
    protected function seedTaxManagement(): array { return [
        ['id' => 1, 'type' => 'Corporate Income Tax', 'jurisdiction' => 'Federal', 'due' => '2026-09-15', 'amount' => 450000, 'status' => 'Upcoming', 'filed' => false],
        ['id' => 2, 'type' => 'Sales Tax Q2', 'jurisdiction' => 'State', 'due' => '2026-07-31', 'amount' => 85000, 'status' => 'Due Soon', 'filed' => false],
        ['id' => 3, 'type' => 'Payroll Tax', 'jurisdiction' => 'Federal/State', 'due' => '2026-07-15', 'amount' => 125000, 'status' => 'Filed', 'filed' => true],
        ['id' => 4, 'type' => 'Property Tax', 'jurisdiction' => 'Local', 'due' => '2026-08-01', 'amount' => 62000, 'status' => 'Upcoming', 'filed' => false],
    ];}
    protected function seedCustomReport(): array { return [
        ['id' => 1, 'name' => 'Revenue by Region', 'module' => 'FMS', 'created' => '2026-06-10', 'status' => 'Published', 'runCount' => 45],
        ['id' => 2, 'name' => 'Expense Analysis', 'module' => 'FMS', 'created' => '2026-06-08', 'status' => 'Draft', 'runCount' => 0],
        ['id' => 3, 'name' => 'Payroll Summary', 'module' => 'HRMS', 'created' => '2026-06-05', 'status' => 'Published', 'runCount' => 12],
        ['id' => 4, 'name' => 'Inventory Valuation', 'module' => 'INV', 'created' => '2026-06-01', 'status' => 'Draft', 'runCount' => 3],
    ];}
    protected function seedSessionManagement(): array { return [
        ['id' => 1, 'user' => 'admin@acme.com', 'device' => 'Chrome / Windows', 'ip' => '192.168.1.42', 'location' => 'New York, US', 'lastActive' => 'Now', 'isCurrent' => true],
        ['id' => 2, 'user' => 'julia@acme.com', 'device' => 'Safari / macOS', 'ip' => '10.0.0.85', 'location' => 'London, UK', 'lastActive' => '5 min ago', 'isCurrent' => false],
        ['id' => 3, 'user' => 'marcus@acme.com', 'device' => 'Firefox / Linux', 'ip' => '203.0.113.15', 'location' => 'Berlin, DE', 'lastActive' => '1 hour ago', 'isCurrent' => false],
        ['id' => 4, 'user' => 'lucius@acme.com', 'device' => 'Edge / Windows', 'ip' => '198.51.100.7', 'location' => 'Sydney, AU', 'lastActive' => '3 hours ago', 'isCurrent' => false],
    ];}
    protected function seedInternalNotes(): array { return [
        ['id' => 1, 'title' => 'Q3 Budget Meeting Notes', 'author' => 'Alice M.', 'date' => '2026-06-14', 'tags' => ['Budget', 'Meeting'], 'content' => 'Discussed allocation of $500k for engineering initiatives...', 'pinned' => true],
        ['id' => 2, 'title' => 'Audit Preparation Checklist', 'author' => 'Bob K.', 'date' => '2026-06-12', 'tags' => ['Audit', 'Compliance'], 'content' => 'Items to prepare for upcoming SOC 2 audit...', 'pinned' => true],
        ['id' => 3, 'title' => 'Vendor Evaluation Summary', 'author' => 'Carol S.', 'date' => '2026-06-10', 'tags' => ['Vendor', 'Procurement'], 'content' => 'Compared proposals from 3 cloud providers...', 'pinned' => false],
        ['id' => 4, 'title' => 'Policy Update Reminder', 'author' => 'Dave L.', 'date' => '2026-06-08', 'tags' => ['Policy'], 'content' => 'Reminder to review and update expense policy...', 'pinned' => false],
    ];}
    protected function seedApprovalChains(): array { return [
        ['id' => 1, 'name' => 'Expense Report < $5k', 'steps' => 2, 'type' => 'Sequential', 'status' => 'Active', 'lastUsed' => '2026-06-15'],
        ['id' => 2, 'name' => 'Purchase Order > $10k', 'steps' => 3, 'type' => 'Parallel', 'status' => 'Active', 'lastUsed' => '2026-06-14'],
        ['id' => 3, 'name' => 'Vendor Payment Release', 'steps' => 2, 'type' => 'Sequential', 'status' => 'Active', 'lastUsed' => '2026-06-12'],
        ['id' => 4, 'name' => 'Budget Amendment', 'steps' => 4, 'type' => 'Sequential', 'status' => 'Draft', 'lastUsed' => '2026-05-28'],
    ];}
    protected function seedWorkflowAutomation(): array { return [
        ['id' => 1, 'name' => 'Invoice Approval Flow', 'trigger' => 'Invoice Created', 'actions' => 3, 'status' => 'Active', 'icon' => 'faFileInvoice', 'color' => '#6366f1'],
        ['id' => 2, 'name' => 'PO Auto-Approval', 'trigger' => 'PO < $5,000', 'actions' => 2, 'status' => 'Active', 'icon' => 'faShoppingCart', 'color' => '#10b981'],
        ['id' => 3, 'name' => 'Expense Report Routing', 'trigger' => 'Expense Submitted', 'actions' => 4, 'status' => 'Active', 'icon' => 'faReceipt', 'color' => '#f59e0b'],
        ['id' => 4, 'name' => 'Vendor Onboarding', 'trigger' => 'New Vendor Created', 'actions' => 5, 'status' => 'Draft', 'icon' => 'faUserPlus', 'color' => '#0ea5e9'],
    ];}
    protected function seedCsvImportExport(): array { return [
        ['id' => 1, 'name' => 'Chart of Accounts Import', 'type' => 'Import', 'status' => 'Completed', 'date' => '2026-06-15', 'rows' => 2450, 'errors' => 12],
        ['id' => 2, 'name' => 'Vendor List Export', 'type' => 'Export', 'status' => 'Completed', 'date' => '2026-06-14', 'rows' => 560, 'errors' => 0],
        ['id' => 3, 'name' => 'Transaction Ledger Export', 'type' => 'Export', 'status' => 'Failed', 'date' => '2026-06-13', 'rows' => 0, 'errors' => 1],
        ['id' => 4, 'name' => 'Tax Codes Import', 'type' => 'Import', 'status' => 'Processing', 'date' => '2026-06-12', 'rows' => 85, 'errors' => 3],
    ];}
    protected function seedExcelImportExport(): array { return [
        ['id' => 1, 'type' => 'Export', 'name' => 'Full Chart of Accounts', 'rows' => 2450, 'status' => 'Completed', 'date' => '2026-06-15', 'format' => 'XLSX'],
        ['id' => 2, 'type' => 'Import', 'name' => 'Customer Balances', 'rows' => 890, 'status' => 'Completed', 'date' => '2026-06-14', 'format' => 'XLS'],
        ['id' => 3, 'type' => 'Export', 'name' => 'Monthly P&L Report', 'rows' => 48, 'status' => 'Failed', 'date' => '2026-06-13', 'format' => 'XLSX'],
        ['id' => 4, 'type' => 'Import', 'name' => 'Vendor Master Update', 'rows' => 320, 'status' => 'Processing', 'date' => '2026-06-12', 'format' => 'CSV'],
    ];}
    protected function seedPdfExport(): array { return [
        ['id' => 1, 'name' => 'Modern Corporate', 'desc' => 'Default clean layout with company branding', 'icon' => 'faTableColumns', 'pages' => 1, 'orientation' => 'Portrait'],
        ['id' => 2, 'name' => 'Executive Summary', 'desc' => 'Condensed format with KPI highlights', 'icon' => 'faChartBar', 'pages' => 2, 'orientation' => 'Portrait'],
        ['id' => 3, 'name' => 'Detailed Ledger', 'desc' => 'Full-width table with all transactions', 'icon' => 'faTable', 'pages' => 4, 'orientation' => 'Landscape'],
        ['id' => 4, 'name' => 'Invoice Template', 'desc' => 'Professional invoice layout', 'icon' => 'faFileInvoice', 'pages' => 1, 'orientation' => 'Portrait'],
    ];}
    protected function seedTenantManagement(): array { return [
        ['id' => 1, 'type' => 'stat', 'label' => 'Total Organizations', 'value' => '48', 'icon' => 'faGlobe', 'color' => '#4f46e5', 'progress' => 65],
        ['id' => 2, 'type' => 'stat', 'label' => 'Active Subscriptions', 'value' => '42', 'icon' => 'faCreditCard', 'color' => '#10b981', 'progress' => 55],
        ['id' => 3, 'type' => 'stat', 'label' => 'System-wide Users', 'value' => '18.4K', 'icon' => 'faUsersGear', 'color' => '#6366f1', 'progress' => 80],
        ['id' => 4, 'type' => 'tenant', 'name' => 'Acme Corp', 'domain' => 'acme.enterprise.com', 'plan' => 'Enterprise Gold', 'users' => 1250, 'status' => 'Active'],
        ['id' => 5, 'type' => 'tenant', 'name' => 'Globex Inc', 'domain' => 'globex.io', 'plan' => 'Professional', 'users' => 450, 'status' => 'Active'],
        ['id' => 6, 'type' => 'tenant', 'name' => 'Stark Industries', 'domain' => 'stark.tech', 'plan' => 'Enterprise Platinum', 'users' => 5000, 'status' => 'Suspended'],
        ['id' => 7, 'type' => 'tenant', 'name' => 'Wayne Enterp.', 'domain' => 'wayne.com', 'plan' => 'Standard', 'users' => 120, 'status' => 'Active'],
    ];}
}
