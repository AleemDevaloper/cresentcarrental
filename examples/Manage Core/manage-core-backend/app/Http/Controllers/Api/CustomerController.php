<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientContact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    /**
     * Get all AR customers (only from clients table, not superadmin_customers)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Client::query();

        // Search by name, email, company
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('company_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->get('status') !== 'All') {
            $query->where('status', $request->get('status'));
        }

        // Filter by type
        if ($request->has('type') && $request->get('type') !== 'All') {
            $query->where('type', $request->get('type'));
        }

        // Sort
        $sortBy = $request->get('sortBy', 'created_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('perPage', 10);
        $customers = $query->paginate($perPage);

        $customers->getCollection()->transform(function ($c) {
            $c->code = 'CUST-' . str_pad($c->id, 3, '0', STR_PAD_LEFT);
            $c->contact = $c->name;
            $c->balance = $c->total_revenue ?? 0;
            $c->limit = 0;
            return $c;
        });

        return response()->json([
            'data' => $customers->items(),
            'pagination' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'from' => $customers->firstItem(),
                'to' => $customers->lastItem(),
            ],
        ]);
    }

    /**
     * Create a new AR customer
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Active,Inactive,Archived',
            'type' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'health_score' => 'nullable|integer|min:0|max:100',
            'account_manager_id' => 'nullable|exists:users,id',
            'since' => 'nullable|date',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'total_revenue' => 'nullable|numeric|min:0',
        ]);

        $customer = Client::create($validated);

        return response()->json([
            'message' => 'AR customer created successfully',
            'data' => $customer,
        ], 201);
    }

    /**
     * Get a specific AR customer
     */
    public function show($id): JsonResponse
    {
        $customer = Client::with('contacts', 'accountManager')->find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        return response()->json(['data' => $customer]);
    }

    /**
     * Update an AR customer
     */
    public function update(Request $request, $id): JsonResponse
    {
        $customer = Client::find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'sometimes|email|unique:clients,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Active,Inactive,Archived',
            'type' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'health_score' => 'nullable|integer|min:0|max:100',
            'account_manager_id' => 'nullable|exists:users,id',
            'since' => 'nullable|date',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'total_revenue' => 'nullable|numeric|min:0',
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'AR customer updated successfully',
            'data' => $customer,
        ]);
    }

    /**
     * Delete an AR customer
     */
    public function destroy($id): JsonResponse
    {
        $customer = Client::find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $customer->delete();

        return response()->json(['message' => 'AR customer deleted successfully']);
    }

    /**
     * Add contact to AR customer
     */
    public function addContact(Request $request, $customerId): JsonResponse
    {
        $customer = Client::find($customerId);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:100',
            'is_primary' => 'nullable|boolean',
        ]);

        $contact = ClientContact::create([
            'client_id' => $customerId,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Contact added successfully',
            'data' => $contact,
        ], 201);
    }

    /**
     * Get statistics for AR customers
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_customers' => Client::count(),
            'active_customers' => Client::where('status', 'Active')->count(),
            'inactive_customers' => Client::where('status', 'Inactive')->count(),
            'archived_customers' => Client::where('status', 'Archived')->count(),
            'total_revenue' => Client::sum('total_revenue'),
            'by_type' => Client::groupBy('type')
                ->selectRaw('type, count(*) as count')
                ->pluck('count', 'type')
                ->toArray(),
            'by_industry' => Client::groupBy('industry')
                ->selectRaw('industry, count(*) as count')
                ->pluck('count', 'industry')
                ->toArray(),
        ];

        return response()->json(['data' => $stats]);
    }
}
