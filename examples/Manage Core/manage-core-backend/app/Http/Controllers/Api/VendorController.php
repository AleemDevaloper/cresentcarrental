<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Models\VendorPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vendor::query();

 if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('vendor_code', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
 if ($request->filled('status')) {
            $status = $request->string('status');
            $query->where('status', $status);
        }

        $vendors = $query->orderBy('name')->paginate($request->integer('per_page', 15));

        return response()->json([
            'data' => $vendors->items(),
            'meta' => [
                'total' => $vendors->total(),
                'currentPage' => $vendors->currentPage(),
                'lastPage' => $vendors->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vendor_code' => 'required|string|unique:vendors,vendor_code',
            'name' => 'required|string',
            'legal_name' => 'nullable|string',
            'vendor_type' => 'nullable|string',
            'tax_no' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'website' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'credit_terms' => 'nullable|string',
            'credit_days' => 'nullable|integer',
            'credit_limit' => 'nullable|numeric',
            'currency' => 'nullable|string',
            'gl_expense_account' => 'nullable|string',
            'opening_balance' => 'nullable|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        $validated['opening_balance'] = (float) ($validated['opening_balance'] ?? 0);
        $validated['credit_limit'] = (float) ($validated['credit_limit'] ?? 0);
        $validated['credit_days'] = (int) ($validated['credit_days'] ?? 0);

        $vendor = Vendor::create($validated);

        return response()->json(['data' => $vendor], 201);
    }

    public function show(Vendor $vendor): JsonResponse
    {
        return response()->json(['data' => $vendor->load('payments')]);
    }

    public function update(Request $request, Vendor $vendor): JsonResponse
    {
        $validated = $request->validate([
            'vendor_code' => 'sometimes|string|unique:vendors,vendor_code,' . $vendor->id,
            'name' => 'sometimes|string',
            'legal_name' => 'nullable|string',
            'vendor_type' => 'nullable|string',
            'tax_no' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'website' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'credit_terms' => 'nullable|string',
            'credit_days' => 'nullable|integer',
            'credit_limit' => 'nullable|numeric',
            'currency' => 'nullable|string',
            'gl_expense_account' => 'nullable|string',
            'opening_balance' => 'nullable|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        $validated['opening_balance'] = (float) ($validated['opening_balance'] ?? 0);
        $validated['credit_limit'] = (float) ($validated['credit_limit'] ?? 0);
        $validated['credit_days'] = (int) ($validated['credit_days'] ?? 0);

        $vendor->update($validated);

        return response()->json(['data' => $vendor]);
    }

    public function destroy(Vendor $vendor): JsonResponse
    {
        $vendor->delete();

        return response()->json(['data' => ['id' => $vendor->id]], 200);
    }
}
