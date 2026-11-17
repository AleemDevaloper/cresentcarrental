<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Models\VendorPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VendorPayment::with('vendor');

        if ($vendorId = $request->integer('vendor_id')) {
            $query->where('vendor_id', $vendorId);
        }
 if ($request->filled('status')) {
            $status = $request->string('status');
            $query->where('status', $status);
        }

        $payments = $query->orderByDesc('payment_date')->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $payments->items(),
            'meta' => [
                'total' => $payments->total(),
                'currentPage' => $payments->currentPage(),
                'lastPage' => $payments->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_id' => 'required|string|unique:vendor_payments,payment_id',
            'vendor_id' => 'required|exists:vendors,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'method' => 'nullable|string',
            'reference' => 'nullable|string',
            'status' => 'nullable|in:pending,processed,reversed',
            'notes' => 'nullable|string',
        ]);

        $payment = VendorPayment::create($validated);

        return response()->json(['data' => $payment->load('vendor')], 201);
    }

    public function show(VendorPayment $vendorPayment): JsonResponse
    {
        return response()->json(['data' => $vendorPayment->load('vendor')]);
    }

    public function update(Request $request, VendorPayment $vendorPayment): JsonResponse
    {
        $validated = $request->validate([
            'payment_id' => 'sometimes|string|unique:vendor_payments,payment_id,' . $vendorPayment->id,
            'vendor_id' => 'sometimes|exists:vendors,id',
            'amount' => 'sometimes|numeric',
            'payment_date' => 'sometimes|date',
            'method' => 'nullable|string',
            'reference' => 'nullable|string',
            'status' => 'nullable|in:pending,processed,reversed',
            'notes' => 'nullable|string',
        ]);

        $vendorPayment->update($validated);

        return response()->json(['data' => $vendorPayment->load('vendor')]);
    }

    public function destroy(VendorPayment $vendorPayment): JsonResponse
    {
        $vendorPayment->delete();

        return response()->json(['data' => ['id' => $vendorPayment->id]], 200);
    }
}
