<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentGatewayController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'gateways' => PaymentGateway::all(),
            ]);
        } catch (\Throwable) {
            return response()->json(['gateways' => []]);
        }
    }

    public function show(PaymentGateway $gateway): JsonResponse
    {
        return response()->json(['gateway' => $gateway]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fee' => 'required|string|max:50',
            'status' => 'required|in:Active,Inactive',
            'color' => 'nullable|string|max:50',
        ]);

        $gateway = PaymentGateway::create($validated + [
            'volume' => '$0',
            'uptime' => 'N/A',
        ]);

        return response()->json(['gateway' => $gateway], 201);
    }

    public function update(Request $request, PaymentGateway $gateway): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fee' => 'required|string|max:50',
            'status' => 'required|in:Active,Inactive',
            'color' => 'nullable|string|max:50',
        ]);

        $gateway->update($validated);

        return response()->json(['gateway' => $gateway]);
    }

    public function destroy(PaymentGateway $gateway): JsonResponse
    {
        $gateway->delete();

        return response()->json(['message' => 'Gateway removed']);
    }
}
