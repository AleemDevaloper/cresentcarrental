<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $perPage = max(10, (int) $request->get('per_page', 25));
        $query = Receipt::query()->with('client:id,name')->orderBy('date', 'desc');

        if ($q = $request->get('q')) {
            $query->where(function($qry) use ($q) {
                $qry->where('number', 'like', "%{$q}%")
                    ->orWhere('reference_no', 'like', "%{$q}%")
                    ->orWhere('invoice_ref', 'like', "%{$q}%")
                    ->orWhere('received_by', 'like', "%{$q}%");
            });
        }

        if ($customerId = $request->get('customer_id')) {
            $query->where('client_id', $customerId);
        }

        $data = $query->paginate($perPage);
        $data->getCollection()->transform(function ($r) {
            $r->customer_name = $r->client?->name ?? null;
            unset($r->client);
            return $r;
        });
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'customer_id' => 'required|integer',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'reference_no' => 'required|string',
        ]);

        $user = Auth::user();

        $payload = $request->only(['customer_id', 'date', 'method', 'bank', 'amount', 'reference_no', 'allocated_to', 'invoice_ref', 'received_by', 'notes', 'status']);
        $payload['client_id'] = $payload['customer_id'];
        $payload['created_by'] = $user ? $user->id : null;
        $payload['allocated'] = 0;
        // optional: generate receipt number
        $payload['number'] = $payload['number'] ?? ('RCT-' . date('Y') . '-' . str_pad(rand(1,99999), 5, '0', STR_PAD_LEFT));

        $receipt = Receipt::create($payload);

        return response()->json(['message' => 'Receipt created', 'data' => $receipt], 201);
    }

    public function show($id)
    {
        $r = Receipt::findOrFail($id);
        return response()->json($r);
    }

    public function update(Request $request, $id)
    {
        $r = Receipt::findOrFail($id);
        $r->fill($request->only(['date','method','bank','amount','allocated','reference_no','invoice_ref','received_by','notes','status']));
        $r->save();
        return response()->json(['message' => 'Receipt updated', 'data' => $r]);
    }

    public function destroy($id)
    {
        $r = Receipt::findOrFail($id);
        $r->delete();
        return response()->json(['message' => 'Receipt deleted']);
    }
}
