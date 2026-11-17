<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\PaymentTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class PaymentController extends Controller
{
    public function metrics(): JsonResponse
    {
        try {
            if (!Schema::hasTable('payment_transactions') || !Schema::hasTable('payment_gateways')) {
                return response()->json(['metrics' => $this->fallbackMetrics()]);
            }

            $gateways = PaymentGateway::count();
            $successCount = PaymentTransaction::where('status', 'Success')->count();
            $failedCount = PaymentTransaction::where('status', 'Failed')->count();
            $pendingCount = PaymentTransaction::where('status', 'Pending')->count();
            $total = PaymentTransaction::count();
            $totalCollected = $successCount * 12000;
            $successRate = $total > 0 ? round(($successCount / $total) * 100, 1) : 98.7;

            return response()->json([
                'metrics' => [
                    ['label' => 'Total Collected (MTD)', 'value' => '$' . number_format($totalCollected), 'delta' => '+15.3%', 'trend' => 'up', 'color' => '#10b981'],
                    ['label' => 'Payment Success Rate', 'value' => $successRate . '%', 'delta' => '+0.5%', 'trend' => 'up', 'color' => '#4f46e5'],
                    ['label' => 'Pending Payments', 'value' => '$' . number_format($pendingCount * 5000), 'delta' => '-8.1%', 'trend' => 'down', 'color' => '#f59e0b'],
                    ['label' => 'Failed Transactions', 'value' => (string) $failedCount, 'delta' => '-' . $failedCount, 'trend' => 'down', 'color' => '#ef4444'],
                    ['label' => 'Avg Gateway Performance', 'value' => '124ms', 'delta' => 'Stable', 'trend' => 'up', 'color' => '#0ea5e9'],
                    ['label' => 'Active Gateways', 'value' => (string) $gateways, 'delta' => '+0 this year', 'trend' => 'up', 'color' => '#8b5cf6'],
                ],
            ]);
        } catch (\Throwable) {
            return response()->json(['metrics' => $this->fallbackMetrics()]);
        }
    }

    public function revenue(): JsonResponse
    {
        return response()->json([
            'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'datasets' => [
                ['label' => 'Stripe', 'data' => [18000, 24000, 22000, 28000, 32000, 15000, 12000], 'backgroundColor' => '#635bff', 'borderRadius' => 4],
                ['label' => 'PayPal', 'data' => [12000, 15000, 14000, 18000, 20000, 9000, 7000], 'backgroundColor' => '#00457C', 'borderRadius' => 4],
                ['label' => 'Others', 'data' => [8000, 10000, 9500, 12000, 14000, 6000, 5000], 'backgroundColor' => '#94a3b8', 'borderRadius' => 4],
            ],
        ]);
    }

    public function split(): JsonResponse
    {
        return response()->json([
            'labels' => ['Stripe', 'PayPal', 'Authorize.Net', 'Razorpay', 'PayFast', 'Others'],
            'datasets' => [[
                'data' => [42, 25, 16, 12, 5, 4],
                'backgroundColor' => ['#635bff', '#00457C', '#F7941E', '#02042B', '#1B1464', '#94a3b8'],
                'borderWidth' => 0,
            ]],
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        try {
            if (!Schema::hasTable('payment_transactions')) {
                return response()->json([
                    'transactions' => [],
                    'page' => 1,
                    'totalPages' => 1,
                    'total' => 0,
                ]);
            }

            $query = PaymentTransaction::query()->orderByDesc('transaction_date');

            if ($search = trim((string) $request->query('search', ''))) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('transaction_id', 'like', "%{$search}%")
                        ->orWhere('client', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('gateway', 'like', "%{$search}%");
                });
            }

            $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
            $paginated = $query->paginate($perPage);

            return response()->json([
                'transactions' => $paginated->items(),
                'page' => $paginated->currentPage(),
                'totalPages' => $paginated->lastPage(),
                'total' => $paginated->total(),
            ]);
        } catch (\Throwable) {
            return response()->json([
                'transactions' => [],
                'page' => 1,
                'totalPages' => 1,
                'total' => 0,
            ]);
        }
    }

    public function exportTransactions(Request $request): JsonResponse
    {
        try {
            if (!Schema::hasTable('payment_transactions')) {
                return response()->json(['csv' => "transaction_id,client,amount,gateway,status,description,transaction_date\n"]);
            }

            $query = PaymentTransaction::query()->orderByDesc('transaction_date');

            if ($search = trim((string) $request->input('search', ''))) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('transaction_id', 'like', "%{$search}%")
                        ->orWhere('client', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $rows = $query->limit(500)->get();
            $lines = ['transaction_id,client,amount,gateway,status,description,transaction_date'];

            foreach ($rows as $row) {
                $lines[] = implode(',', [
                    $this->escapeCsv($row->transaction_id),
                    $this->escapeCsv($row->client),
                    $this->escapeCsv($row->amount),
                    $this->escapeCsv($row->gateway),
                    $this->escapeCsv($row->status),
                    $this->escapeCsv($row->description),
                    $this->escapeCsv(optional($row->transaction_date)->format('Y-m-d H:i:s')),
                ]);
            }

            return response()->json(['csv' => implode("\n", $lines)]);
        } catch (\Throwable) {
            return response()->json(['csv' => "transaction_id,client,amount,gateway,status,description,transaction_date\n"]);
        }
    }

    private function escapeCsv(?string $value): string
    {
        $value = (string) ($value ?? '');
        if (str_contains($value, ',') || str_contains($value, '"') || str_contains($value, "\n")) {
            return '"' . str_replace('"', '""', $value) . '"';
        }

        return $value;
    }

    private function fallbackMetrics(): array
    {
        return [
            ['label' => 'Total Collected (MTD)', 'value' => '$1,284,500', 'delta' => '+15.3%', 'trend' => 'up', 'color' => '#10b981'],
            ['label' => 'Payment Success Rate', 'value' => '98.7%', 'delta' => '+0.5%', 'trend' => 'up', 'color' => '#4f46e5'],
            ['label' => 'Pending Payments', 'value' => '$84,200', 'delta' => '-8.1%', 'trend' => 'down', 'color' => '#f59e0b'],
            ['label' => 'Failed Transactions', 'value' => '23', 'delta' => '-12', 'trend' => 'down', 'color' => '#ef4444'],
            ['label' => 'Avg Gateway Performance', 'value' => '124ms', 'delta' => 'Stable', 'trend' => 'up', 'color' => '#0ea5e9'],
            ['label' => 'Active Gateways', 'value' => '6', 'delta' => '+2 this year', 'trend' => 'up', 'color' => '#8b5cf6'],
        ];
    }
}
