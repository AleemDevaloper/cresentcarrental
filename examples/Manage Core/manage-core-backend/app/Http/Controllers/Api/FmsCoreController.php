<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountGroup;
use App\Models\AccountType;
use App\Models\Currency;
use App\Models\ExchangeRate;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Services\Ams\ChartOfAccountsImportExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FmsCoreController extends Controller
{
    // ========================
    // Fiscal Years
    // ========================
    public function listFiscalYears(Request $request): JsonResponse
    {
        $q = FiscalYear::withCount('fiscalPeriods')->orderBy('start_date', 'desc');

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }
        if ($request->filled('q')) {
            $q->where('name', 'like', '%' . $request->q . '%');
        }

        $perPage = (int) $request->get('per_page', 25);
        $years = $q->paginate($perPage);

        return response()->json($years);
    }

    public function getFiscalYear($id): JsonResponse
    {
        $year = FiscalYear::with('fiscalPeriods')->findOrFail($id);
        return response()->json(['data' => $year]);
    }

    public function createFiscalYear(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'nullable|string|in:open,closed,draft',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'open';

        $year = FiscalYear::create($validated);

        return response()->json([
            'message' => 'Fiscal year created successfully',
            'data' => $year,
        ], 201);
    }

    public function updateFiscalYear(Request $request, $id): JsonResponse
    {
        $year = FiscalYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'status' => 'sometimes|string|in:open,closed,draft',
        ]);

        $year->fill($validated);
        $year->save();

        return response()->json([
            'message' => 'Fiscal year updated successfully',
            'data' => $year,
        ]);
    }

    public function deleteFiscalYear($id): JsonResponse
    {
        $year = FiscalYear::findOrFail($id);

        if ($year->fiscalPeriods()->where('status', 'open')->exists()) {
            return response()->json([
                'message' => 'Cannot delete fiscal year with open periods',
            ], 422);
        }

        $year->delete();
        return response()->json(['message' => 'Fiscal year deleted successfully']);
    }

    public function closeFiscalYear(Request $request, $id): JsonResponse
    {
        $year = FiscalYear::findOrFail($id);

        if ($year->status === 'closed') {
            return response()->json(['message' => 'Fiscal year is already closed'], 422);
        }

        $hasOpen = $year->fiscalPeriods()->where('status', 'open')->exists();
        if ($hasOpen) {
            return response()->json([
                'message' => 'Cannot close fiscal year with open periods. Close or lock all periods first.',
            ], 422);
        }

        DB::connection('tenant')->beginTransaction();
        try {
            $year->update([
                'status' => 'closed',
                'closed_at' => now(),
                'closed_by' => Auth::id(),
            ]);

            $year->fiscalPeriods()->where('status', 'open')->update(['status' => 'closed']);

            DB::connection('tenant')->commit();
        } catch (\Exception $e) {
            DB::connection('tenant')->rollBack();
            return response()->json(['message' => 'Failed to close fiscal year: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Fiscal year closed successfully']);
    }

    // ========================
    // Fiscal Periods
    // ========================
    public function listFiscalPeriods(Request $request, $fiscalYearId = null): JsonResponse
    {
        $q = FiscalPeriod::with('fiscalYear')->orderBy('start_date', 'asc');

        if ($fiscalYearId) {
            $q->where('fiscal_year_id', $fiscalYearId);
        } elseif ($request->filled('fiscal_year_id')) {
            $q->where('fiscal_year_id', $request->fiscal_year_id);
        }

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }

        $perPage = (int) $request->get('per_page', 25);
        $periods = $q->paginate($perPage);

        return response()->json($periods);
    }

    public function getFiscalPeriod($id): JsonResponse
    {
        $period = FiscalPeriod::with('fiscalYear')->findOrFail($id);
        return response()->json(['data' => $period]);
    }

    public function createFiscalPeriod(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fiscal_year_id' => 'required|exists:fiscal_years,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'nullable|string|in:open,closed,locked',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'open';

        $period = FiscalPeriod::create($validated);

        return response()->json([
            'message' => 'Fiscal period created successfully',
            'data' => $period,
        ], 201);
    }

    public function updateFiscalPeriod(Request $request, $id): JsonResponse
    {
        $period = FiscalPeriod::findOrFail($id);

        if ($period->status === 'locked') {
            return response()->json(['message' => 'Cannot edit a locked period'], 422);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'status' => 'sometimes|string|in:open,closed,locked',
        ]);

        $period->fill($validated);
        $period->save();

        return response()->json([
            'message' => 'Fiscal period updated successfully',
            'data' => $period,
        ]);
    }

    public function deleteFiscalPeriod($id): JsonResponse
    {
        $period = FiscalPeriod::findOrFail($id);

        if ($period->status === 'locked') {
            return response()->json(['message' => 'Cannot delete a locked period'], 422);
        }

        $period->delete();
        return response()->json(['message' => 'Fiscal period deleted successfully']);
    }

    public function lockFiscalPeriod(Request $request, $fiscalYearId, $periodId): JsonResponse
    {
        $period = FiscalPeriod::where('fiscal_year_id', $fiscalYearId)->findOrFail($periodId);

        if ($period->status === 'locked') {
            return response()->json(['message' => 'Period is already locked'], 422);
        }
        if ($period->status === 'closed') {
            return response()->json(['message' => 'Cannot lock a closed period'], 422);
        }

        $period->update([
            'status' => 'locked',
            'locked_at' => now(),
            'locked_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Period locked successfully', 'data' => $period]);
    }

    public function unlockFiscalPeriod(Request $request, $fiscalYearId, $periodId): JsonResponse
    {
        $period = FiscalPeriod::where('fiscal_year_id', $fiscalYearId)->findOrFail($periodId);

        if ($period->status !== 'locked') {
            return response()->json(['message' => 'Period is not locked'], 422);
        }

        $year = FiscalYear::find($fiscalYearId);
        if ($year && $year->status === 'closed') {
            return response()->json(['message' => 'Cannot unlock period in a closed fiscal year'], 422);
        }

        $period->update([
            'status' => 'open',
            'locked_at' => null,
            'locked_by' => null,
        ]);

        return response()->json(['message' => 'Period unlocked successfully', 'data' => $period]);
    }

    // ========================
    // Currencies
    // ========================
    public function listCurrencies(Request $request): JsonResponse
    {
        $q = Currency::query()->orderBy('code');

        if ($request->filled('is_active')) {
            $q->where('is_active', $request->boolean('is_active'));
        }
        if ($request->filled('q')) {
            $q->where(function ($query) use ($request) {
                $query->where('code', 'like', '%' . $request->q . '%')
                    ->orWhere('name', 'like', '%' . $request->q . '%');
            });
        }

        $perPage = (int) $request->get('per_page', 50);
        $currencies = $q->paginate($perPage);

        return response()->json($currencies);
    }

    public function getCurrency($id): JsonResponse
    {
        $currency = Currency::findOrFail($id);
        return response()->json(['data' => $currency]);
    }

    public function createCurrency(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:currencies,code',
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10',
            'is_base' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'decimal_places' => 'nullable|integer|min:0|max:8',
            'exchange_rate' => 'nullable|numeric|min:0',
        ]);

        if (!isset($validated['is_base'])) {
            $validated['is_base'] = false;
        }
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }
        if (!isset($validated['decimal_places'])) {
            $validated['decimal_places'] = 2;
        }
        if (!isset($validated['exchange_rate'])) {
            $validated['exchange_rate'] = 1.0;
        }

        if (!empty($validated['is_base'])) {
            Currency::where('is_base', true)->update(['is_base' => false]);
        }

        $currency = Currency::create($validated);

        return response()->json([
            'message' => 'Currency created successfully',
            'data' => $currency,
        ], 201);
    }

    public function updateCurrency(Request $request, $id): JsonResponse
    {
        $currency = Currency::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|max:10|unique:currencies,code,' . $id,
            'name' => 'sometimes|string|max:255',
            'symbol' => 'sometimes|string|max:10',
            'is_base' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'decimal_places' => 'sometimes|integer|min:0|max:8',
            'exchange_rate' => 'sometimes|numeric|min:0',
        ]);

        if (!empty($validated['is_base'])) {
            Currency::where('is_base', true)->where('id', '!=', $id)->update(['is_base' => false]);
        }

        $currency->fill($validated);
        $currency->save();

        return response()->json([
            'message' => 'Currency updated successfully',
            'data' => $currency,
        ]);
    }

    public function deleteCurrency($id): JsonResponse
    {
        $currency = Currency::findOrFail($id);

        if ($currency->is_base) {
            return response()->json(['message' => 'Cannot delete the base currency'], 422);
        }

        if ($currency->fromExchangeRates()->exists() || $currency->toExchangeRates()->exists()) {
            return response()->json(['message' => 'Cannot delete currency with existing exchange rates'], 422);
        }

        $currency->delete();
        return response()->json(['message' => 'Currency deleted successfully']);
    }

    // ========================
    // Exchange Rates
    // ========================
    public function listExchangeRates(Request $request): JsonResponse
    {
        $q = ExchangeRate::with('fromCurrency', 'toCurrency')->orderBy('effective_date', 'desc');

        if ($request->filled('from_currency_id')) {
            $q->where('from_currency_id', $request->from_currency_id);
        }
        if ($request->filled('to_currency_id')) {
            $q->where('to_currency_id', $request->to_currency_id);
        }
        if ($request->filled('is_active')) {
            $q->where('is_active', $request->boolean('is_active'));
        }

        $perPage = (int) $request->get('per_page', 25);
        $rates = $q->paginate($perPage);

        return response()->json($rates);
    }

    public function getExchangeRate($id): JsonResponse
    {
        $rate = ExchangeRate::with('fromCurrency', 'toCurrency')->findOrFail($id);
        return response()->json(['data' => $rate]);
    }

    public function createExchangeRate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_currency_id' => 'required|exists:currencies,id',
            'to_currency_id' => 'required|exists:currencies,id|different:from_currency_id',
            'rate' => 'required|numeric|min:0.00000001',
            'source' => 'nullable|string|max:255',
            'effective_date' => 'required|date',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['is_active'] = $validated['is_active'] ?? true;

        $rate = ExchangeRate::create($validated);

        return response()->json([
            'message' => 'Exchange rate created successfully',
            'data' => $rate->load('fromCurrency', 'toCurrency'),
        ], 201);
    }

    public function updateExchangeRate(Request $request, $id): JsonResponse
    {
        $rate = ExchangeRate::findOrFail($id);

        $validated = $request->validate([
            'from_currency_id' => 'sometimes|exists:currencies,id',
            'to_currency_id' => 'sometimes|exists:currencies,id',
            'rate' => 'sometimes|numeric|min:0.00000001',
            'source' => 'nullable|string|max:255',
            'effective_date' => 'sometimes|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $rate->fill($validated);
        $rate->save();

        return response()->json([
            'message' => 'Exchange rate updated successfully',
            'data' => $rate->load('fromCurrency', 'toCurrency'),
        ]);
    }

    public function deleteExchangeRate($id): JsonResponse
    {
        $rate = ExchangeRate::findOrFail($id);
        $rate->delete();

        return response()->json(['message' => 'Exchange rate deleted successfully']);
    }

    // ========================
    // Account Types
    // ========================
    public function listAccountTypes(Request $request): JsonResponse
    {
        $q = AccountType::withCount('accounts')->orderBy('code');

        if ($request->filled('q')) {
            $q->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('code', 'like', '%' . $request->q . '%');
            });
        }

        $types = $q->get();
        return response()->json(['data' => $types]);
    }

    public function getAccountType($id): JsonResponse
    {
        $type = AccountType::withCount('accounts')->with('groups')->findOrFail($id);
        return response()->json(['data' => $type]);
    }

    public function createAccountType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:account_types,name',
            'code' => 'nullable|string|max:50|unique:account_types,code',
            'description' => 'nullable|string',
        ]);

        $type = AccountType::create($validated);

        return response()->json([
            'message' => 'Account type created successfully',
            'data' => $type,
        ], 201);
    }

    public function updateAccountType(Request $request, $id): JsonResponse
    {
        $type = AccountType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:account_types,name,' . $id,
            'code' => 'sometimes|string|max:50|unique:account_types,code,' . $id,
            'description' => 'nullable|string',
        ]);

        $type->fill($validated);
        $type->save();

        return response()->json([
            'message' => 'Account type updated successfully',
            'data' => $type,
        ]);
    }

    public function deleteAccountType($id): JsonResponse
    {
        $type = AccountType::findOrFail($id);

        if ($type->accounts()->exists()) {
            return response()->json(['message' => 'Cannot delete account type with existing accounts'], 422);
        }

        $type->delete();
        return response()->json(['message' => 'Account type deleted successfully']);
    }

    // ========================
    // Account Groups
    // ========================
    public function listAccountGroups(Request $request): JsonResponse
    {
        $q = AccountGroup::with('type')->withCount('accounts')->orderBy('code');

        if ($request->filled('account_type_id')) {
            $q->where('account_type_id', $request->account_type_id);
        }
        if ($request->filled('q')) {
            $q->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('code', 'like', '%' . $request->q . '%');
            });
        }

        $groups = $q->get();
        return response()->json(['data' => $groups]);
    }

    public function getAccountGroup($id): JsonResponse
    {
        $group = AccountGroup::with('type')->withCount('accounts')->findOrFail($id);
        return response()->json(['data' => $group]);
    }

    public function createAccountGroup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_type_id' => 'required|exists:account_types,id',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group = AccountGroup::create($validated);

        return response()->json([
            'message' => 'Account group created successfully',
            'data' => $group->load('type'),
        ], 201);
    }

    public function updateAccountGroup(Request $request, $id): JsonResponse
    {
        $group = AccountGroup::findOrFail($id);

        $validated = $request->validate([
            'account_type_id' => 'sometimes|exists:account_types,id',
            'name' => 'sometimes|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group->fill($validated);
        $group->save();

        return response()->json([
            'message' => 'Account group updated successfully',
            'data' => $group->load('type'),
        ]);
    }

    public function deleteAccountGroup($id): JsonResponse
    {
        $group = AccountGroup::findOrFail($id);

        if ($group->accounts()->exists()) {
            return response()->json(['message' => 'Cannot delete account group with existing accounts'], 422);
        }

        $group->delete();
        return response()->json(['message' => 'Account group deleted successfully']);
    }

    // ========================
    // Chart of Accounts
    // ========================
    public function listChartOfAccounts(Request $request): JsonResponse
    {
        $q = Account::with('group', 'type', 'parent')
            ->withCount('children')
            ->orderBy('code');

        if ($request->filled('account_type_id')) {
            $q->where('account_type_id', $request->account_type_id);
        }
        if ($request->filled('account_group_id')) {
            $q->where('account_group_id', $request->account_group_id);
        }
        if ($request->filled('parent_id')) {
            $q->where('parent_id', $request->parent_id);
        }
        if ($request->filled('q')) {
            $q->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('code', 'like', '%' . $request->q . '%');
            });
        }
        if ($request->filled('is_contra')) {
            $q->where('is_contra', $request->boolean('is_contra'));
        }

        $perPage = (int) $request->get('per_page', 50);
        $accounts = $q->paginate($perPage);

        return response()->json($accounts);
    }

    public function getChartOfAccount($id): JsonResponse
    {
        $account = Account::with('group', 'type', 'parent', 'children')
            ->findOrFail($id);
        return response()->json(['data' => $account]);
    }

    public function createChartOfAccount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_group_id' => 'nullable|exists:account_groups,id',
            'account_type_id' => 'nullable|exists:account_types,id',
            'parent_id' => 'nullable|exists:accounts,id',
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric|min:0',
            'normal_balance' => 'nullable|string|in:debit,credit',
            'is_contra' => 'nullable|boolean',
            'is_draft' => 'nullable|boolean',
        ]);

        if (Account::where('code', $validated['code'])->exists()) {
            return response()->json(['message' => 'Account code already exists'], 422);
        }

        if (!isset($validated['opening_balance'])) {
            $validated['opening_balance'] = 0;
        }
        if (!isset($validated['is_contra'])) {
            $validated['is_contra'] = false;
        }
        if (!isset($validated['is_draft'])) {
            $validated['is_draft'] = false;
        }

        $account = Account::create($validated);

        return response()->json([
            'message' => 'Account created successfully',
            'data' => $account->load('group', 'type'),
        ], 201);
    }

    public function updateChartOfAccount(Request $request, $id): JsonResponse
    {
        $account = Account::findOrFail($id);

        $validated = $request->validate([
            'account_group_id' => 'nullable|exists:account_groups,id',
            'account_type_id' => 'nullable|exists:account_types,id',
            'parent_id' => 'nullable|exists:accounts,id',
            'code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
            'opening_balance' => 'nullable|numeric|min:0',
            'normal_balance' => 'nullable|string|in:debit,credit',
            'is_contra' => 'nullable|boolean',
            'is_draft' => 'nullable|boolean',
        ]);

        if (isset($validated['code']) && Account::where('code', $validated['code'])->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'Account code already exists'], 422);
        }

        $account->fill($validated);
        $account->save();

        return response()->json([
            'message' => 'Account updated successfully',
            'data' => $account->load('group', 'type'),
        ]);
    }

    public function deleteChartOfAccount($id): JsonResponse
    {
        $account = Account::findOrFail($id);

        if ($account->children()->exists()) {
            return response()->json(['message' => 'Cannot delete account with child accounts'], 422);
        }

        $account->delete();
        return response()->json(['message' => 'Account deleted successfully']);
    }

    // ========================
    // Chart of Accounts — Import / Export
    // ========================
    public function exportChartOfAccounts(Request $request, string $format)
    {
        $svc = app(ChartOfAccountsImportExportService::class);
        $format = strtolower($format);
        if ($format === 'xlsx') {
            return $svc->exportXlsx($request);
        }
        return $svc->exportCsv($request);
    }

    public function downloadCoaTemplate(string $format = 'csv')
    {
        $svc = app(ChartOfAccountsImportExportService::class);
        $format = strtolower($format);
        if ($format === 'xlsx') {
            return $svc->templateXlsx();
        }
        return $svc->templateCsv();
    }

    public function importChartOfAccounts(Request $request): JsonResponse
    {
        $svc = app(ChartOfAccountsImportExportService::class);
        return $svc->importCsv($request);
    }

    public function coaTemplateHeaders(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'headers' => ChartOfAccountsImportExportService::TEMPLATE_HEADERS,
            'sample' => ChartOfAccountsImportExportService::SAMPLE_ROW,
        ]);
    }
}
