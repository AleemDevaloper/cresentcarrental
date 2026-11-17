<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::with(['accountManager', 'contacts']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('company_name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('industry')) {
            $query->where('industry', $request->industry);
        }

        return $query->paginate($request->get('per_page', 12));
    }

    public function stats()
    {
        return [
            'total' => Client::count(),
            'active' => Client::where('status', 'Active')->count(),
            'inactive' => Client::where('status', 'Inactive')->count(),
            'archived' => Client::where('status', 'Archived')->count(),
            'growth' => 22.5, // Mock trend data for now
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Active,Inactive,Archived',
            'type' => 'nullable|string',
            'industry' => 'nullable|string',
            'account_manager_id' => 'nullable|exists:users,id',
            'since' => 'nullable|date',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        if ($request->has('contacts')) {
            foreach ($request->contacts as $contact) {
                $client->contacts()->create($contact);
            }
        }

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return $client->load(['accountManager', 'contacts', 'projects']);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'sometimes|required|email|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Active,Inactive,Archived',
            'type' => 'nullable|string',
            'industry' => 'nullable|string',
            'account_manager_id' => 'nullable|exists:users,id',
            'since' => 'nullable|date',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }
}
