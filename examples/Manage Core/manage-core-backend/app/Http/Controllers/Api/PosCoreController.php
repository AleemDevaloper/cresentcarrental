<?php

namespace App\Http\Controllers\Api;

use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PosCoreController
{
    private function db(): \Illuminate\Database\Connection
    {
        return DB::connection('tenant');
    }

    public function integrationSettings(): JsonResponse
    {
        $modes = ['disabled', 'manual', 'event_driven', 'scheduled', 'real_time'];
        $settings = collect(['inventory', 'crm', 'accounting'])->mapWithKeys(function (string $target) use ($modes) {
            $mode = AppSetting::getValue('pos.integration.' . $target . '.mode', 'disabled');
            return [$target => in_array($mode, $modes, true) ? $mode : 'disabled'];
        });

        return response()->json(['data' => $settings]);
    }

    public function updateIntegrationSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'inventory' => ['sometimes', 'in:disabled,manual,event_driven,scheduled,real_time'],
            'crm' => ['sometimes', 'in:disabled,manual,event_driven,scheduled,real_time'],
            'accounting' => ['sometimes', 'in:disabled,manual,event_driven,scheduled,real_time'],
        ]);

        foreach ($data as $target => $mode) {
            AppSetting::setValue('pos.integration.' . $target . '.mode', $mode);
        }

        return $this->integrationSettings();
    }

    public function registers(): JsonResponse
    {
        return response()->json(['data' => $this->db()->table('pos_registers')->where('status', 'active')->orderBy('name')->get()]);
    }

    public function storeRegister(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:pos_registers,code'],
            'name' => ['required', 'string', 'max:150'],
            'store' => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', 'string', 'size:3'],
            'default_opening_float' => ['nullable', 'numeric', 'min:0'],
        ]);
        $id = $this->db()->table('pos_registers')->insertGetId([...$data, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_registers')->find($id)], 201);
    }

    public function cashDrawers(): JsonResponse
    {
        return response()->json(['data' => $this->db()->table('pos_cash_drawers')->where('status', 'active')->orderBy('name')->get()]);
    }

    public function storeCashDrawer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:pos_cash_drawers,code'],
            'name' => ['required', 'string', 'max:150'],
            'terminal_id' => ['nullable', 'integer', 'exists:pos_terminals,id', 'unique:pos_cash_drawers,terminal_id'],
            'register_id' => ['nullable', 'integer', 'exists:pos_registers,id'],
            'currency' => ['nullable', 'string', 'size:3'],
            'safe_drop_threshold' => ['nullable', 'numeric', 'min:0'],
        ]);
        $id = $this->db()->table('pos_cash_drawers')->insertGetId([...$data, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_cash_drawers')->find($id)], 201);
    }

    public function cashReconciliation(Request $request): JsonResponse
    {
        $sessionId = $request->integer('session_id');
        $query = $this->db()->table('pos_cash_ledger')->when($sessionId, fn ($q) => $q->where('session_id', $sessionId));
        return response()->json(['data' => [
            'in' => (float) (clone $query)->where('direction', 'in')->sum('amount'),
            'out' => (float) (clone $query)->where('direction', 'out')->sum('amount'),
            'by_type' => (clone $query)->select('type', 'direction', DB::raw('count(*) as transactions'), DB::raw('sum(amount) as amount'))
                ->groupBy('type', 'direction')->get(),
            'exceptions' => $this->db()->table('pos_sessions')->when($sessionId, fn ($q) => $q->where('id', $sessionId))
                ->whereNotNull('variance')->where('variance', '<>', 0)->get(['id', 'session_number', 'variance', 'closed_at']),
        ]]);
    }

    public function cashAlerts(Request $request): JsonResponse
    {
        $alerts = $this->db()->table('pos_cash_alerts')->where('status', 'open')->latest()->limit(100)->get();
        return response()->json(['data' => $alerts]);
    }

    public function holdCart(Request $request): JsonResponse
    {
        $data = $request->validate([
            'session_id' => ['required', 'integer', 'exists:pos_sessions,id'],
            'customer_id' => ['nullable', 'integer'],
            'items' => ['required', 'array', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);
        $subtotal = collect($data['items'])->sum(fn ($item) => ($item['quantity'] ?? 0) * ($item['unit_price'] ?? 0));
        $id = $this->db()->table('pos_held_carts')->insertGetId([
            'cart_number' => 'CART-' . now()->format('YmdHis') . '-' . random_int(100, 999),
            'session_id' => $data['session_id'], 'user_id' => auth()->id(), 'customer_id' => $data['customer_id'] ?? null,
            'items' => json_encode($data['items']), 'subtotal' => $subtotal, 'notes' => $data['notes'] ?? null,
            'expires_at' => $data['expires_at'] ?? null, 'created_at' => now(), 'updated_at' => now(),
        ]);
        return response()->json(['data' => $this->db()->table('pos_held_carts')->find($id)], 201);
    }

    public function heldCarts(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->db()->table('pos_held_carts')->where('status', 'held')
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->when($request->integer('session_id'), fn ($q, $id) => $q->where('session_id', $id))
            ->latest()->paginate(min(max($request->integer('per_page', 25), 1), 100))]);
    }

    public function resumeCart(int $cart): JsonResponse
    {
        $updated = $this->db()->table('pos_held_carts')->where('id', $cart)->where('status', 'held')
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->update(['status' => 'resumed', 'resumed_at' => now(), 'updated_at' => now()]);
        abort_if(!$updated, 422, 'Held cart is unavailable or expired.');
        return response()->json(['data' => $this->db()->table('pos_held_carts')->find($cart)]);
    }

    public function transactionDetail(int $order): JsonResponse
    {
        $sale = $this->db()->table('pos_orders')->where('id', $order)->first();
        abort_if(!$sale, 404, 'Transaction not found.');
        return response()->json(['data' => [
            'order' => $sale,
            'lines' => $this->db()->table('pos_order_lines')->where('order_id', $order)->get(),
            'payments' => $this->db()->table('pos_payments')->where('order_id', $order)->get(),
            'receipt' => $this->db()->table('pos_receipts')->where('order_id', $order)->first(),
            'events' => $this->db()->table('pos_transaction_events')->where('order_id', $order)->latest()->get(),
        ]]);
    }

    public function changeTransactionStatus(Request $request, int $order, string $status): JsonResponse
    {
        abort_if(!in_array($status, ['cancelled', 'voided'], true), 404, 'Unsupported transaction status.');
        $data = $request->validate(['reason' => ['required', 'string', 'max:500']]);
        $updated = $this->db()->transaction(function () use ($order, $status, $data) {
            $sale = $this->db()->table('pos_orders')->where('id', $order)->lockForUpdate()->first();
            abort_if(!$sale || $sale->status !== 'completed', 422, 'Only completed transactions can be changed.');
            $this->db()->table('pos_orders')->where('id', $order)->update(['status' => $status, 'updated_at' => now()]);
            $this->db()->table('pos_transaction_events')->insert([
                'order_id' => $order, 'event_type' => strtoupper($status), 'user_id' => auth()->id(),
                'reason' => $data['reason'], 'created_at' => now(), 'updated_at' => now(),
            ]);
            return $this->db()->table('pos_orders')->find($order);
        });
        return response()->json(['data' => $updated]);
    }

    public function suspendSession(Request $request, int $session): JsonResponse
    {
        $data = $request->validate(['reason' => ['required', 'string', 'max:500']]);
        $updated = $this->db()->table('pos_sessions')->where('id', $session)->where('status', 'open')->update([
            'status' => 'suspended', 'suspended_at' => now(), 'suspended_by' => auth()->id(),
            'suspension_reason' => $data['reason'], 'updated_at' => now(),
        ]);
        abort_if(!$updated, 422, 'Only an open session can be suspended.');
        return response()->json(['data' => $this->db()->table('pos_sessions')->find($session)]);
    }

    public function resumeSession(int $session): JsonResponse
    {
        $updated = $this->db()->table('pos_sessions')->where('id', $session)->where('status', 'suspended')
            ->update(['status' => 'open', 'updated_at' => now()]);
        abort_if(!$updated, 422, 'Only a suspended session can be resumed.');
        return response()->json(['data' => $this->db()->table('pos_sessions')->find($session)]);
    }

    public function transferCash(Request $request): JsonResponse
    {
        $data = $request->validate([
            'from_session_id' => ['required', 'integer', 'exists:pos_sessions,id'],
            'to_session_id' => ['required', 'integer', 'exists:pos_sessions,id', 'different:from_session_id'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'reason' => ['required', 'string', 'max:500'],
        ]);
        $transfer = $this->db()->transaction(function () use ($data) {
            $from = $this->db()->table('pos_sessions')->where('id', $data['from_session_id'])->lockForUpdate()->first();
            $to = $this->db()->table('pos_sessions')->where('id', $data['to_session_id'])->lockForUpdate()->first();
            abort_if(!$from || !$to || !in_array($from->status, ['open', 'suspended'], true) || $to->status !== 'open', 422, 'Both sessions must be operational.');
            $expected = $this->sessionExpectedCash($from->id);
            abort_if($data['amount'] > $expected, 422, 'Transfer exceeds the source session cash.');
            $id = $this->db()->table('pos_cash_transfers')->insertGetId([
                'transfer_number' => 'TRF-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'from_session_id' => $from->id, 'to_session_id' => $to->id, 'amount' => $data['amount'],
                'status' => 'completed', 'requested_by' => auth()->id(), 'accepted_by' => auth()->id(),
                'accepted_at' => now(), 'reason' => $data['reason'], 'created_at' => now(), 'updated_at' => now(),
            ]);
            $this->recordCashLedger($from->id, 'cash_transfer', 'out', $data['amount'], 'cash_transfer', (string) $id, $data['reason']);
            $this->recordCashLedger($to->id, 'cash_transfer', 'in', $data['amount'], 'cash_transfer', (string) $id, $data['reason']);
            return $this->db()->table('pos_cash_transfers')->find($id);
        });
        return response()->json(['data' => $transfer], 201);
    }

    public function createReconciliation(Request $request, int $session): JsonResponse
    {
        $data = $request->validate([
            'actual_cash' => ['required', 'numeric', 'min:0'],
            'variance_reason' => ['nullable', 'string', 'max:500'],
        ]);
        $result = $this->db()->transaction(function () use ($data, $session) {
            $row = $this->db()->table('pos_sessions')->where('id', $session)->lockForUpdate()->first();
            abort_if(!$row || !in_array($row->status, ['open', 'suspended', 'closed'], true), 422, 'Session cannot be reconciled.');
            $expected = $this->sessionExpectedCash($session);
            $variance = round((float) $data['actual_cash'] - $expected, 2);
            $id = $this->db()->table('pos_reconciliations')->insertGetId([
                'reconciliation_number' => 'REC-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'session_id' => $session, 'expected_cash' => $expected, 'actual_cash' => $data['actual_cash'],
                'variance' => $variance, 'status' => abs($variance) > 0 ? 'pending_approval' : 'approved',
                'created_by' => auth()->id(), 'approved_by' => abs($variance) > 0 ? null : auth()->id(),
                'approved_at' => abs($variance) > 0 ? null : now(), 'variance_reason' => $data['variance_reason'] ?? null,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $this->db()->table('pos_sessions')->where('id', $session)->update([
                'actual_cash' => $data['actual_cash'], 'expected_cash' => $expected, 'variance' => $variance,
                'variance_reason' => $data['variance_reason'] ?? null, 'updated_at' => now(),
            ]);
            return $this->db()->table('pos_reconciliations')->find($id);
        });
        return response()->json(['data' => $result], 201);
    }

    public function approveReconciliation(int $reconciliation): JsonResponse
    {
        $updated = $this->db()->table('pos_reconciliations')->where('id', $reconciliation)->where('status', 'pending_approval')
            ->update(['status' => 'approved', 'approved_by' => auth()->id(), 'approved_at' => now(), 'updated_at' => now()]);
        abort_if(!$updated, 422, 'Reconciliation is not awaiting approval.');
        return response()->json(['data' => $this->db()->table('pos_reconciliations')->find($reconciliation)]);
    }

    private function sessionExpectedCash(int $sessionId): float
    {
        $in = (float) $this->db()->table('pos_cash_ledger')->where('session_id', $sessionId)->where('direction', 'in')->sum('amount');
        $out = (float) $this->db()->table('pos_cash_ledger')->where('session_id', $sessionId)->where('direction', 'out')->sum('amount');
        return round($in - $out, 2);
    }

    public function catalog(Request $request): JsonResponse
    {
        $term = $request->input('search');
        $items = $this->db()->table('pos_product_catalog')
            ->when($term, fn ($q) => $q->where(function ($query) use ($term) {
                $query->where('name', 'like', '%' . $term . '%')
                    ->orWhere('sku', 'like', '%' . $term . '%')
                    ->orWhere('product_code', 'like', '%' . $term . '%')
                    ->orWhere('barcode', 'like', '%' . $term . '%');
            }))
            ->when($request->input('category'), fn ($q, $category) => $q->where('category', $category))
            ->when($request->input('product_type'), fn ($q, $type) => $q->where('product_type', $type))
            ->where('status', 'active')->where('available_for_sale', true)
            ->orderBy('name')->paginate(min(max($request->integer('per_page', 25), 1), 100));
        return response()->json(['data' => $items->items(), 'meta' => [
            'total' => $items->total(), 'currentPage' => $items->currentPage(), 'lastPage' => $items->lastPage(),
        ]]);
    }

    public function barcodeSearch(Request $request): JsonResponse
    {
        $barcode = trim((string) $request->input('barcode'));
        abort_if($barcode === '', 422, 'A barcode is required.');
        $item = $this->db()->table('pos_product_catalog')->where('barcode', $barcode)->where('status', 'active')->first();
        if (!$item) {
            $item = $this->db()->table('pos_product_barcodes as barcode')
                ->join('pos_product_catalog as product', 'product.id', '=', 'barcode.catalog_product_id')
                ->where('barcode.barcode', $barcode)->where('barcode.active', true)->where('product.status', 'active')
                ->select('product.*')->first();
        }
        abort_if(!$item, 404, 'Product barcode was not found.');
        return response()->json(['data' => $item]);
    }

    public function priceLists(): JsonResponse
    {
        return response()->json(['data' => $this->db()->table('pos_price_lists')->where('status', 'active')->orderBy('name')->get()]);
    }

    public function storePrice(Request $request): JsonResponse
    {
        $data = $request->validate([
            'price_list_id' => ['required', 'integer', 'exists:pos_price_lists,id'],
            'catalog_product_id' => ['required', 'integer', 'exists:pos_product_catalog,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);
        $id = $this->db()->table('pos_product_prices')->insertGetId([...$data, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_product_prices')->find($id)], 201);
    }

    public function discountRules(Request $request): JsonResponse
    {
        $rules = $this->db()->table('pos_discount_rules')->where('status', 'active')
            ->when($request->integer('catalog_product_id'), fn ($q, $id) => $q->where(function ($query) use ($id) {
                $query->whereNull('catalog_product_id')->orWhere('catalog_product_id', $id);
            }))->orderBy('priority')->get();
        return response()->json(['data' => $rules]);
    }

    public function terminals(): JsonResponse
    {
        return response()->json(['data' => $this->db()->table('pos_terminals')->where('status', 'active')->orderBy('name')->get()]);
    }

    public function storeTerminal(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:pos_terminals,code'],
            'name' => ['required', 'string', 'max:150'],
            'branch' => ['nullable', 'string', 'max:100'],
            'store' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'device_id' => ['nullable', 'string', 'max:150', 'unique:pos_terminals,device_id'],
            'configuration' => ['nullable', 'array'],
            'hardware_configuration' => ['nullable', 'array'],
            'register_id' => ['nullable', 'integer', 'exists:pos_registers,id'],
        ]);
        $id = $this->db()->table('pos_terminals')->insertGetId([...$data, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_terminals')->find($id)], 201);
    }

    public function updateTerminal(Request $request, int $terminal): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'status' => ['sometimes', 'in:active,inactive,maintenance,blocked'],
            'branch' => ['nullable', 'string', 'max:100'],
            'store' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'configuration' => ['nullable', 'array'],
            'hardware_configuration' => ['nullable', 'array'],
        ]);
        $this->db()->table('pos_terminals')->where('id', $terminal)->update([...$data, 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_terminals')->find($terminal)]);
    }

    public function heartbeat(Request $request, int $terminal): JsonResponse
    {
        $data = $request->validate([
            'device_id' => ['nullable', 'string', 'max:150'],
            'app_version' => ['nullable', 'string', 'max:50'],
            'operating_system' => ['nullable', 'string', 'max:100'],
        ]);
        $this->db()->table('pos_terminals')->where('id', $terminal)->update([
            ...$data, 'last_seen_at' => now(), 'connection_status' => 'online', 'updated_at' => now(),
        ]);
        return response()->json(['data' => $this->db()->table('pos_terminals')->find($terminal)]);
    }

    public function openSession(Request $request): JsonResponse
    {
        $data = $request->validate([
            'terminal_id' => ['required', 'integer', 'exists:pos_terminals,id'],
            'opening_cash' => ['required', 'numeric', 'min:0'],
            'opening_denominations' => ['nullable', 'array'],
        ]);
        $session = $this->db()->transaction(function () use ($data) {
            $this->db()->table('pos_terminals')->where('id', $data['terminal_id'])->lockForUpdate()->first();
            $existing = $this->db()->table('pos_sessions')->where('terminal_id', $data['terminal_id'])
                ->whereIn('status', ['pending_open', 'open', 'suspended', 'closing', 'reconciliation_required'])->exists();
            abort_if($existing, 422, 'This terminal already has an active session.');
            $id = $this->db()->table('pos_sessions')->insertGetId([
                'terminal_id' => $data['terminal_id'], 'opening_cash' => $data['opening_cash'],
                'opening_denominations' => isset($data['opening_denominations']) ? json_encode($data['opening_denominations']) : null,
                'user_id' => auth()->id(), 'session_number' => 'SES-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'opened_at' => now(), 'created_at' => now(), 'updated_at' => now(),
            ]);
            $this->recordCashLedger($id, 'opening_float', 'in', $data['opening_cash'], 'pos_session', (string) $id, 'Opening cash');
            return $this->db()->table('pos_sessions')->find($id);
        });
        return response()->json(['data' => $session], 201);
    }

    public function sessions(Request $request): JsonResponse
    {
        $items = $this->db()->table('pos_sessions')->latest('id')->paginate(min(max($request->integer('per_page', 25), 1), 100));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total()]]);
    }

    public function sessionDetail(int $session): JsonResponse
    {
        $row = $this->db()->table('pos_sessions')->where('id', $session)->first();
        abort_if(!$row, 404, 'Session not found.');
        return response()->json(['data' => [
            'session' => $row,
            'sales' => $this->db()->table('pos_orders')->where('session_id', $session)->where('status', 'completed')->get(),
            'payments' => $this->db()->table('pos_payments')->join('pos_orders', 'pos_orders.id', '=', 'pos_payments.order_id')
                ->where('pos_orders.session_id', $session)->select('pos_payments.method', DB::raw('count(*) as transactions'), DB::raw('sum(pos_payments.amount) as amount'))->groupBy('pos_payments.method')->get(),
            'cash_movements' => $this->db()->table('pos_cash_movements')->where('session_id', $session)->latest()->get(),
            'cash_counts' => $this->db()->table('pos_cash_counts')->where('session_id', $session)->latest()->get(),
        ]]);
    }

    public function cashCount(Request $request, int $session): JsonResponse
    {
        $data = $request->validate(['denominations' => ['required', 'array'], 'total' => ['required', 'numeric', 'min:0']]);
        abort_if($this->db()->table('pos_sessions')->where('id', $session)->exists() === false, 404, 'Session not found.');
        $id = $this->db()->table('pos_cash_counts')->insertGetId([...$data, 'session_id' => $session, 'user_id' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_cash_counts')->find($id)], 201);
    }

    public function reopenSession(Request $request, int $session): JsonResponse
    {
        $data = $request->validate(['reason' => ['required', 'string', 'max:500']]);
        $this->db()->table('pos_sessions')->where('id', $session)->where('status', 'closed')->update([
            'status' => 'open', 'is_locked' => false, 'reopened_at' => now(), 'reopened_by' => auth()->id(),
            'reopen_reason' => $data['reason'], 'updated_at' => now(),
        ]);
        return response()->json(['data' => $this->db()->table('pos_sessions')->find($session)]);
    }

    public function lockSession(int $session): JsonResponse
    {
        $row = $this->db()->table('pos_sessions')->where('id', $session)->first();
        abort_if(!$row || $row->status !== 'open', 422, 'Session is not open.');
        $this->db()->table('pos_sessions')->where('id', $session)->update(['is_locked' => true, 'updated_at' => now()]);
        $this->db()->table('pos_terminal_locks')->insert(['terminal_id' => $row->terminal_id, 'session_id' => $session, 'user_id' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_sessions')->find($session)]);
    }

    public function unlockSession(int $session): JsonResponse
    {
        $this->db()->table('pos_sessions')->where('id', $session)->update(['is_locked' => false, 'updated_at' => now()]);
        $this->db()->table('pos_terminal_locks')->where('session_id', $session)->whereNull('unlocked_at')->update(['unlocked_at' => now(), 'updated_at' => now()]);
        return response()->json(['data' => $this->db()->table('pos_sessions')->find($session)]);
    }

    public function orders(Request $request): JsonResponse
    {
        $items = $this->db()->table('pos_orders')
            ->select('pos_orders.*')
            ->selectSub(
                $this->db()->table('pos_order_lines')
                    ->selectRaw('COALESCE(SUM(quantity), 0)')
                    ->whereColumn('pos_order_lines.order_id', 'pos_orders.id'),
                'item_count'
            )
            ->selectSub(
                $this->db()->table('pos_payments')
                    ->select('method')
                    ->whereColumn('pos_payments.order_id', 'pos_orders.id')
                    ->latest('id')
                    ->limit(1),
                'payment_method'
            )
            ->latest('id')
            ->paginate(min(max($request->integer('per_page', 25), 1), 100));
        return response()->json(['data' => $items->items(), 'meta' => ['total' => $items->total()]]);
    }

    public function findReturnSale(Request $request): JsonResponse
    {
        $term = trim((string) $request->input('search'));
        abort_if($term === '', 422, 'A sale search value is required.');
        $orders = $this->db()->table('pos_orders')
            ->leftJoin('pos_receipts', 'pos_receipts.order_id', '=', 'pos_orders.id')
            ->where(function ($query) use ($term) {
                $query->where('pos_orders.transaction_id', 'like', '%' . $term . '%')
                    ->orWhere('pos_receipts.receipt_number', 'like', '%' . $term . '%');
            })
            ->select('pos_orders.*', 'pos_receipts.receipt_number')
            ->latest('pos_orders.id')->limit(25)->get();
        return response()->json(['data' => $orders]);
    }

    public function returnableSale(int $order): JsonResponse
    {
        $sale = $this->db()->table('pos_orders')->where('id', $order)->first();
        abort_if(!$sale, 404, 'Sale not found.');
        $lines = $this->db()->table('pos_order_lines as line')
            ->leftJoin('pos_return_lines as returned', 'returned.order_line_id', '=', 'line.id')
            ->where('line.order_id', $order)
            ->groupBy('line.id')
            ->select('line.*', DB::raw('COALESCE(SUM(returned.quantity), 0) as returned_quantity'))
            ->get()->map(function ($line) {
                $line->remaining_quantity = max(0, (float) $line->quantity - (float) $line->returned_quantity);
                return $line;
            });
        return response()->json(['data' => ['sale' => $sale, 'lines' => $lines]]);
    }

    public function createReturn(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:pos_orders,id'],
            'return_type' => ['required', 'in:full,partial,exchange,no_receipt'],
            'idempotency_key' => ['required', 'string', 'max:150'],
            'reason' => ['required', 'string', 'max:150'],
            'resolution' => ['required', 'in:refund,store_credit,exchange'],
            'customer_id' => ['nullable', 'integer'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.order_line_id' => ['required', 'integer', 'exists:pos_order_lines,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.condition' => ['nullable', 'string', 'max:50'],
            'items.*.notes' => ['nullable', 'string'],
        ]);
        $existing = $this->db()->table('pos_returns')->where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) return response()->json(['data' => $existing, 'idempotent' => true]);
        if ($data['resolution'] === 'store_credit') {
            abort_if(empty($data['customer_id']), 422, 'A customer is required for store credit.');
        }
        $return = $this->db()->transaction(function () use ($data) {
            $id = $this->db()->table('pos_returns')->insertGetId([
                'return_number' => 'RET-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'order_id' => $data['order_id'], 'customer_id' => $data['customer_id'] ?? null,
                'return_type' => $data['return_type'], 'resolution' => $data['resolution'],
                'reason' => $data['reason'], 'status' => 'completed', 'approval_status' => 'not_required',
                'idempotency_key' => $data['idempotency_key'], 'completed_at' => now(),
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $total = 0;
            foreach ($data['items'] as $item) {
                $line = $this->db()->table('pos_order_lines')->where('id', $item['order_line_id'])->where('order_id', $data['order_id'])->first();
                abort_if(!$line, 422, 'Return line does not belong to the original sale.');
                $returned = $this->db()->table('pos_return_lines')->where('order_line_id', $line->id)->sum('quantity');
                $remaining = (float) $line->quantity - (float) $returned;
                abort_if((float) $item['quantity'] > $remaining, 422, 'Return quantity exceeds the remaining returnable quantity.');
                $amount = (float) $item['quantity'] * (float) $line->unit_price;
                $total += $amount;
                $this->db()->table('pos_return_lines')->insert([
                    'return_id' => $id, 'order_line_id' => $line->id, 'quantity' => $item['quantity'],
                    'unit_price' => $line->unit_price, 'discount_amount' => $line->discount_amount,
                    'tax_amount' => $line->tax_amount, 'refund_amount' => $amount, 'reason' => $data['reason'],
                    'condition' => $item['condition'] ?? null, 'notes' => $item['notes'] ?? null,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
            $this->db()->table('pos_returns')->where('id', $id)->update(['total' => $total, 'receipt_number' => 'RRET-' . now()->format('YmdHis') . '-' . random_int(100, 999)]);
            if ($this->integrationMode('inventory') !== 'disabled') {
                $this->db()->table('pos_integration_events')->insert([
                    'event_id' => 'POSReturn-' . $data['idempotency_key'], 'event_type' => 'POS_RETURN_COMPLETED',
                    'transaction_id' => $data['idempotency_key'], 'target' => 'inventory',
                    'payload' => json_encode(['return_id' => $id]), 'created_at' => now(), 'updated_at' => now(),
                ]);
            }
            return $this->db()->table('pos_returns')->find($id);
        });
        return response()->json(['data' => $return], 201);
    }

    public function refund(Request $request, int $return): JsonResponse
    {
        $data = $request->validate([
            'method' => ['required', 'in:cash,card,bank,wallet,store_credit,customer_credit,other'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'idempotency_key' => ['required', 'string', 'max:150'],
            'provider_reference' => ['nullable', 'string', 'max:150'],
        ]);
        $existing = $this->db()->table('pos_refunds')->where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) return response()->json(['data' => $existing, 'idempotent' => true]);
        $refund = $this->db()->transaction(function () use ($data, $return) {
            $ret = $this->db()->table('pos_returns')->where('id', $return)->first();
            abort_if(!$ret || $ret->status !== 'completed', 422, 'Return is not available for refund.');
            $already = $this->db()->table('pos_refunds')->where('return_id', $return)->whereIn('status', ['completed', 'processing'])->sum('amount');
            abort_if((float) $data['amount'] > (float) $ret->total - (float) $already, 422, 'Refund exceeds the remaining return amount.');
            $order = $this->db()->table('pos_orders')->where('id', $ret->order_id)->first();
            $id = $this->db()->table('pos_refunds')->insertGetId([
                'refund_number' => 'REF-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'return_id' => $return, 'order_id' => $ret->order_id, 'session_id' => $order->session_id,
                'method' => $data['method'], 'amount' => $data['amount'], 'status' => 'completed',
                'idempotency_key' => $data['idempotency_key'], 'provider_reference' => $data['provider_reference'] ?? null,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            if ($data['method'] === 'cash') {
                $this->db()->table('pos_cash_movements')->insert([
                    'session_id' => $order->session_id, 'user_id' => auth()->id(), 'type' => 'cash_out',
                    'amount' => $data['amount'], 'reason' => 'POS refund ' . $return, 'created_at' => now(), 'updated_at' => now(),
                ]);
                $this->recordCashLedger($order->session_id, 'cash_refund', 'out', $data['amount'], 'pos_refund', (string) $id, 'Refund ' . $return);
            }
            if ($data['method'] === 'store_credit') {
                $this->db()->table('pos_store_credits')->insert([
                    'credit_number' => 'CR-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                    'customer_id' => $ret->customer_id, 'return_id' => $return, 'amount' => $data['amount'],
                    'remaining_amount' => $data['amount'], 'created_at' => now(), 'updated_at' => now(),
                ]);
            }
            return $this->db()->table('pos_refunds')->find($id);
        });
        return response()->json(['data' => $refund], 201);
    }

    public function cashMovement(Request $request, int $session): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:cash_in,cash_out,cash_drop,petty_cash,expense,adjustment'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'reason' => ['required', 'string', 'max:500'],
            'idempotency_key' => ['required', 'string', 'max:150'],
        ]);
        $existing = $this->db()->table('pos_cash_ledger')->where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) return response()->json(['data' => $existing, 'idempotent' => true]);
        abort_if($this->db()->table('pos_sessions')->where('id', $session)->where('status', 'open')->doesntExist(), 422, 'Session is not open.');
        $id = $this->db()->table('pos_cash_movements')->insertGetId([
            'type' => $data['type'], 'amount' => $data['amount'], 'reason' => $data['reason'],
            'session_id' => $session, 'user_id' => auth()->id(), 'created_at' => now(), 'updated_at' => now(),
        ]);
        $direction = in_array($data['type'], ['cash_in'], true) ? 'in' : 'out';
        $ledger = $this->recordCashLedger($session, $data['type'], $direction, $data['amount'], 'cash_movement', (string) $id, $data['reason'], $data['idempotency_key']);
        return response()->json(['data' => $ledger], 201);
    }

    public function closeSession(Request $request, int $session): JsonResponse
    {
        $data = $request->validate([
            'actual_cash' => ['required', 'numeric', 'min:0'],
            'denominations' => ['nullable', 'array'],
            'close_reason' => ['nullable', 'string', 'max:500'],
        ]);
        $result = $this->db()->transaction(function () use ($session, $data) {
            $row = $this->db()->table('pos_sessions')->where('id', $session)->lockForUpdate()->first();
            abort_if(!$row || !in_array($row->status, ['open', 'suspended'], true), 422, 'Session is not operational.');
            $expected = $this->sessionExpectedCash($session);
            $this->db()->table('pos_sessions')->where('id', $session)->update([
                'status' => 'closed', 'expected_cash' => $expected, 'actual_cash' => $data['actual_cash'],
                'variance' => $data['actual_cash'] - $expected, 'closing_denominations' => isset($data['denominations']) ? json_encode($data['denominations']) : null,
                'close_reason' => $data['close_reason'] ?? null, 'closed_at' => now(), 'updated_at' => now(),
            ]);
            return $this->db()->table('pos_sessions')->find($session);
        });
        return response()->json(['data' => $result]);
    }

    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'terminal_id' => ['required', 'integer', 'exists:pos_terminals,id'],
            'session_id' => ['required', 'integer', 'exists:pos_sessions,id'],
            'customer_id' => ['nullable', 'integer'],
            'source' => ['nullable', 'in:online,offline'],
            'idempotency_key' => ['required', 'string', 'max:150'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.catalog_product_id' => ['nullable', 'integer', 'exists:pos_product_catalog,id'],
            'items.*.sku' => ['nullable', 'string', 'max:100'],
            'items.*.barcode' => ['nullable', 'string', 'max:100'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payments' => ['required', 'array', 'min:1'],
            'payments.*.method' => ['required', 'string', 'max:50'],
            'payments.*.amount' => ['required', 'numeric', 'gt:0'],
            'payments.*.reference' => ['nullable', 'string', 'max:150'],
        ]);
        $existing = $this->db()->table('pos_orders')->where('idempotency_key', $data['idempotency_key'])->first();
        if ($existing) return response()->json(['data' => $existing, 'idempotent' => true]);
        $session = $this->db()->table('pos_sessions')->where('id', $data['session_id'])
            ->where('terminal_id', $data['terminal_id'])->where('status', 'open')->exists();
        abort_if(!$session, 422, 'An open session for this terminal is required.');

        $order = $this->db()->transaction(function () use ($data) {
            $lines = [];
            $subtotal = 0;
            $discountTotal = 0;
            $taxTotal = 0;
            foreach ($data['items'] as $item) {
                $product = $this->db()->table('pos_product_catalog')
                    ->where('status', 'active')->where('available_for_sale', true)
                    ->when($item['catalog_product_id'] ?? null, fn ($q, $id) => $q->where('id', $id))
                    ->when(!($item['catalog_product_id'] ?? null) && ($item['sku'] ?? null), fn ($q) => $q->where('sku', $item['sku']))
                    ->when(!($item['catalog_product_id'] ?? null) && !($item['sku'] ?? null) && ($item['barcode'] ?? null), fn ($q) => $q->where('barcode', $item['barcode']))
                    ->lockForUpdate()->first();
                abort_if(!$product, 422, 'One or more products are unavailable for POS sale.');

                $gross = round((float) $item['quantity'] * (float) $product->price, 2);
                $discount = round((float) ($item['discount_amount'] ?? 0), 2);
                abort_if($discount > $gross, 422, 'Line discount cannot exceed the line value.');
                $net = round($gross - $discount, 2);
                $tax = round($net * ((float) $product->tax_rate / 100), 2);
                $lineTotal = round($net + $tax, 2);
                $subtotal += $gross;
                $discountTotal += $discount;
                $taxTotal += $tax;
                $lines[] = [
                    'product' => $product, 'quantity' => $item['quantity'], 'discount' => $discount,
                    'net' => $net, 'tax' => $tax, 'line_total' => $lineTotal,
                ];
            }
            $subtotal = round($subtotal, 2);
            $discountTotal = round($discountTotal, 2);
            $taxTotal = round($taxTotal, 2);
            $total = round($subtotal - $discountTotal + $taxTotal, 2);
            $paid = collect($data['payments'])->sum('amount');
            if (round($paid, 2) < $total) abort(422, 'Payment total is less than the order total.');
            $transactionId = 'POS-' . now()->format('YmdHis') . '-' . random_int(100000, 999999);
            $orderId = $this->db()->table('pos_orders')->insertGetId([
                'transaction_id' => $transactionId, 'terminal_id' => $data['terminal_id'],
                'session_id' => $data['session_id'], 'customer_id' => $data['customer_id'] ?? null,
                'status' => 'completed', 'sync_status' => ($data['source'] ?? 'online') === 'offline' ? 'pending' : 'not_required',
                'subtotal' => $subtotal, 'discount_total' => $discountTotal, 'tax_total' => $taxTotal,
                'total' => $total, 'change_amount' => round($paid - $total, 2),
                'source' => $data['source'] ?? 'online', 'idempotency_key' => $data['idempotency_key'],
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($lines as $line) $this->db()->table('pos_order_lines')->insert([
                'order_id' => $orderId, 'catalog_product_id' => $line['product']->id,
                'sku' => $line['product']->sku, 'barcode' => $line['product']->barcode, 'name' => $line['product']->name,
                'quantity' => $line['quantity'], 'unit_price' => $line['product']->price,
                'discount_amount' => $line['discount'], 'tax_amount' => $line['tax'], 'line_total' => $line['line_total'],
                'metadata' => json_encode(['tax_rate' => (float) $line['product']->tax_rate]),
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($data['payments'] as $payment) $this->db()->table('pos_payments')->insert([
                'order_id' => $orderId, 'method' => $payment['method'], 'amount' => $payment['amount'],
                'reference' => $payment['reference'] ?? null, 'status' => 'completed',
                'metadata' => json_encode(['idempotency_key' => $data['idempotency_key']]),
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($data['payments'] as $payment) {
                if (strtolower($payment['method']) === 'cash') {
                    $this->recordCashLedger($data['session_id'], 'cash_sale', 'in', $payment['amount'], 'pos_order', (string) $orderId);
                }
            }
            $this->db()->table('pos_receipts')->insert([
                'order_id' => $orderId, 'receipt_number' => 'RCP-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach (['inventory', 'crm', 'accounting'] as $target) {
                if ($this->integrationMode($target) !== 'disabled') {
                    $this->db()->table('pos_integration_events')->insert([
                        'event_id' => 'POSSale-' . $transactionId . '-' . $target, 'event_type' => 'POS_SALE_COMPLETED',
                        'transaction_id' => $transactionId, 'target' => $target,
                        'payload' => json_encode(['order_id' => $orderId]), 'created_at' => now(), 'updated_at' => now(),
                    ]);
                }
            }
            $this->db()->table('pos_transaction_events')->insert([
                'order_id' => $orderId, 'event_type' => 'POS_SALE_COMPLETED', 'user_id' => auth()->id(),
                'metadata' => json_encode(['payment_total' => $paid]), 'created_at' => now(), 'updated_at' => now(),
            ]);
            return $this->db()->table('pos_orders')->find($orderId);
        });
        return response()->json(['data' => $order], 201);
    }

    private function recordCashLedger(int $sessionId, string $type, string $direction, $amount, ?string $referenceType = null, ?string $referenceId = null, ?string $reason = null, ?string $idempotencyKey = null): object
    {
        $session = $this->db()->table('pos_sessions')->where('id', $sessionId)->first();
        abort_if(!$session, 404, 'Session not found.');
        $terminal = $this->db()->table('pos_terminals')->where('id', $session->terminal_id)->first();
        $movementId = 'CASH-' . now()->format('YmdHis') . '-' . random_int(100000, 999999);
        $this->db()->table('pos_cash_ledger')->insert([
            'movement_id' => $movementId,
            'session_id' => $sessionId, 'terminal_id' => $session->terminal_id, 'register_id' => $terminal?->register_id,
            'type' => $type, 'direction' => $direction, 'amount' => $amount,
            'reference_type' => $referenceType, 'reference_id' => $referenceId, 'user_id' => auth()->id(),
            'reason' => $reason, 'idempotency_key' => $idempotencyKey, 'created_at' => now(), 'updated_at' => now(),
        ]);
        return $this->db()->table('pos_cash_ledger')->where('movement_id', $movementId)->first();
    }

    private function integrationMode(string $target): string
    {
        return AppSetting::getValue('pos.integration.' . $target . '.mode', 'disabled') ?? 'disabled';
    }
}
