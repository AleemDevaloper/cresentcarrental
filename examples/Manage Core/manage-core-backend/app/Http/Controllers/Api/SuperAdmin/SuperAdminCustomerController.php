<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SuperAdminCustomer;
use App\Models\SuperAdminCustomerContact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SuperAdminCustomerController extends Controller
{
    /**
     * Get all superadmin customers (only accessible to superadmin)
     */
    public function index(Request $request): JsonResponse
    {
        // Verify user is super admin
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = SuperAdminCustomer::query();

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
     * Create a new superadmin customer
     */
    public function store(Request $request): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:superadmin_customers,email',
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

        $customer = SuperAdminCustomer::create($validated);

        return response()->json([
            'message' => 'Super Admin customer created successfully',
            'data' => $customer,
        ], 201);
    }

    /**
     * Get a specific superadmin customer
     */
    public function show($id): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $customer = SuperAdminCustomer::with('contacts', 'accountManager')->find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        return response()->json(['data' => $customer]);
    }

    /**
     * Update a superadmin customer
     */
    public function update(Request $request, $id): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $customer = SuperAdminCustomer::find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'sometimes|email|unique:superadmin_customers,email,' . $id,
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
            'message' => 'Super Admin customer updated successfully',
            'data' => $customer,
        ]);
    }

    /**
     * Delete a superadmin customer
     */
    public function destroy($id): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $customer = SuperAdminCustomer::find($id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $customer->delete();

        return response()->json(['message' => 'Super Admin customer deleted successfully']);
    }

    /**
     * Add contact to superadmin customer
     */
    public function addContact(Request $request, $customerId): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $customer = SuperAdminCustomer::find($customerId);

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

        $contact = SuperAdminCustomerContact::create([
            'superadmin_customer_id' => $customerId,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Contact added successfully',
            'data' => $contact,
        ], 201);
    }

    /**
     * Get statistics for superadmin customers
     */
    public function statistics(): JsonResponse
    {
        if (!auth()->user() || !auth()->user()->hasRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_customers' => SuperAdminCustomer::count(),
            'active_customers' => SuperAdminCustomer::where('status', 'Active')->count(),
            'inactive_customers' => SuperAdminCustomer::where('status', 'Inactive')->count(),
            'archived_customers' => SuperAdminCustomer::where('status', 'Archived')->count(),
            'total_revenue' => SuperAdminCustomer::sum('total_revenue'),
            'by_type' => SuperAdminCustomer::groupBy('type')
                ->selectRaw('type, count(*) as count')
                ->pluck('count', 'type')
                ->toArray(),
            'by_industry' => SuperAdminCustomer::groupBy('industry')
                ->selectRaw('industry, count(*) as count')
                ->pluck('count', 'industry')
                ->toArray(),
        ];

        return response()->json(['data' => $stats]);
    }
}
