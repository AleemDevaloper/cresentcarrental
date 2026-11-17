<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FxCurrency;
use App\Models\FxExchangeRate;
use App\Models\FxTransaction;
use App\Models\FxRevaluation;
use App\Models\FxRevaluationLine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FxController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalCurrencies = FxCurrency::count();
        $activeCurrencies = FxCurrency::active()->count();
        $ratesUpdatedToday = FxExchangeRate::whereDate('updated_at', today())->count();
        $totalRates = FxExchangeRate::active()->count();

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $transactionsThisMonth = FxTransaction::whereBetween('value_date', [$startOfMonth, $endOfMonth])->count();
        $completedTransactionsThisMonth = FxTransaction::whereBetween('value_date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->count();

        $totalBuyAmount = (float) FxTransaction::where('type', 'buy')
            ->where('status', 'completed')
            ->whereBetween('value_date', [$startOfMonth, $endOfMonth])
            ->sum('converted_amount');

        $totalSellAmount = (float) FxTransaction::where('type', 'sell')
            ->where('status', 'completed')
            ->whereBetween('value_date', [$startOfMonth, $endOfMonth])
            ->sum('converted_amount');

        $totalGain = (float) FxRevaluation::where('status', 'approved')->sum('total_gain');
        $totalLoss = (float) FxRevaluation::where('status', 'approved')->sum('total_loss');
        $netPosition = $totalGain - $totalLoss;

        $pendingRevaluations = FxRevaluation::pendingApproval()->count();

        $totalTransactionVolume = (float) FxTransaction::where('status', 'completed')
            ->whereBetween('value_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $avgExchangeRate = FxExchangeRate::active()->avg('rate') ?? 0;

        $currenciesWithRates = FxCurrency::active()->whereHas('fromExchangeRates', function ($q) {
            $q->active()->effective();
        })->count();

        return response()->json([
            'data' => [
                'total_currencies' => $totalCurrencies,
                'active_currencies' => $activeCurrencies,
                'rates_updated_today' => $ratesUpdatedToday,
                'total_rates' => $totalRates,
                'transactions_this_month' => $transactionsThisMonth,
                'completed_transactions' => $completedTransactionsThisMonth,
                'total_buy_amount' => round($totalBuyAmount, 4),
                'total_sell_amount' => round($totalSellAmount, 4),
                'total_gain' => round($totalGain, 4),
                'total_loss' => round($totalLoss, 4),
                'net_position' => round($netPosition, 4),
                'pending_revaluations' => $pendingRevaluations,
                'total_transaction_volume' => round($totalTransactionVolume, 4),
                'avg_exchange_rate' => round($avgExchangeRate, 4),
                'currencies_with_rates' => $currenciesWithRates,
            ],
        ]);
    }

    // ========================
    // Currencies
    // ========================
    public function listCurrencies(Request $request): JsonResponse
    {
        $query = FxCurrency::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('symbol', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('is_base_currency')) {
            $query->where('is_base_currency', $request->boolean('is_base_currency'));
        }

        if ($sortBy = $request->input('sort_by', 'code')) {
            $sortDir = $request->input('sort_dir', 'asc');
            $allowedSorts = ['code', 'name', 'symbol', 'decimal_places', 'created_at'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
            }
        }

        $perPage = $request->integer('per_page', 15);
        $currencies = $query->paginate($perPage);

        return response()->json([
            'data' => $currencies->items(),
            'pagination' => [
                'current_page' => $currencies->currentPage(),
                'per_page' => $currencies->perPage(),
                'total' => $currencies->total(),
                'last_page' => $currencies->lastPage(),
            ],
        ]);
    }

    public function getCurrency($id): JsonResponse
    {
        $currency = FxCurrency::withCount(['fromExchangeRates', 'toExchangeRates', 'fromTransactions', 'toTransactions'])
            ->find($id);

        if (!$currency) {
            return response()->json(['message' => 'Currency not found'], 404);
        }

        return response()->json(['data' => $currency]);
    }

    public function createCurrency(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:fx_currencies,code',
            'name' => 'required|string|max:255',
            'symbol' => 'nullable|string|max:10',
            'is_base_currency' => 'boolean',
            'is_active' => 'boolean',
            'decimal_places' => 'integer|min:0|max:8',
        ]);

        if (!empty($validated['is_base_currency']) && $validated['is_base_currency']) {
            FxCurrency::where('is_base_currency', true)->update(['is_base_currency' => false]);
        }

        $currency = FxCurrency::create([
            'code' => strtoupper($validated['code']),
            'name' => $validated['name'],
            'symbol' => $validated['symbol'] ?? null,
            'is_base_currency' => $validated['is_base_currency'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'decimal_places' => $validated['decimal_places'] ?? 2,
        ]);

        return response()->json([
            'data' => $currency,
            'message' => 'Currency created successfully',
        ], 201);
    }

    public function updateCurrency(Request $request, $id): JsonResponse
    {
        $currency = FxCurrency::find($id);

        if (!$currency) {
            return response()->json(['message' => 'Currency not found'], 404);
        }

        $validated = $request->validate([
            'code' => ['sometimes', 'required', 'string', 'max:10', Rule::unique('fx_currencies', 'code')->ignore($id)],
            'name' => 'sometimes|required|string|max:255',
            'symbol' => 'nullable|string|max:10',
            'is_base_currency' => 'boolean',
            'is_active' => 'boolean',
            'decimal_places' => 'integer|min:0|max:8',
        ]);

        if (!empty($validated['is_base_currency']) && $validated['is_base_currency']) {
            FxCurrency::where('is_base_currency', true)->where('id', '!=', $id)->update(['is_base_currency' => false]);
        }

        if (isset($validated['code'])) {
            $validated['code'] = strtoupper($validated['code']);
        }

        $currency->update($validated);

        return response()->json([
            'data' => $currency->fresh(),
            'message' => 'Currency updated successfully',
        ]);
    }

    public function deleteCurrency($id): JsonResponse
    {
        $currency = FxCurrency::find($id);

        if (!$currency) {
            return response()->json(['message' => 'Currency not found'], 404);
        }

        if ($currency->is_base_currency) {
            return response()->json(['message' => 'Cannot delete the base currency'], 422);
        }

        $hasTransactions = FxTransaction::where('from_currency_id', $id)
            ->orWhere('to_currency_id', $id)
            ->exists();

        if ($hasTransactions) {
            return response()->json(['message' => 'Cannot delete currency with existing transactions'], 422);
        }

        $hasRates = FxExchangeRate::where('from_currency_id', $id)
            ->orWhere('to_currency_id', $id)
            ->exists();

        if ($hasRates) {
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
        $query = FxExchangeRate::with(['fromCurrency', 'toCurrency']);

        if ($request->has('from_currency_id')) {
            $query->where('from_currency_id', $request->input('from_currency_id'));
        }

        if ($request->has('to_currency_id')) {
            $query->where('to_currency_id', $request->input('to_currency_id'));
        }

        if ($request->has('source')) {
            $query->where('source', $request->input('source'));
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->boolean('effective_only')) {
            $query->effective();
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('fromCurrency', function ($cq) use ($search) {
                    $cq->where('code', 'like', "%{$search}%");
                })->orWhereHas('toCurrency', function ($cq) use ($search) {
                    $cq->where('code', 'like', "%{$search}%");
                });
            });
        }

        if ($sortBy = $request->input('sort_by', 'effective_date')) {
            $sortDir = $request->input('sort_dir', 'desc');
            $allowedSorts = ['rate', 'effective_date', 'expiry_date', 'source', 'created_at'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
            }
        }

        $perPage = $request->integer('per_page', 15);
        $rates = $query->paginate($perPage);

        return response()->json([
            'data' => $rates->items(),
            'pagination' => [
                'current_page' => $rates->currentPage(),
                'per_page' => $rates->perPage(),
                'total' => $rates->total(),
                'last_page' => $rates->lastPage(),
            ],
        ]);
    }

    public function getExchangeRate($id): JsonResponse
    {
        $rate = FxExchangeRate::with(['fromCurrency', 'toCurrency'])->find($id);

        if (!$rate) {
            return response()->json(['message' => 'Exchange rate not found'], 404);
        }

        return response()->json(['data' => $rate]);
    }

    public function createExchangeRate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_currency_id' => 'required|exists:fx_currencies,id',
            'to_currency_id' => 'required|exists:fx_currencies,id',
            'rate' => 'required|numeric|min:0.00000001',
            'source' => 'required|in:manual,api,bank',
            'effective_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
            'is_active' => 'boolean',
        ]);

        if ($validated['from_currency_id'] == $validated['to_currency_id']) {
            return response()->json(['message' => 'From and to currencies must be different'], 422);
        }

        FxExchangeRate::where('from_currency_id', $validated['from_currency_id'])
            ->where('to_currency_id', $validated['to_currency_id'])
            ->where('is_active', true)
            ->update(['is_active' => false]);

        $rate = FxExchangeRate::create([
            'from_currency_id' => $validated['from_currency_id'],
            'to_currency_id' => $validated['to_currency_id'],
            'rate' => $validated['rate'],
            'source' => $validated['source'],
            'effective_date' => $validated['effective_date'],
            'expiry_date' => $validated['expiry_date'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => $request->user()?->id,
        ]);

        $rate->load(['fromCurrency', 'toCurrency']);

        return response()->json([
            'data' => $rate,
            'message' => 'Exchange rate created successfully',
        ], 201);
    }

    public function updateExchangeRate(Request $request, $id): JsonResponse
    {
        $rate = FxExchangeRate::find($id);

        if (!$rate) {
            return response()->json(['message' => 'Exchange rate not found'], 404);
        }

        $validated = $request->validate([
            'from_currency_id' => ['sometimes', 'required', 'exists:fx_currencies,id'],
            'to_currency_id' => ['sometimes', 'required', 'exists:fx_currencies,id'],
            'rate' => 'sometimes|required|numeric|min:0.00000001',
            'source' => 'sometimes|required|in:manual,api,bank',
            'effective_date' => 'sometimes|required|date',
            'expiry_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $fromId = $validated['from_currency_id'] ?? $rate->from_currency_id;
        $toId = $validated['to_currency_id'] ?? $rate->to_currency_id;

        if ($fromId == $toId) {
            return response()->json(['message' => 'From and to currencies must be different'], 422);
        }

        $rate->update($validated);
        $rate->load(['fromCurrency', 'toCurrency']);

        return response()->json([
            'data' => $rate->fresh(['fromCurrency', 'toCurrency']),
            'message' => 'Exchange rate updated successfully',
        ]);
    }

    public function deleteExchangeRate($id): JsonResponse
    {
        $rate = FxExchangeRate::find($id);

        if (!$rate) {
            return response()->json(['message' => 'Exchange rate not found'], 404);
        }

        $rate->delete();

        return response()->json(['message' => 'Exchange rate deleted successfully']);
    }

    public function syncExchangeRates(): JsonResponse
    {
        $ratesUpdated = FxExchangeRate::where('source', 'api')
            ->where('is_active', true)
            ->update(['updated_at' => now()]);

        $totalActive = FxExchangeRate::where('is_active', true)->count();

        return response()->json([
            'message' => 'Exchange rates synchronized successfully',
            'data' => [
                'rates_synced' => $ratesUpdated,
                'total_active_rates' => $totalActive,
                'synced_at' => now()->toDateTimeString(),
            ],
        ]);
    }

    // ========================
    // FX Transactions
    // ========================
    public function listFxTransactions(Request $request): JsonResponse
    {
        $query = FxTransaction::with(['fromCurrency', 'toCurrency']);

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('from_currency_id')) {
            $query->where('from_currency_id', $request->input('from_currency_id'));
        }

        if ($request->has('to_currency_id')) {
            $query->where('to_currency_id', $request->input('to_currency_id'));
        }

        if ($request->has('value_date_from')) {
            $query->where('value_date', '>=', $request->input('value_date_from'));
        }

        if ($request->has('value_date_to')) {
            $query->where('value_date', '<=', $request->input('value_date_to'));
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_number', 'like', "%{$search}%")
                    ->orWhere('counterparty', 'like', "%{$search}%")
                    ->orWhere('account_reference', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($sortBy = $request->input('sort_by', 'value_date')) {
            $sortDir = $request->input('sort_dir', 'desc');
            $allowedSorts = ['transaction_number', 'type', 'amount', 'exchange_rate', 'converted_amount', 'value_date', 'status', 'created_at'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
            }
        }

        $perPage = $request->integer('per_page', 15);
        $transactions = $query->paginate($perPage);

        $summaryQuery = FxTransaction::query();
        if ($request->has('type')) {
            $summaryQuery->where('type', $request->input('type'));
        }
        if ($request->has('status')) {
            $summaryQuery->where('status', $request->input('status'));
        }
        if ($request->has('from_currency_id')) {
            $summaryQuery->where('from_currency_id', $request->input('from_currency_id'));
        }
        if ($request->has('to_currency_id')) {
            $summaryQuery->where('to_currency_id', $request->input('to_currency_id'));
        }
        if ($request->has('value_date_from')) {
            $summaryQuery->where('value_date', '>=', $request->input('value_date_from'));
        }
        if ($request->has('value_date_to')) {
            $summaryQuery->where('value_date', '<=', $request->input('value_date_to'));
        }

        $totalBuy = (clone $summaryQuery)->where('type', 'buy')->sum('converted_amount');
        $totalSell = (clone $summaryQuery)->where('type', 'sell')->sum('converted_amount');
        $totalTransfer = (clone $summaryQuery)->where('type', 'transfer')->sum('converted_amount');

        return response()->json([
            'data' => $transactions->items(),
            'summary' => [
                'total_buy' => round($totalBuy, 4),
                'total_sell' => round($totalSell, 4),
                'total_transfer' => round($totalTransfer, 4),
            ],
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    public function getFxTransaction($id): JsonResponse
    {
        $transaction = FxTransaction::with(['fromCurrency', 'toCurrency'])->find($id);

        if (!$transaction) {
            return response()->json(['message' => 'FX transaction not found'], 404);
        }

        return response()->json(['data' => $transaction]);
    }

    public function createFxTransaction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:buy,sell,transfer',
            'from_currency_id' => 'required|exists:fx_currencies,id',
            'to_currency_id' => 'required|exists:fx_currencies,id',
            'amount' => 'required|numeric|min:0.0001',
            'exchange_rate' => 'required|numeric|min:0.00000001',
            'account_reference' => 'nullable|string|max:255',
            'counterparty' => 'nullable|string|max:255',
            'value_date' => 'required|date',
            'settlement_date' => 'nullable|date|after_or_equal:value_date',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validated['from_currency_id'] == $validated['to_currency_id']) {
            return response()->json(['message' => 'From and to currencies must be different'], 422);
        }

        $convertedAmount = round($validated['amount'] * $validated['exchange_rate'], 4);

        $transaction = FxTransaction::create([
            'transaction_number' => FxTransaction::generateTransactionNumber(),
            'type' => $validated['type'],
            'from_currency_id' => $validated['from_currency_id'],
            'to_currency_id' => $validated['to_currency_id'],
            'amount' => $validated['amount'],
            'exchange_rate' => $validated['exchange_rate'],
            'converted_amount' => $convertedAmount,
            'account_reference' => $validated['account_reference'] ?? null,
            'counterparty' => $validated['counterparty'] ?? null,
            'value_date' => $validated['value_date'],
            'settlement_date' => $validated['settlement_date'] ?? null,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        $transaction->load(['fromCurrency', 'toCurrency']);

        return response()->json([
            'data' => $transaction,
            'message' => 'FX transaction created successfully',
        ], 201);
    }

    public function updateFxTransaction(Request $request, $id): JsonResponse
    {
        $transaction = FxTransaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'FX transaction not found'], 404);
        }

        if ($transaction->status === 'completed') {
            return response()->json(['message' => 'Cannot update a completed transaction'], 422);
        }

        $validated = $request->validate([
            'type' => 'sometimes|required|in:buy,sell,transfer',
            'from_currency_id' => ['sometimes', 'required', 'exists:fx_currencies,id'],
            'to_currency_id' => ['sometimes', 'required', 'exists:fx_currencies,id'],
            'amount' => 'sometimes|required|numeric|min:0.0001',
            'exchange_rate' => 'sometimes|required|numeric|min:0.00000001',
            'account_reference' => 'nullable|string|max:255',
            'counterparty' => 'nullable|string|max:255',
            'value_date' => 'sometimes|required|date',
            'settlement_date' => 'nullable|date',
            'status' => 'sometimes|in:pending,completed,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        $fromId = $validated['from_currency_id'] ?? $transaction->from_currency_id;
        $toId = $validated['to_currency_id'] ?? $transaction->to_currency_id;

        if ($fromId == $toId) {
            return response()->json(['message' => 'From and to currencies must be different'], 422);
        }

        $amount = $validated['amount'] ?? $transaction->amount;
        $rate = $validated['exchange_rate'] ?? $transaction->exchange_rate;
        $validated['converted_amount'] = round($amount * $rate, 4);

        if (!isset($validated['status'])) {
            $validated['status'] = 'completed';
        }

        $transaction->update($validated);
        $transaction->load(['fromCurrency', 'toCurrency']);

        return response()->json([
            'data' => $transaction->fresh(['fromCurrency', 'toCurrency']),
            'message' => 'FX transaction updated successfully',
        ]);
    }

    public function deleteFxTransaction($id): JsonResponse
    {
        $transaction = FxTransaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'FX transaction not found'], 404);
        }

        if ($transaction->status === 'completed') {
            return response()->json(['message' => 'Cannot delete a completed transaction'], 422);
        }

        $transaction->delete();

        return response()->json(['message' => 'FX transaction deleted successfully']);
    }

    // ========================
    // Revaluations
    // ========================
    public function listRevaluations(Request $request): JsonResponse
    {
        $query = FxRevaluation::with('lines.currency');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('period_start')) {
            $query->where('period_start', '>=', $request->input('period_start'));
        }

        if ($request->has('period_end')) {
            $query->where('period_end', '<=', $request->input('period_end'));
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%");
            });
        }

        if ($sortBy = $request->input('sort_by', 'revaluation_date')) {
            $sortDir = $request->input('sort_dir', 'desc');
            $allowedSorts = ['revaluation_date', 'period_start', 'period_end', 'total_gain', 'total_loss', 'net_position', 'status', 'created_at'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
            }
        }

        $perPage = $request->integer('per_page', 15);
        $revaluations = $query->paginate($perPage);

        $stats = [
            'total_draft' => FxRevaluation::draft()->count(),
            'total_pending_approval' => FxRevaluation::pendingApproval()->count(),
            'total_approved' => FxRevaluation::approved()->count(),
            'total_gain' => round((float) FxRevaluation::approved()->sum('total_gain'), 4),
            'total_loss' => round((float) FxRevaluation::approved()->sum('total_loss'), 4),
        ];

        return response()->json([
            'data' => $revaluations->items(),
            'stats' => $stats,
            'pagination' => [
                'current_page' => $revaluations->currentPage(),
                'per_page' => $revaluations->perPage(),
                'total' => $revaluations->total(),
                'last_page' => $revaluations->lastPage(),
            ],
        ]);
    }

    public function getRevaluation($id): JsonResponse
    {
        $revaluation = FxRevaluation::with('lines.currency')->find($id);

        if (!$revaluation) {
            return response()->json(['message' => 'Revaluation not found'], 404);
        }

        return response()->json(['data' => $revaluation]);
    }

    public function createRevaluation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'revaluation_date' => 'required|date',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'notes' => 'nullable|string|max:2000',
            'lines' => 'required|array|min:1',
            'lines.*.account_reference' => 'required|string|max:255',
            'lines.*.currency_id' => 'required|exists:fx_currencies,id',
            'lines.*.balance_amount' => 'required|numeric',
            'lines.*.unrealized_rate' => 'required|numeric|min:0.00000001',
            'lines.*.realized_rate' => 'nullable|numeric|min:0.00000001',
            'lines.*.gain_amount' => 'nullable|numeric|min:0',
            'lines.*.loss_amount' => 'nullable|numeric|min:0',
            'lines.*.notes' => 'nullable|string|max:1000',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $totalGain = 0;
            $totalLoss = 0;

            foreach ($validated['lines'] as $line) {
                $totalGain += $line['gain_amount'] ?? 0;
                $totalLoss += $line['loss_amount'] ?? 0;
            }

            $netPosition = $totalGain - $totalLoss;

            $revaluation = FxRevaluation::create([
                'revaluation_date' => $validated['revaluation_date'],
                'period_start' => $validated['period_start'],
                'period_end' => $validated['period_end'],
                'status' => 'draft',
                'total_gain' => $totalGain,
                'total_loss' => $totalLoss,
                'net_position' => $netPosition,
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()?->id,
            ]);

            foreach ($validated['lines'] as $line) {
                FxRevaluationLine::create([
                    'revaluation_id' => $revaluation->id,
                    'account_reference' => $line['account_reference'],
                    'currency_id' => $line['currency_id'],
                    'balance_amount' => $line['balance_amount'],
                    'unrealized_rate' => $line['unrealized_rate'],
                    'realized_rate' => $line['realized_rate'] ?? null,
                    'gain_amount' => $line['gain_amount'] ?? 0,
                    'loss_amount' => $line['loss_amount'] ?? 0,
                    'notes' => $line['notes'] ?? null,
                ]);
            }

            $revaluation->load('lines.currency');

            return response()->json([
                'data' => $revaluation,
                'message' => 'Revaluation created successfully',
            ], 201);
        });
    }

    public function approveRevaluation(Request $request, $id): JsonResponse
    {
        $revaluation = FxRevaluation::find($id);

        if (!$revaluation) {
            return response()->json(['message' => 'Revaluation not found'], 404);
        }

        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string|max:2000',
        ]);

        if ($validated['action'] === 'approve') {
            $revaluation->update([
                'status' => 'approved',
                'approved_by' => $request->user()?->id,
                'approved_at' => now(),
                'notes' => $validated['notes'] ?? $revaluation->notes,
            ]);
        } else {
            $revaluation->update([
                'status' => 'rejected',
                'notes' => $validated['notes'] ?? $revaluation->notes,
            ]);
        }

        $revaluation->load('lines.currency');

        return response()->json([
            'data' => $revaluation->fresh('lines.currency'),
            'message' => 'Revaluation ' . $validated['action'] . 'd successfully',
        ]);
    }

    public function deleteRevaluation($id): JsonResponse
    {
        $revaluation = FxRevaluation::find($id);

        if (!$revaluation) {
            return response()->json(['message' => 'Revaluation not found'], 404);
        }

        if ($revaluation->status === 'approved') {
            return response()->json(['message' => 'Cannot delete an approved revaluation'], 422);
        }

        DB::transaction(function () use ($revaluation) {
            $revaluation->lines()->delete();
            $revaluation->delete();
        });

        return response()->json(['message' => 'Revaluation deleted successfully']);
    }

    // ========================
    // Analytics
    // ========================
    public function exposureAnalytics(): JsonResponse
    {
        $currencies = FxCurrency::active()->get();

        $exposure = [];

        foreach ($currencies as $currency) {
            $buyVolume = (float) FxTransaction::where('to_currency_id', $currency->id)
                ->where('type', 'buy')
                ->where('status', 'completed')
                ->sum('amount');

            $sellVolume = (float) FxTransaction::where('from_currency_id', $currency->id)
                ->where('type', 'sell')
                ->where('status', 'completed')
                ->sum('amount');

            $transferIn = (float) FxTransaction::where('to_currency_id', $currency->id)
                ->where('type', 'transfer')
                ->where('status', 'completed')
                ->sum('amount');

            $transferOut = (float) FxTransaction::where('from_currency_id', $currency->id)
                ->where('type', 'transfer')
                ->where('status', 'completed')
                ->sum('amount');

            $netExposure = ($buyVolume + $transferIn) - ($sellVolume + $transferOut);

            $activeRate = FxExchangeRate::where('to_currency_id', $currency->id)
                ->active()
                ->effective()
                ->first();

            $exposure[] = [
                'currency_id' => $currency->id,
                'code' => $currency->code,
                'name' => $currency->name,
                'symbol' => $currency->symbol,
                'buy_volume' => round($buyVolume, 4),
                'sell_volume' => round($sellVolume, 4),
                'transfer_in' => round($transferIn, 4),
                'transfer_out' => round($transferOut, 4),
                'net_exposure' => round($netExposure, 4),
                'current_rate' => $activeRate?->rate,
                'net_exposure_base' => $activeRate ? round($netExposure * $activeRate->rate, 4) : null,
            ];
        }

        $totalExposure = array_sum(array_column($exposure, 'net_exposure_base'));

        return response()->json([
            'data' => [
                'exposures' => $exposure,
                'total_net_exposure' => round($totalExposure, 4),
                'generated_at' => now()->toDateTimeString(),
            ],
        ]);
    }

    public function gainLossSummary(): JsonResponse
    {
        $period = request()->input('period', 'monthly');
        $startDate = request()->input('start_date', now()->subMonths(12)->startOfMonth()->toDateString());
        $endDate = request()->input('end_date', now()->toDateString());

        $revaluations = FxRevaluation::where('status', 'approved')
            ->whereBetween('revaluation_date', [$startDate, $endDate])
            ->with('lines.currency')
            ->get();

        $byCurrency = [];
        $byPeriod = [];

        foreach ($revaluations as $revaluation) {
            $periodKey = $revaluation->revaluation_date instanceof \Carbon\Carbon
                ? $revaluation->revaluation_date->format('Y-m')
                : date('Y-m', strtotime($revaluation->revaluation_date));

            if (!isset($byPeriod[$periodKey])) {
                $byPeriod[$periodKey] = ['gain' => 0, 'loss' => 0, 'net' => 0];
            }
            $byPeriod[$periodKey]['gain'] += (float) $revaluation->total_gain;
            $byPeriod[$periodKey]['loss'] += (float) $revaluation->total_loss;
            $byPeriod[$periodKey]['net'] += (float) $revaluation->net_position;

            foreach ($revaluation->lines as $line) {
                $currencyCode = $line->currency?->code ?? 'Unknown';
                if (!isset($byCurrency[$currencyCode])) {
                    $byCurrency[$currencyCode] = [
                        'currency_id' => $line->currency_id,
                        'code' => $currencyCode,
                        'gain' => 0,
                        'loss' => 0,
                        'net' => 0,
                    ];
                }
                $byCurrency[$currencyCode]['gain'] += (float) $line->gain_amount;
                $byCurrency[$currencyCode]['loss'] += (float) $line->loss_amount;
                $byCurrency[$currencyCode]['net'] += (float) $line->gain_amount - (float) $line->loss_amount;
            }
        }

        $totalGain = (float) $revaluations->sum('total_gain');
        $totalLoss = (float) $revaluations->sum('total_loss');

        return response()->json([
            'data' => [
                'summary' => [
                    'total_gain' => round($totalGain, 4),
                    'total_loss' => round($totalLoss, 4),
                    'net_position' => round($totalGain - $totalLoss, 4),
                    'period' => $period,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                'by_currency' => array_values($byCurrency),
                'by_period' => $byPeriod,
                'revaluation_count' => $revaluations->count(),
            ],
        ]);
    }

    public function treasurySummary(): JsonResponse
    {
        $currencies = FxCurrency::active()->get();

        $positions = [];

        foreach ($currencies as $currency) {
            $completedBuyAmount = (float) FxTransaction::where('to_currency_id', $currency->id)
                ->where('type', 'buy')
                ->where('status', 'completed')
                ->sum('converted_amount');

            $completedSellAmount = (float) FxTransaction::where('from_currency_id', $currency->id)
                ->where('type', 'sell')
                ->where('status', 'completed')
                ->sum('amount');

            $pendingBuyAmount = (float) FxTransaction::where('to_currency_id', $currency->id)
                ->where('type', 'buy')
                ->where('status', 'pending')
                ->sum('converted_amount');

            $pendingSellAmount = (float) FxTransaction::where('from_currency_id', $currency->id)
                ->where('type', 'sell')
                ->where('status', 'pending')
                ->sum('amount');

            $totalTransactions = FxTransaction::where(function ($q) use ($currency) {
                $q->where('from_currency_id', $currency->id)
                    ->orWhere('to_currency_id', $currency->id);
            })->count();

            $activeRate = FxExchangeRate::where('to_currency_id', $currency->id)
                ->active()
                ->effective()
                ->first();

            $netPosition = $completedBuyAmount - $completedSellAmount;

            $positions[] = [
                'currency_id' => $currency->id,
                'code' => $currency->code,
                'name' => $currency->name,
                'symbol' => $currency->symbol,
                'completed_buys' => round($completedBuyAmount, 4),
                'completed_sells' => round($completedSellAmount, 4),
                'pending_buys' => round($pendingBuyAmount, 4),
                'pending_sells' => round($pendingSellAmount, 4),
                'net_position' => round($netPosition, 4),
                'current_rate' => $activeRate?->rate,
                'net_position_base' => $activeRate ? round($netPosition * $activeRate->rate, 4) : null,
                'total_transactions' => $totalTransactions,
            ];
        }

        $totalNetPosition = array_sum(array_column($positions, 'net_position_base'));
        $totalTransactions = array_sum(array_column($positions, 'total_transactions'));

        $recentTransactions = FxTransaction::with(['fromCurrency', 'toCurrency'])
            ->latest('value_date')
            ->limit(10)
            ->get();

        $topMovers = FxExchangeRate::with(['fromCurrency', 'toCurrency'])
            ->active()
            ->effective()
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(function ($rate) {
                return [
                    'pair' => $rate->fromCurrency->code . '/' . $rate->toCurrency->code,
                    'rate' => $rate->rate,
                    'source' => $rate->source,
                    'updated_at' => $rate->updated_at,
                ];
            });

        return response()->json([
            'data' => [
                'positions' => $positions,
                'summary' => [
                    'total_net_position' => round($totalNetPosition, 4),
                    'total_transactions' => $totalTransactions,
                    'total_currencies' => $currencies->count(),
                ],
                'recent_transactions' => $recentTransactions,
                'top_movers' => $topMovers,
                'generated_at' => now()->toDateTimeString(),
            ],
        ]);
    }
}
